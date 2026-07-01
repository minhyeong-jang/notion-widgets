"use client";

import { useCallback, useEffect, useState } from "react";

export type ChecklistPeriod = "daily" | "weekly" | "persist";

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

/** A bucket identifier for the current period — when it changes, checks reset. */
function bucketKey(period: ChecklistPeriod): string {
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
  done: number[];
}

/**
 * Period-aware checked-state for a checklist, backed by localStorage.
 *
 * Items themselves come from the widget params (the URL is the source of
 * truth); only which items are *done* is persisted, keyed per `storageKey` so
 * multiple embeds on one Notion page don't collide. When the period bucket
 * rolls over (a new day / week) the checks auto-reset — perfect for a routine.
 *
 * Hydration-safe: starts empty on the server and first client paint, then
 * syncs from localStorage in an effect.
 */
export function useChecklist(opts: { storageKey: string; period: ChecklistPeriod }) {
  const { storageKey, period } = opts;
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  const read = useCallback(() => {
    if (typeof window === "undefined") return;
    const bucket = bucketKey(period);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredValue;
        if (parsed && parsed.bucket === bucket && Array.isArray(parsed.done)) {
          setDone(new Set(parsed.done.filter((n) => typeof n === "number")));
        } else {
          // New period bucket → reset.
          setDone(new Set());
          window.localStorage.setItem(storageKey, JSON.stringify({ bucket, done: [] }));
        }
      }
    } catch {
      // localStorage unavailable (private mode, blocked) — stay in-memory.
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
    (next: Set<number>) => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ bucket: bucketKey(period), done: [...next] }),
        );
      } catch {
        // ignore write failures
      }
    },
    [storageKey, period],
  );

  const toggle = useCallback(
    (index: number) => {
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    const empty = new Set<number>();
    setDone(empty);
    persist(empty);
  }, [persist]);

  return { done, hydrated, toggle, reset };
}
