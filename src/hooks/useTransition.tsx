import { MotionValue, useTransform } from "motion/react";

export const useTransition = ({
  progress,
  reduce,
  start = 0,
  end = 40,
  duration = 2,
  distance = 0,
}: {
  progress: MotionValue<number>;
  reduce?: boolean;
  start: number;
  end: number;
  duration: number;
  distance: number;
}) => {
  return useTransform(
    progress,
    [duration - distance, duration],
    reduce ? [0, 0] : [start, end],
  );
};
