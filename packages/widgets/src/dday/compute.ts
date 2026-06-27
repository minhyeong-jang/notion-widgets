export interface DdayEvent {
  name: string;
  /** YYYY-MM-DD */
  date: string;
  /** target - today, in whole days (positive = upcoming) */
  diffDays: number;
  /** "D-7" | "D-DAY" | "D+3" */
  label: string;
  status: "upcoming" | "today" | "past";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 1000 * 60 * 60 * 24;

/** Maximum number of events rendered before collapsing into a "+N more" line. */
export const MAX_EVENTS = 6;

interface RawEvent {
  name: string;
  date: string;
}

export function parseEvents(raw: string): RawEvent[] {
  return raw
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): RawEvent | null => {
      const idx = chunk.lastIndexOf("~");
      if (idx === -1) return null;
      const name = chunk.slice(0, idx).trim();
      const date = chunk.slice(idx + 1).trim();
      if (!name || !DATE_RE.test(date)) return null;
      return { name, date };
    })
    .filter((e): e is RawEvent => e !== null);
}

export function computeEvents(
  raw: string,
  today: Date,
  sort: "soon" | "date",
): DdayEvent[] {
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const events: DdayEvent[] = parseEvents(raw).map(({ name, date }) => {
    const t = new Date(date + "T00:00:00");
    const targetStart = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const diffDays = Math.round(
      (targetStart.getTime() - todayStart.getTime()) / DAY_MS,
    );
    const status: DdayEvent["status"] =
      diffDays > 0 ? "upcoming" : diffDays === 0 ? "today" : "past";
    const label =
      diffDays > 0
        ? `D-${diffDays}`
        : diffDays === 0
          ? "D-DAY"
          : `D+${Math.abs(diffDays)}`;
    return { name, date, diffDays, label, status };
  });

  if (sort === "date") {
    events.sort((a, b) => a.date.localeCompare(b.date));
  } else {
    // soon: upcoming nearest first, then past most-recent first
    events.sort((a, b) => {
      const aUp = a.diffDays >= 0;
      const bUp = b.diffDays >= 0;
      if (aUp && bUp) return a.diffDays - b.diffDays;
      if (aUp) return -1;
      if (bUp) return 1;
      // both past: closest to today first (−1 before −5)
      return b.diffDays - a.diffDays;
    });
  }

  return events;
}
