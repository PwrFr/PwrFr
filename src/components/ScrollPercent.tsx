import { motion, useScroll, useTransform } from "motion/react";

/**
 * Page-wide scroll indicator that replaces the native scrollbar:
 * a thin track on the right edge that fills as you scroll, with the live
 * percentage riding alongside the tip of the fill.
 * mix-blend-difference keeps it readable over both light and dark sections.
 */
export function ScrollPercent() {
  const { scrollYProgress } = useScroll();
  const percent = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);
  // Label follows the fill tip: top goes 0→100% of the track, and it shifts up by
  // its own height proportionally so it never runs off either end.
  const top = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const y = useTransform(scrollYProgress, (v) => `${-v * 100}%`);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-[100] py-6 pr-3 text-white mix-blend-difference"
    >
      <div className="relative h-full w-px bg-white/25">
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top bg-white"
          style={{ scaleY: scrollYProgress }}
        />
        <motion.span
          className="absolute right-2 font-display text-xs font-semibold tabular-nums leading-none whitespace-nowrap"
          style={{ top, y }}
        >
          {percent}
        </motion.span>
      </div>
    </div>
  );
}
