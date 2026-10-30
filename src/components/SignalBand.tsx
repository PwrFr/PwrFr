import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const rowA = "signaling, ICE, STUN, TURN, SDP, SIP, WebRTC, ";
const rowB = "FreeSWITCH, 3CX, Avaya, RNNoise, sip.js, softphones, ";

/** Hard shadow: no blur, offset scales with the font size. Change the colour or offset here. */
// const SOLID_SHADOW = "[text-shadow:0.090em_0.090em_0_#16161640]";

/** Two rows of oversized text that drift in opposite directions as you scroll past. */
export function SignalBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const left = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["4%", "-28%"],
  );
  const right = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-28%", "4%"],
  );

  const rowClass = `whitespace-nowrap font-display text-[clamp(3rem,9vw,9rem)] font-extrabold leading-[1.1] tracking-[-0.03em]`;

  return (
    <div
      ref={ref}
      id="signal-band"
      aria-hidden="true"
      className="overflow-hidden bg-deep text-paper py-16 sm:py-24"
    >
      <motion.p style={{ x: left }} className={rowClass}>
        {rowA.repeat(4)}
      </motion.p>
      <motion.p style={{ x: right }} className={`${rowClass} text-outline`}>
        {rowB.repeat(4)}
      </motion.p>
    </div>
  );
}
