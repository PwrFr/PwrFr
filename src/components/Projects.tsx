import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { easeInOutCubic, lenisRef } from "@/lib/lenis";
import { useParallax } from "@/lib/use-parallax";

// Placeholder projects — swap in real ones (add `image: "/screens/x.webp"` to show a screenshot).
type Project = {
  name: string;
  tagline: string;
  stack: string[];
  accent?: string; // tailwind gradient classes for the placeholder screen
  image?: string;
  video?: string; // screen recording, plays while this project is on screen
  url?: string; // live site — clicking the screen opens it
};

const projects: Project[] = [
  {
    name: "Defyne Icons",
    tagline:
      "Icons for React: designed as one set, typed, and ready for Tailwind.",
    stack: ["React", "TypeScript", "SVGR", "SVGO"],
    video: "/export-1793781431413.mp4",
    url: "https://defyne-docs.vercel.app",
  },
  {
    name: "HBP Battery",
    tagline:
      "a battery service that comes to you: battery replacement, emergency jump-starts and basic checks.",
    stack: ["Vue", "Vite", "Tailwind"],
    video: "/export-1793848419021.mp4",
    url: "https://hbpbattery.com/", // TODO: real project URL
  },
  // {
  //   name: "Project Three",
  //   tagline: "Third placeholder — replace with a real project summary.",
  //   stack: ["Three.js", "R3F", "GSAP"],
  //   accent: "from-emerald-400 via-teal-500 to-cyan-600",
  // },
];

// Display area inside /Macbook.webp (5150×3081), as % of the image.
// Black lid spans x 300–4849, y 3–2821 px; inset ~60px for the bezel.
const SCREEN = { left: "7%", top: "2.5%", width: "86%", height: "86%" };

