"use client";

import { useCallback, useEffect, useState } from "react";

export type TrackerPeriod = "daily" | "weekly" | "persist";

/** ISO-8601 week key, e.g. "2026-W26". */
function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7,
    );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** A bucket identifier for the current period — when it changes, the count resets. */
function bucketKey(period: TrackerPeriod): string {
  const now = new Date();
  if (period === "persist") return "all";
  if (period === "weekly") return isoWeekKey(now);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface StoredValue {
  bucket: string;
  count: number;
}

/**
 * A persistent, period-aware counter backed by localStorage.
 *
 * The value is stored per `storageKey` so multiple widgets on the same origin
 * (e.g. several embeds in one Notion page) don't collide. When the period
 * bucket rolls over (a new day / week), the count auto-resets to 0.
 *
 * Rendering note: to stay hydration-safe, the count starts at `initial` on the
 * server and first client paint, then syncs from localStorage in an effect.
 */
export function useTracker(opts: {
  storageKey: string;
  period: TrackerPeriod;
  initial?: number;
  step?: number;
}) {
  const { storageKey, period, initial = 0, step = 1 } = opts;
  const [count, setCount] = useState(initial);
  const [hydrated, setHydrated] = useState(false);

  const read = useCallback(() => {
    if (typeof window === "undefined") return;
    const bucket = bucketKey(period);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredValue;
        if (parsed && parsed.bucket === bucket && typeof parsed.count === "number") {
          setCount(Math.max(0, parsed.count));
        } else {
          // New period bucket → reset.
          setCount(0);
          window.localStorage.setItem(storageKey, JSON.stringify({ bucket, count: 0 }));
        }
      }
    } catch {
      // localStorage unavailable (private mode, blocked) — fall back to in-memory state.
    }
  }, [storageKey, period]);

  useEffect(() => {
    read();
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [read, storageKey]);

  const persist = useCallback(
    (next: number) => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ bucket: bucketKey(period), count: next }),
        );
      } catch {
        // ignore write failures
      }
    },
    [storageKey, period],
  );

  const apply = useCallback(
    (updater: (c: number) => number) => {
      setCount((c) => {
        const next = Math.max(0, updater(c));
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const increment = useCallback(() => apply((c) => c + step), [apply, step]);
  const decrement = useCallback(() => apply((c) => c - step), [apply, step]);
  const reset = useCallback(() => apply(() => 0), [apply]);

  return { count, hydrated, increment, decrement, reset };
}
