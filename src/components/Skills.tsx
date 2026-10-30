"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { useParallax } from "@/lib/use-parallax";
import { skillGroups } from "@/lib/resume";

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Each column moves at its own pace so the grid slowly shears while you scroll.
  const speeds: [number, number][] = [
    [40, -40],
    [-30, 60],
    [60, -20],
    [-10, 30],
  ];
  const y0 = useParallax(scrollYProgress, ...speeds[0]);
  const y1 = useParallax(scrollYProgress, ...speeds[1]);
  const y2 = useParallax(scrollYProgress, ...speeds[2]);
  const y3 = useParallax(scrollYProgress, ...speeds[3]);
  const ys = [y0, y1, y2, y3];

  return (
    <section
      ref={ref}
      id="skills"
      className="overflow-hidden bg-deep px-6 pb-28 pt-8 text-paper sm:px-10 md:pb-40"
    >
      <div className="mx-auto max-w-[110rem]">
        <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.03em]">
          What I work with
        </h2>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g, i) => (
            <motion.div key={g.label} style={{ y: ys[i] }}>
              <h3 className="font-display text-2xl font-bold">{g.label}</h3>
              <ul className="mt-5 space-y-3 text-lg">
                {g.items.map((s) => (
                  <li
                    key={s.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-paper/15 pb-2"
                  >
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
