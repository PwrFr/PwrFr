"use client";
import { User } from "defyne-icons";
import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { useParallax } from "@/lib/use-parallax";
import { profile, roles, type Role } from "@/lib/resume";

function RoleBlock({ role }: { role: Role }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The ghost year drifts slower than the page, the heading column a touch faster.
  const ghostY = useParallax(scrollYProgress, -140, 140);
  const headY = useParallax(scrollYProgress, 30, -30);

  return (
    <article
      ref={ref}
      className="relative grid gap-10 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12 md:py-32"
    >
      <motion.span
        aria-hidden="true"
        style={{ y: ghostY }}
        className="text-outline-deep opacity-15 pointer-events-none absolute -top-4 right-0 z-0 select-none font-display text-[clamp(8rem,28vw,26rem)] font-extrabold leading-none tracking-[-0.05em]"
      >
        {role.ghost}
      </motion.span>

      <motion.header style={{ y: headY }} className="self-start">
        <h3 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          {role.company}
        </h3>
        <p className="mt-2 text-lg">{role.place}</p>
        <p className="mt-6 font-display text-xl font-semibold">{role.title}</p>
        <p className="mt-1">
          {role.from} to {role.to}
        </p>
      </motion.header>

      <ul className="space-y-5 text-lg leading-relaxed md:max-w-[62ch]">
        {role.points.map((p) => (
          <li key={p} className="border-l-2 border-line/30 pl-5">
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Experience() {
  return (
    <section id="work" className="relative overflow-hidden bg-deep text-paper">
      <div className="mx-auto max-w-[95rem] px-6 pt-24 sm:px-24 md:pt-36">
        <User className="stroke-3 size-30" />
        <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.03em]">
          Where I have built things
        </h2>
        <p className="mt-8 max-w-[60ch] text-xl leading-relaxed">
          {profile.summary}
        </p>

        <div className="mt-10 divide-y divide-deep/15">
          {roles.map((r) => (
            <RoleBlock key={r.company} role={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
