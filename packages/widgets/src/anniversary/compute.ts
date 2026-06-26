/** Pure date math for the Anniversary counter — no React, easy to reason about. */

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Parse "YYYY-MM-DD" as a LOCAL calendar date (not UTC) to avoid TZ drift. */
function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

export interface Milestone {
  kind: "days" | "anniversary";
  /** The D+ number that lands on the milestone. */
  targetCount: number;
  /** Calendar date of the milestone. */
  date: Date;
  /** Days remaining until it. */
  remaining: number;
  /** For anniversaries: how many years it marks. */
  years?: number;
}

export interface AnniversaryInfo {
  /** The big number to display (always positive). */
  dayCount: number;
  /** True when the start date is still in the future. */
  isFuture: boolean;
  startDate: Date;
  /** Full elapsed weeks / calendar months / calendar years. */
  weeks: number;
  months: number;
  years: number;
  /** Ring progress (0..100) toward the next 100-day mark. */
  centuryProgress: number;
  /** The next 100-day mark count (e.g. 1300). */
  centuryTarget: number;
  /** Days remaining to the next 100-day mark. */
  centuryRemaining: number;
  /** Nearest upcoming milestone (100-day mark or yearly anniversary). */
  nextMilestone: Milestone | null;
}

export function computeAnniversary(
  startStr: string,
  countFromOne: boolean,
  now: Date,
): AnniversaryInfo {
  const start = startOfDay(parseLocalDate(startStr));
  const today = startOfDay(now);
  const rawDays = diffDays(today, start); // elapsed days since start (can be negative)
  const isFuture = rawDays < 0;

  if (isFuture) {
    return {
      dayCount: -rawDays,
      isFuture: true,
      startDate: start,
      weeks: 0,
      months: 0,
      years: 0,
      centuryProgress: 0,
      centuryTarget: 100,
      centuryRemaining: -rawDays,
      nextMilestone: null,
    };
  }

  // Korean convention: the start day itself is day 1.
  const dayCount = countFromOne ? rawDays + 1 : rawDays;

  const weeks = Math.floor(rawDays / 7);
  let monthsTotal =
    (today.getFullYear() - start.getFullYear()) * 12 +
    (today.getMonth() - start.getMonth());
  if (today.getDate() < start.getDate()) monthsTotal -= 1;
  if (monthsTotal < 0) monthsTotal = 0;
  const years = Math.floor(monthsTotal / 12);

  // Next 100-day mark.
  const centuryTarget = (Math.floor(dayCount / 100) + 1) * 100;
  const centuryRemaining = centuryTarget - dayCount;
  const within = dayCount - (centuryTarget - 100); // 0..100 toward target
  const centuryProgress = Math.max(0, Math.min(100, (within / 100) * 100));
  const centuryDate = new Date(today);
  centuryDate.setDate(centuryDate.getDate() + centuryRemaining);

  // Next yearly anniversary.
  let annivYear = today.getFullYear();
  let annivDate = new Date(annivYear, start.getMonth(), start.getDate());
  if (diffDays(annivDate, today) <= 0) {
    annivYear += 1;
    annivDate = new Date(annivYear, start.getMonth(), start.getDate());
  }
  const annivRemaining = diffDays(annivDate, today);
  const annivYears = annivYear - start.getFullYear();

  const daysMilestone: Milestone = {
    kind: "days",
    targetCount: centuryTarget,
    date: centuryDate,
    remaining: centuryRemaining,
  };
  const annivMilestone: Milestone = {
    kind: "anniversary",
    targetCount: dayCount + annivRemaining,
    date: annivDate,
    remaining: annivRemaining,
    years: annivYears,
  };

  const nextMilestone =
    annivMilestone.remaining < daysMilestone.remaining
      ? annivMilestone
      : daysMilestone;

  return {
    dayCount,
    isFuture: false,
    startDate: start,
    weeks,
    months: monthsTotal,
    years,
    centuryProgress,
    centuryTarget,
    centuryRemaining,
    nextMilestone,
  };
}
