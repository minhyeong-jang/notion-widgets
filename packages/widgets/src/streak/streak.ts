"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/** Local-date key "YYYY-MM-DD" (personal day, not UTC). */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Shift a date by a whole number of days (safe across month/year bounds). */
export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export interface StreakStats {
  current: number;
  best: number;
}

/**
 * Current streak = consecutive checked days ending today, or ending yesterday
 * if today isn't checked yet (so the count doesn't drop to 0 until a day is
 * actually missed). Best = longest run anywhere in the history.
 */
export function computeStats(checked: Set<string>, today: Date): StreakStats {
  // Current
  let current = 0;
  let cursor = checked.has(dateKey(today)) ? today : addDays(today, -1);
  // If neither today nor yesterday is checked, the streak is broken → 0.
  if (checked.has(dateKey(cursor))) {
    while (checked.has(dateKey(cursor))) {
      current += 1;
      cursor = addDays(cursor, -1);
    }
  }

  // Best — walk the sorted unique days, counting consecutive runs.
  const sorted = [...checked].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of sorted) {
    const [y, m, d] = key.split("-").map(Number);
    const cur = new Date(y, m - 1, d);
    if (prev && dateKey(addDays(prev, 1)) === key) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = cur;
  }

  return { current, best: Math.max(best, current) };
}

/**
 * A persistent set of checked-in dates backed by localStorage.
 *
 * Hydration-safe: `today` and the stored set resolve only after mount, so the
 * server / first paint render a neutral empty state (hydrated=false).
 */
export function useStreak(storageKey: string) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [today, setToday] = useState<Date | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const read = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setChecked(new Set(parsed.filter((x): x is string => typeof x === "string")));
        }
      }
    } catch {
      // localStorage unavailable — stay in-memory.
    }
  }, [storageKey]);

  useEffect(() => {
    setToday(new Date());
    read();
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [read, storageKey]);

  const write = useCallback(
    (next: Set<string>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        // ignore write failures
      }
    },
    [storageKey],
  );

  const toggleToday = useCallback(() => {
    if (!today) return;
    setChecked((prev) => {
      const key = dateKey(today);
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      write(next);
      return next;
    });
  }, [today, write]);

  const stats = useMemo<StreakStats>(
    () => (today ? computeStats(checked, today) : { current: 0, best: 0 }),
    [checked, today],
  );

  const checkedToday = today ? checked.has(dateKey(today)) : false;

  return { checked, stats, checkedToday, today, hydrated, toggleToday };
}
