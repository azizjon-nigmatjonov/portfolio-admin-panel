import { useEffect, useRef, useState } from "react";

/**
 * Returns a throttled value that updates at most once every `delay` ms.
 * The first value is returned immediately; subsequent updates are throttled.
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdateTimeRef = useRef<number>(-1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = lastUpdateTimeRef.current >= 0 ? now - lastUpdateTimeRef.current : delay;
    const isFirstRun = lastUpdateTimeRef.current < 0;

    if (isFirstRun || elapsed >= delay) {
      lastUpdateTimeRef.current = now;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      const remaining = delay - elapsed;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastUpdateTimeRef.current = Date.now();
        setThrottledValue(value);
        timeoutRef.current = null;
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay]);

  return throttledValue;
}
