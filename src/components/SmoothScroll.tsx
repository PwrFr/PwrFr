import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { cancelFrame, frame, useReducedMotion } from "motion/react";

/**
 * Inertia scrolling. The page glides toward where you scrolled instead of
 * jumping there, which gives the heavy, viscous feel.
 *
 * Tune the feel with `lerp`: lower is thicker and slower to settle
 * (0.05 is syrup, 0.1 is light, 1 turns smoothing off).
 */
const LERP = 0.07;
const WHEEL_MULTIPLIER = 0.85;

/** The section the hero hands over to. Give that section this id. */
const BAND_ID = "signal-band";
/** Seconds the automatic scroll takes. This is also how long the hero zoom plays. */
const JUMP_DURATION = 2;
/** Ignore the tail of a trackpad swipe for this long (ms) after a jump lands. */
const COOLDOWN_MS = 400;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (reduce || isMobile) return;

    const lenis = new Lenis({
      lerp: LERP,
      wheelMultiplier: WHEEL_MULTIPLIER,
      smoothWheel: true,
      autoRaf: false,
    });

    // Share Motion's frame loop so scroll-linked animations never lag the scroll.
    const update = ({ timestamp }: { timestamp: number }) =>
      lenis.raf(timestamp);
    frame.update(update, true);

    // Scrolling from the top plays the whole hero zoom and lands on the band.
    // Scrolling up from the band plays it in reverse.
    let jumping = false;
    let cooldownUntil = 0;

    const bandTop = () => {
      const el = document.getElementById(BAND_ID);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    };

    const jumpTo = (to: number) => {
      jumping = true;
      lenis.scrollTo(to, {
        duration: JUMP_DURATION,
        easing: easeInOutCubic,
        lock: true,
        force: true,
        onComplete: () => {
          jumping = false;
          cooldownUntil = performance.now() + COOLDOWN_MS;
        },
      });
    };

    /** Starts a jump if this scroll direction calls for one. Returns true when it did. */
    const handle = (dir: 1 | -1) => {
      const top = bandTop();
      if (top === null) return false;
      const y = window.scrollY;
      if (dir === 1 && y < top - 4) {
        jumpTo(top);
        return true;
      }
      if (dir === -1 && Math.abs(y - top) <= 4) {
        jumpTo(0);
        return true;
      }
      return false;
    };

    const busy = () => jumping || performance.now() < cooldownUntil;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch zoom
      if (busy()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (Math.abs(e.deltaY) < 1) return;
      if (handle(e.deltaY > 0 ? 1 : -1)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;
      let dir: 1 | -1 | 0 = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " ") dir = e.shiftKey ? -1 : 1;
      if (!dir) return;
      if (busy()) {
        e.preventDefault();
        return;
      }
      if (handle(dir)) e.preventDefault();
    };

    let touchStartY = 0;
    let touchHandled = false;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchHandled = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (busy()) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      if (touchHandled) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < 14) return;
      if (handle(dy > 0 ? 1 : -1)) {
        touchHandled = true;
        if (e.cancelable) e.preventDefault();
      }
    };

    // Capture phase, so this runs before Lenis sees the same event.
    window.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelFrame(update);
      lenis.destroy();
    };
  }, [reduce, isMobile]);

  return <>{children}</>;
}
