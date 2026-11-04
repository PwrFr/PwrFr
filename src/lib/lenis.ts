import type Lenis from "lenis";

/** The live Lenis instance (null on mobile / reduced motion), for sections that drive scroll. */
export const lenisRef: { current: Lenis | null } = { current: null };

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
