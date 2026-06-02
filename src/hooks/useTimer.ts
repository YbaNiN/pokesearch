import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  duration: number; // segundos
  onExpire: () => void;
  onTick?: (remaining: number) => void;
}

interface UseTimerReturn {
  remaining: number;   // segundos restantes (puede ser decimal)
  progress: number;    // 0..1
  running: boolean;
  start: () => void;
  stop: () => void;
}

const INTERVAL = 50; // ms

export function useTimer({ duration, onExpire, onTick }: UseTimerOptions): UseTimerReturn {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const endRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastWholeRef = useRef<number>(Math.ceil(duration));
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);

  const clear = useCallback(() => {
    if (rafRef.current !== null) {
      clearInterval(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
  }, [clear]);

  const start = useCallback(() => {
    clear();
    endRef.current = Date.now() + duration * 1000;
    lastWholeRef.current = Math.ceil(duration);
    setRemaining(duration);
    setRunning(true);

    rafRef.current = window.setInterval(() => {
      const ms = endRef.current - Date.now();
      const sec = Math.max(0, ms / 1000);
      setRemaining(sec);

      const whole = Math.ceil(sec);
      if (whole < lastWholeRef.current && whole > 0) {
        lastWholeRef.current = whole;
        onTickRef.current?.(whole);
      }

      if (ms <= 0) {
        clear();
        setRunning(false);
        setRemaining(0);
        onExpireRef.current();
      }
    }, INTERVAL);
  }, [duration, clear]);

  useEffect(() => clear, [clear]);

  return {
    remaining,
    progress: duration === 0 ? 0 : remaining / duration,
    running,
    start,
    stop,
  };
}
