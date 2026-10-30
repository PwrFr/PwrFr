"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type SplitTextProps = {
  text: string;
  className?: string;
  /** Seconds before the first character starts. */
  delay?: number;
  /** Seconds between characters. */
  stagger?: number;
  /** Play when scrolled into view instead of on page load. */
  inView?: boolean;
};

const PAD = "0.14em";

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  inView = false,
}: SplitTextProps) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const char: Variants = {
    hidden: { y: "115%", rotate: 8 },
    visible: {
      y: "0%",
      rotate: 0,
      transition: { type: "spring", stiffness: 120, damping: 17, mass: 0.9 },
    },
  };

  const trigger = inView
    ? { whileInView: "visible", viewport: { once: true, amount: 0.6 } }
    : { animate: "visible" };

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      {...trigger}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((c, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{
              paddingTop: PAD,
              paddingBottom: PAD,
              marginTop: `-${PAD}`,
              marginBottom: `-${PAD}`,
            }}
          >
            <motion.span variants={char} className="inline-block will-change-transform">
              {c === " " ? " " : c}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
}
