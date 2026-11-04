import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

// Placeholder projects — swap in real ones (add `image: "/screens/x.webp"` to show a screenshot).
type Project = {
  name: string;
  tagline: string;
  stack: string[];
  accent: string; // tailwind gradient classes for the placeholder screen
  image?: string;
};

const projects: Project[] = [
  {
    name: "Project One",
    tagline: "A short line about what this project does and why it matters.",
    stack: ["React", "TypeScript", "Tailwind"],
    accent: "from-orange-500 via-rose-500 to-fuchsia-600",
  },
  {
    name: "Project Two",
    tagline: "Another placeholder describing the problem and the outcome.",
    stack: ["Next.js", "Node", "Postgres"],
    accent: "from-sky-500 via-indigo-500 to-violet-600",
  },
  {
    name: "Project Three",
    tagline: "Third placeholder — replace with a real project summary.",
    stack: ["Three.js", "R3F", "GSAP"],
    accent: "from-emerald-400 via-teal-500 to-cyan-600",
  },
];

// Display area inside /Macbook.webp (5150×3081), as % of the image.
// Black lid spans x 300–4849, y 3–2821 px; inset ~60px for the bezel.
const SCREEN = { left: "7%", top: "2.5%", width: "86%", height: "86%" };

function Screen({ project }: { project: Project }) {
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

  // Screen position follows scroll 1:1 — holds still around each stop, slides between.
  const n = projects.length;
  const input = stops.flatMap((c) => [c - HOLD_WIDTH / 2, c + HOLD_WIDTH / 2]);
  const output = stops.flatMap((_, i) => [i, i]);
  const track = useTransform(scrollYProgress, input, output);
  const screenY = useTransform(track, (t) => `${(-t / n) * 100}%`);

  useMotionValueEvent(track, "change", (t: number) => {
    const i = Math.round(t);
    if (i !== active) setActive(i);
  });

  // Laptop eases in as the section pins
  const scale = useTransform(scrollYProgress, [0, 0.12], [0.85, 1]);
  const project = projects[active];

  return (
    <section
      id="projects"
      ref={ref}
      className="relative bg-neutral-950 text-neutral-50"
      style={{ height: `${projects.length * VH_PER_PROJECT + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6">
        <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.03em]">
          Projects
        </h2>

        <motion.div style={{ scale }} className="relative w-full max-w-5xl">
          <img
            src="/Macbook.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none block h-auto w-full select-none"
          />
          <div
            className="absolute overflow-hidden rounded-t-[0.6%] bg-black"
            style={SCREEN}
          >
            <motion.div
              className="absolute inset-x-0 top-0 will-change-transform"
              style={{ y: screenY, height: `${n * 100}%` }}
            >
              {projects.map((p) => (
                <div key={p.name} style={{ height: `${100 / n}%` }}>
                  <Screen project={p} />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="flex w-full max-w-5xl items-start justify-between gap-6">
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
          <div className="flex items-center gap-2 pt-2" aria-hidden="true">
            {projects.map((p, i) => (
              <span
                key={p.name}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-neutral-50" : "w-1.5 bg-neutral-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
