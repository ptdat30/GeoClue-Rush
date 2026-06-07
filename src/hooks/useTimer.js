import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Countdown timer hook
 * @param {number} duration - Total duration in seconds
 * @param {boolean} active - Whether the timer is running
 * @param {function} onComplete - Callback when timer reaches 0
 */
export default function useTimer(duration = 15, active = false, onComplete = null) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [progress, setProgress] = useState(1); // 1 = full, 0 = empty
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const reset = useCallback(() => {
    setTimeRemaining(duration);
    setProgress(1);
    startTimeRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [duration]);

  useEffect(() => {
    if (!active) {
      reset();
      return;
    }

    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(duration - elapsed, 0);
      const prog = remaining / duration;

      setTimeRemaining(remaining);
      setProgress(prog);

      if (remaining <= 0) {
        if (onComplete) onComplete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active, duration, onComplete, reset]);

  return {
    timeRemaining: Math.ceil(timeRemaining),
    timeRemainingExact: timeRemaining,
    progress,
    reset,
    elapsed: duration - timeRemaining,
  };
}
