"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { SplitText } from "./SplitText";
import { profile } from "@/lib/resume";
import Scene from "./Scene";

/** Share of the pinned scroll spent zooming; the rest holds on the full-screen letter. */
const ZOOM_END = 0.9;
/** Which letter of the first name to zoom into: index 5 is the "i" in "Pawaris". */
const TARGET_CHAR = 5;
const TARGET_GLYPH = "i";
const HERO_BG = "#0e0f13";
const TEXT_ZOOM_CAP = 30;

/**
 * Finds the vertical stem of a glyph by drawing it on a canvas.
 * All values are in em, relative to the glyph's pen position and baseline.
 */
function measureStem(family: string, weight: string, ch: string) {
  const size = 400;
  const pad = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const base = size * 1.4;
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.fillStyle = "#000";
  ctx.fillText(ch, pad, base);

  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  const solid = (x: number, y: number) => data[(y * width + x) * 4 + 3] > 127;

  const rowY = Math.round(base - size * 0.2);
  let left = -1;
  let right = -1;
  for (let x = 0; x < width; x++) {
    if (solid(x, rowY)) {
      if (left < 0) left = x;
      right = x;
    }
  }
  if (left < 0) return null;

  const cx = Math.round((left + right) / 2);
  let top = rowY;
  let bottom = rowY;
  while (top > 0 && solid(cx, top - 1)) top--;
  while (bottom < height - 1 && solid(cx, bottom + 1)) bottom++;

  return {
    left: (left - pad) / size,
    right: (right + 1 - pad) / size,
    top: (top - base) / size,
    bottom: (bottom + 1 - base) / size,
  };
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const maxZoom = useMotionValue(1);
  const shiftX = useMotionValue(0);
  const shiftY = useMotionValue(0);
  const originX = useMotionValue("50%");
  const originY = useMotionValue("50%");

  const fillLeft = useMotionValue(0);
  const fillTop = useMotionValue(0);
  const fillWidth = useMotionValue(0);
  const fillHeight = useMotionValue(0);

  const zoom = useTransform(scrollYProgress, (p) =>
    Math.min(p / ZOOM_END, 1.1),
  );
  const fullScale = useTransform([zoom, maxZoom], ([z, s]: number[]) =>
    Math.exp(Math.log(s) * z),
  );
  const nameScale = useTransform(fullScale, (s) => Math.min(s, TEXT_ZOOM_CAP));
  const travel = useTransform(fullScale, (s) =>
    Math.min(1, Math.log(s) / Math.log(TEXT_ZOOM_CAP)),
  );
  const nameX = useTransform([travel, shiftX], ([t, d]: number[]) => t * d);
  const nameY = useTransform([travel, shiftY], ([t, d]: number[]) => t * d);
  const fillVisibility = useTransform(fullScale, (s) =>
    s >= TEXT_ZOOM_CAP * 0.98 ? "visible" : "hidden",
  );

  const detailsOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const detailsY = useTransform(
    scrollYProgress,
    [0, 0.08],
    reduce ? [0, 0] : [0, 40],
  );

  const detailsX = useTransform(
    scrollYProgress,
    [0, 2],
    reduce ? [0, 0] : [0, 1500],
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;

    const measure = async () => {
      await document.fonts.load('800 100px "Bricolage Grotesque Variable"');
      await document.fonts.ready;
      const stage = stageRef.current;
      const title = titleRef.current;
      if (cancelled || !stage || !title) return;

      const spans = title
        .querySelector<HTMLElement>("span.block")
        ?.querySelectorAll<HTMLElement>('[aria-hidden="true"] > span');
      const char = spans ? spans[TARGET_CHAR] : null;

      const style = getComputedStyle(title);
      const fontPx = parseFloat(style.fontSize);
      const stem = measureStem(
        style.fontFamily,
        style.fontWeight,
        TARGET_GLYPH,
      );

      const stageRect = stage.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const w = stageRect.width;
      const h = stageRect.height;

      if (!char || !stem) {
        maxZoom.set(Math.max(w, h) / 20);
        fillLeft.set(w / 2 - 20);
        fillTop.set(h / 2 - 20);
        fillWidth.set(40);
        fillHeight.set(40);
        return;
      }

      // Robust measurement with getBoundingClientRect() works reliably with text-center
      const charRect = char.getBoundingClientRect();
      const charXWithinStage = charRect.left - stageRect.left;
      const charYWithinStage = charRect.top - stageRect.top;

      // Stem center relative to stage
      const stemX = charXWithinStage + charRect.width / 2;
      const stemY = charYWithinStage + charRect.height / 2;

      const halfW = ((stem.right - stem.left) / 2) * fontPx;
      const halfH = ((stem.bottom - stem.top) / 2) * fontPx;

      // Zoom factor so stem covers screen
      maxZoom.set(Math.max(w / 2 / halfW, h / 2 / halfH) * 1.1);

      // Distance required to glide the stem to the exact stage center
      shiftX.set(w / 2 - stemX);
      shiftY.set(h / 2 - stemY);

      // Sizing and positioning the takeover overlay
      fillLeft.set(stemX - halfW + 2);
      fillTop.set(stemY - halfH + 2);
      fillWidth.set(halfW * 2.5 - 4);
      fillHeight.set(halfH * 2 - 4);

      // Origin inside title element (crucial for centered scale)
      const originXPos = stemX - (titleRect.left - stageRect.left);
      const originYPos = stemY - (titleRect.top - stageRect.top);

      originX.set(`${originXPos}px`);
      originY.set(`${originYPos}px`);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [
    reduce,
    maxZoom,
    shiftX,
    shiftY,
    originX,
    originY,
    fillLeft,
    fillTop,
    fillWidth,
    fillHeight,
  ]);

  return (
    <section
      ref={sectionRef}
      className={
        reduce || isMobile ? "relative min-h-svh" : "relative h-[320svh]"
      }
    >
      <div
        ref={stageRef}
        style={{ backgroundColor: HERO_BG }}
        className={`${
          reduce ? "relative min-h-svh" : "sticky top-0 h-svh"
        } isolate flex flex-col items-center justify-center overflow-hidden text-white`}
      >
        <motion.div
          style={isMobile ? {} : { x: detailsX }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
          className="relative block w-full h-[50vh] md:absolute md:right-0 md:top-0 md:w-2/3 md:h-full z-0"
        >
          <Scene />
        </motion.div>

        <div className="relative mx-auto w-full max-w-[90rem] px-6 sm:px-10 z-50">
          <motion.h1
            ref={titleRef}
            style={
              isMobile
                ? {}
                : { scale: nameScale, x: nameX, y: nameY, originX, originY }
            }
            className="font-display font-extrabold text-deep leading-[0.86] tracking-[-0.035em] text-[clamp(3.6rem,15.5vw,15rem)] text-center md:text-left"
          >
            <span className="block">
              <SplitText text={profile.name[0]} />
            </span>
            <span className="block">
              <SplitText text={profile.name[1]} delay={0.55} />
            </span>
          </motion.h1>

          <motion.div
            style={isMobile ? {} : { opacity: detailsOpacity, y: detailsY }}
            className="mt-10 max-w-xl text-center md:text-left mx-auto md:mx-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            >
              <p className="font-display text-2xl font-semibold sm:text-3xl">
                {profile.role}
              </p>
              <p className="mt-3 text-lg leading-relaxed text-white/80">
                {profile.tagline}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Takes over from the letter once it stops growing, and fills the screen */}
        {!isMobile && (
          <motion.div
            aria-hidden="true"
            style={{
              left: fillLeft,
              top: fillTop,
              width: fillWidth,
              height: fillHeight,
              scale: fullScale,
              x: nameX,
              y: nameY,
              visibility: fillVisibility,
            }}
            className="pointer-events-none absolute bg-deep z-50"
          />
        )}
      </div>
    </section>
  );
}