function Placeholder({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${project.name} screenshot`}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  // Fake website so the placeholder reads as "a project on a screen"
  return (
    <div
      className={`relative h-full w-full bg-gradient-to-br ${project.accent}`}
    >
      <div className="flex items-center justify-between px-[4%] py-[2.5%] text-[clamp(6px,1vw,12px)] font-medium text-white/90">
        <span className="font-display font-bold">{project.name}</span>
        <span className="flex gap-[1.5em] opacity-80">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </span>
      </div>
      <div className="absolute inset-x-[6%] top-1/2 -translate-y-1/2 text-white">
        <p className="font-display text-[clamp(14px,4vw,56px)] font-extrabold leading-none tracking-tight">
          {project.name}
        </p>
        <p className="mt-[2%] max-w-[60%] text-[clamp(7px,1.2vw,16px)] opacity-90">
          {project.tagline}
        </p>
      </div>
      <div className="absolute bottom-[6%] left-[6%] right-[6%] grid grid-cols-3 gap-[2%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-[4px] bg-white/20 backdrop-blur-sm"
          />
        ))}
      </div>
    </div>
  );
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Pill that trails the cursor while hovering the screen. Fixed-positioned, so it
 *  must render outside any transformed ancestor (the scaled laptop). */
function CursorTooltip({
  x,
  y,
  show,
  label,
}: {
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  show: boolean;
  label: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x, y }}
    >
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="block -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg"
          >
            {label} <span aria-hidden="true">↗</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Middle of each project's slice of the section (as 0–1 scroll progress).
const stops = projects.map((_, i) => (i + 0.5) / projects.length);
// How much of each slice the project stays still for (0–1); the rest is the slide.
const HOLD = 0.5;
const HOLD_WIDTH = HOLD / projects.length;
// Scroll height per project, in vh — raise it to make every step slower.
const VH_PER_PROJECT = 160;

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Which project label is showing — holds around each stop.
  const input = stops.flatMap((c) => [c - HOLD_WIDTH / 2, c + HOLD_WIDTH / 2]);
  const output = stops.flatMap((_, i) => [i, i]);
  const track = useTransform(scrollYProgress, input, output);

  // A project's video plays only while that project is on screen and the section is
  // in view; it restarts each time the section is entered.
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  // Section is several screens tall, so trigger once its top is 40% up the viewport.
  const inView = useInView(ref, { margin: "0px 0px -40% 0px" });

  useEffect(() => {
    if (!inView) return;
    for (const v of Object.values(videoRefs.current)) if (v) v.currentTime = 0;
  }, [inView]);

  useEffect(() => {
    projects.forEach((p, i) => {
      const v = videoRefs.current[p.name];
      if (!v) return;
      if (inView && i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [inView, active]);

  useMotionValueEvent(track, "change", (t: number) => {
    const i = Math.round(t);
    if (i !== active) setActive(i);
  });

  // Scroll the page to a project's stop (its screen and label follow from scroll).
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const target = top + stops[i] * range;
    const lenis = lenisRef.current;
    if (lenis)
      lenis.scrollTo(target, { duration: 1.2, easing: easeInOutCubic });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Cursor-following tooltip over the screen (springs for a soft trail)
  const [hovering, setHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tipX = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.4 });
  const tipY = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.4 });
  const onScreenMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch: just tap the link
    if (!hovering) {
      // Jump straight to the cursor on enter instead of flying in from (0,0)
      tipX.jump(e.clientX);
      tipY.jump(e.clientY);
      setHovering(true);
    }
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Ghost word drifts down the pinned screen as you scroll through the section
  const ghostY = useParallax(scrollYProgress, 40, -80);

  // Laptop eases in as the section pins
  const scale = useTransform(scrollYProgress, [0, 0.12], [0.85, 1]);
  const project = projects[active];

  return (
    <section
      id="projects"
      ref={ref}
      className="relative bg-paper text-deep"
      style={{ height: `${projects.length * VH_PER_PROJECT + 100}vh` }}
    >
      <div className="sticky top-0 isolate flex h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6">
        {/* Ghost word lives inside the pinned viewport, so it stays on screen for the
            whole section and drifts slowly with scroll behind the content. */}
        <motion.span
          aria-hidden="true"
          style={{ y: ghostY }}
          className="text-outline-deep opacity-5 pointer-events-none absolute top-0 right-0 -z-10 select-none font-display text-[clamp(8rem,20vw,18rem)] font-extrabold leading-none tracking-[-0.05em]"
        >
          Project
        </motion.span>
        {/* <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.03em]">
          Projects
        </h2> */}
        <div className="flex w-full max-w-5xl items-start justify-center text-center gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-display text-5xl font-bold">
                {project.name}
              </h2>
              <p className="mt-1 text-neutral-200">{project.tagline}</p>
              <span className="mt-1 text-sm text-neutral-400">
                {project.stack.join(" · ")}
              </span>
            </motion.div>
          </AnimatePresence>
          {/* <div className="flex items-center gap-2 pt-2" aria-hidden="true">
            {projects.map((p, i) => (
              <span
                key={p.name}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-neutral-50" : "w-1.5 bg-neutral-600"
                }`}
              />
            ))}
          </div> */}
        </div>

        <motion.div style={{ scale }} className="relative w-full max-w-5xl">
          <img
            src="/Macbook.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none block h-auto w-full select-none"
          />
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              project.url
                ? `Visit ${project.name} (opens in a new tab)`
                : undefined
            }
            onPointerMove={project.url ? onScreenMove : undefined}
            onPointerLeave={() => setHovering(false)}
            className={`absolute block overflow-hidden rounded-lg bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-50 ${
              project.url ? "cursor-none" : "pointer-events-none"
            }`}
            style={SCREEN}
          >
            {/* Videos stay mounted so they keep buffering; fade in when active */}
            {projects.map((p, i) =>
              p.video ? (
                <video
                  key={p.name}
                  ref={(el) => {
                    videoRefs.current[p.name] = el;
                  }}
                  src={p.video}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500"
                  style={{ opacity: i === active ? 1 : 0 }}
                  muted
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  loop
                  disablePictureInPicture
                  aria-label={`${p.name} walkthrough`}
                />
              ) : null,
            )}
            <AnimatePresence initial={false}>
              {!project.video && (
                <motion.div
                  key={project.name}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Placeholder project={project} />
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        </motion.div>

        <CursorTooltip
          x={tipX}
          y={tipY}
          show={hovering && !!project.url}
          label={project.url ? `Visit ${hostOf(project.url)}` : ""}
        />

        <div className="flex w-full max-w-5xl items-start justify-end gap-6">
          {/* <AnimatePresence mode="wait">
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-display text-2xl font-bold">{project.name}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {project.stack.join(" · ")}
              </p>
            </motion.div>
          </AnimatePresence> */}
          <nav className="flex items-center gap-1" aria-label="Projects">
            {projects.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${p.name}`}
                aria-current={i === active ? "true" : undefined}
                className="group cursor-pointer rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-neutral-50"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === active
                      ? "w-8 bg-neutral-50"
                      : "w-1.5 bg-neutral-600 group-hover:bg-neutral-400"
                  }`}
                />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
