import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Drives the 0 → 100 progress on the analysis and path-building screens, then
 * hands off to the next screen after a short settle.
 *
 * The ramp restarts whenever the screen regains focus, so backing into it
 * replays the animation instead of showing a finished bar.
 */
export function useRamp(
  onDone?: () => void,
  { step = 3, interval = 85, settle = 750 }: { step?: number; interval?: number; settle?: number } = {},
) {
  const [pct, setPct] = useState(0);
  const cb = useRef(onDone);
  cb.current = onDone;

  useFocusEffect(
    useCallback(() => {
      setPct(0);
      let value = 0;
      let settleTimer: ReturnType<typeof setTimeout> | undefined;

      const id = setInterval(() => {
        value = Math.min(100, value + step);
        setPct(value);
        if (value >= 100) {
          clearInterval(id);
          settleTimer = setTimeout(() => cb.current?.(), settle);
        }
      }, interval);

      return () => {
        clearInterval(id);
        if (settleTimer) clearTimeout(settleTimer);
      };
    }, [step, interval, settle]),
  );

  return pct;
}
