import { useState, useRef, useCallback, useEffect } from 'react';
import type { Step } from '../algorithms/types';

export interface PlayerControls<S> {
  step: Step<S>;
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  prev: () => void;
  next: () => void;
  reset: () => void;
  togglePlay: () => void;
  setSpeed: (s: number) => void;
  seek: (i: number) => void;
}

export function usePlayer<S>(steps: Step<S>[]): PlayerControls<S> {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setIndex((i) => {
          if (i >= steps.length - 1) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, 1000 / speed);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [playing, speed, steps.length, clearTimer]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(steps.length - 1, i + 1)), [steps.length]);
  const reset = useCallback(() => { setIndex(0); setPlaying(false); }, []);
  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const seek = useCallback((i: number) => setIndex(i), []);

  return {
    step: steps[index] ?? steps[0],
    index,
    total: steps.length,
    playing,
    speed,
    prev,
    next,
    reset,
    togglePlay,
    setSpeed,
    seek,
  };
}
