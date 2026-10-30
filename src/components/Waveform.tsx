"use client";

import { motion, useReducedMotion } from "motion/react";

type WaveformProps = {
  bars?: number;
  seed?: number;
  /** Bar width as a share of its slot (0..1). */
  fill?: number;
  className?: string;
  /** Seconds before the first bar grows in. */
  delay?: number;
};

const W = 1200;
const H = 200;

function heights(n: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / n;
    const v =
      Math.sin(t * 9 + seed) * 0.55 +
      Math.sin(t * 23 + seed * 2) * 0.3 +
      Math.sin(t * 51 + seed * 3) * 0.15;
    // Envelope keeps the centre loud and the edges quiet, like a speech clip.
    const env = 0.35 + 0.65 * Math.sin(Math.PI * t);
    return Number((0.1 + Math.abs(v) * env * 0.9).toFixed(3));
  });
}

export function Waveform({
  bars = 90,
  seed = 1,
  fill = 0.5,
  className,
  delay = 0,
}: WaveformProps) {
  const reduce = useReducedMotion();
  const hs = heights(bars, seed);
  const slot = W / bars;
  const bw = Number((slot * fill).toFixed(3));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {hs.map((h, i) => {
        const bh = Number((h * H).toFixed(2));
        return (
          <motion.rect
            key={i}
            x={Number((i * slot + (slot - bw) / 2).toFixed(2))}
            y={Number(((H - bh) / 2).toFixed(2))}
            width={bw}
            height={bh}
            rx={bw / 2}
            fill="currentColor"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 14,
              delay: delay + i * 0.012,
            }}
          />
        );
      })}
    </svg>
  );
}
