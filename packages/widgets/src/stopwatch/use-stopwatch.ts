"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface StopwatchState {
  /** Whether the stopwatch is currently counting. */
  running: boolean;
  /** Elapsed ms accumulated across all finished run segments. */
  accumulatedMs: number;
  /** Epoch ms when the current run segment began, or null when paused. */
  startedAt: number | null;
  /** Total elapsed (ms) captured at each lap. */
  laps: number[];
}

const INITIAL: StopwatchState = {
  running: false,
  accumulatedMs: 0,
  startedAt: null,
  laps: [],
};

function readState(key: string): StopwatchState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StopwatchState>;
    if (
      typeof parsed.accumulatedMs !== "number" ||
      typeof parsed.running !== "boolean"
    ) {
      return null;
    }
    return {
      running: parsed.running,
      accumulatedMs: Math.max(0, parsed.accumulatedMs),
      startedAt: typeof parsed.startedAt === "number" ? parsed.startedAt : null,
      laps: Array.isArray(parsed.laps)
        ? parsed.laps.filter((n): n is number => typeof n === "number")
        : [],
    };
  } catch {
    return null;
  }
}

function writeState(key: string, state: StopwatchState) {
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode / blocked) — keep in-memory only.
  }
}

/**
 * A stopwatch backed by localStorage so a running timer survives a reload or a
 * tab being reopened (a common Notion-embed frustration). To stay
 * hydration-safe the elapsed time is 0 on the server and first client paint,
 * then syncs from storage in an effect.
 */
export function useStopwatch(storageKey: string) {
  const [state, setState] = useState<StopwatchState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  // A monotonically-increasing tick that forces re-render while running.
  const [, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  const update = useCallback(
    (next: StopwatchState) => {
      setState(next);
      writeState(storageKey, next);
    },
    [storageKey],
  );

  // Hydrate from storage after mount.
  useEffect(() => {
    const stored = readState(storageKey);
    if (stored) setState(stored);
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        const s = readState(storageKey);
        if (s) setState(s);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  // Animation loop: re-render on each frame while running.
  useEffect(() => {
    if (!state.running) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    const loop = () => {
      setTick((t) => (t + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [state.running]);

  const elapsed =
    state.accumulatedMs +
    (state.running && state.startedAt !== null
      ? Math.max(0, Date.now() - state.startedAt)
      : 0);

  const start = useCallback(() => {
    setState((s) => {
      if (s.running) return s;
      const next: StopwatchState = { ...s, running: true, startedAt: Date.now() };
      writeState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const pause = useCallback(() => {
    setState((s) => {
      if (!s.running) return s;
      const add = s.startedAt !== null ? Math.max(0, Date.now() - s.startedAt) : 0;
      const next: StopwatchState = {
        ...s,
        running: false,
        startedAt: null,
        accumulatedMs: s.accumulatedMs + add,
      };
      writeState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const toggle = useCallback(() => {
    if (state.running) pause();
    else start();
  }, [state.running, pause, start]);

  const reset = useCallback(() => {
    update(INITIAL);
  }, [update]);

  const lap = useCallback(() => {
    setState((s) => {
      const total =
        s.accumulatedMs +
        (s.running && s.startedAt !== null
          ? Math.max(0, Date.now() - s.startedAt)
          : 0);
      if (total <= 0) return s;
      const next: StopwatchState = { ...s, laps: [...s.laps, total] };
      writeState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  return {
    hydrated,
    running: state.running,
    elapsed: hydrated ? elapsed : 0,
    laps: hydrated ? state.laps : [],
    start,
    pause,
    toggle,
    reset,
    lap,
  };
}
