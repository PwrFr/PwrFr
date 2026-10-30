import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { useParallax } from "@/lib/use-parallax";
import { education, languages, profile } from "@/lib/resume";

export function Contact() {
  const ref = useRef<HTMLElement>(null);

  // 0 when the footer's top edge enters the screen, 1 when you reach the very bottom.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // The email starts well above its resting place and slides down as you scroll,
  // so it lags behind the rest of the page. Raise the first number for a stronger effect.
  const emailY = useParallax(scrollYProgress, -180, 0);

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative isolate overflow-hidden m-6 bg-paper text-deep rounded-4xl"
    >
      <div className="mx-auto max-w-[100rem] px-6 pb-14 pt-18 sm:px-10 md:pt-32">
        <motion.a
          href={`mailto:${profile.email}`}
          style={{ y: emailY }}
          className="inline-block font-display text-[clamp(2rem,8vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.035em]"
        >
          {profile.email}
        </motion.a>

        <dl className="mt-8 sm:mt-16 grid gap-4 text-lg sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-display text-xl font-bold">Phone</dt>
            <dd className="mt-2">
              <a
                href={`tel:${profile.phone}`}
                className="underline underline-offset-4"
              >
                {profile.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-display text-xl font-bold">GitHub</dt>
            <dd className="mt-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                github.com/PwrFr
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-display text-xl font-bold">Education</dt>
            <dd className="mt-2 leading-snug">
              {education.school}
              <br />
              {education.program}, {education.years}
            </dd>
          </div>
          <div>
            <dt className="font-display text-xl font-bold">Languages</dt>
            <dd className="mt-2">
              {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
            </dd>
          </div>
        </dl>

        <p className="mt-12 sm:mt-24 text-deep/70">
          Pawaris Wongsaied, Frontend Developer
        </p>
      </div>
    </footer>
  );
}
