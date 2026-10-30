"use client";

import { useReducedMotion, useTransform, type MotionValue } from "motion/react";

/**
 * Maps scroll progress (0..1) to a pixel/percent offset.
 * Collapses to zero when the visitor prefers reduced motion.
 */
export function useParallax(
  progress: MotionValue<number>,
  from: number,
  to: number,
) {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [0, 0] : [from, to]);
}
