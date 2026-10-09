export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

export type Hemisphere = "north" | "south";

export interface SeasonInfo {
  key: SeasonKey;
  /** 0-based index in cycle order spring→summer→autumn→winter. */
  index: number;
  start: Date;
  end: Date;
  elapsedDays: number;
  totalDays: number;
  daysLeft: number;
  /** 0–100, how far through the current season. */
  percent: number;
}

const DAY = 24 * 60 * 60 * 1000;

/** Cycle order used by the "seasons" variant. */
export const SEASON_ORDER: SeasonKey[] = ["spring", "summer", "autumn", "winter"];

/**
 * First day (local midnight) of the meteorological 3-month block that `d`
 * falls in. Blocks start in Mar / Jun / Sep / Dec; the Dec block (winter in
 * the north) spans the year boundary, so Jan / Feb roll back to the prior Dec.
 */
function blockStart(d: Date): Date {
  const y = d.getFullYear();
  const m = d.getMonth();
  if (m >= 2 && m <= 4) return new Date(y, 2, 1);
  if (m >= 5 && m <= 7) return new Date(y, 5, 1);
  if (m >= 8 && m <= 10) return new Date(y, 8, 1);
  if (m === 11) return new Date(y, 11, 1);
  return new Date(y - 1, 11, 1); // Jan / Feb → previous December
}

/** Northern-hemisphere season for a block start month. */
function northSeason(startMonth: number): SeasonKey {
  switch (startMonth) {
    case 2:
      return "spring";
    case 5:
      return "summer";
    case 8:
      return "autumn";
    default:
      return "winter"; // month 11
  }
}

/** Southern hemisphere is offset by two seasons. */
function flip(key: SeasonKey): SeasonKey {
  switch (key) {
    case "spring":
      return "autumn";
    case "summer":
      return "winter";
    case "autumn":
      return "spring";
    default:
      return "summer";
  }
}

/** Round a span of local midnights to whole days (DST-safe). */
function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY);
}

export function getSeasonInfo(now: Date, hemisphere: Hemisphere): SeasonInfo {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = blockStart(now);
  const end = new Date(start.getFullYear(), start.getMonth() + 3, 1);

  const northKey = northSeason(start.getMonth());
  const key = hemisphere === "south" ? flip(northKey) : northKey;

  const totalDays = daysBetween(start, end);
  const elapsedDays = Math.max(0, Math.min(totalDays, daysBetween(start, today)));
  const daysLeft = Math.max(0, totalDays - elapsedDays);
  const percent = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;

  return {
    key,
    index: SEASON_ORDER.indexOf(key),
    start,
    end,
    elapsedDays,
    totalDays,
    daysLeft,
    percent,
  };
}

// ─── i18n ───

type SeasonNames = Record<SeasonKey, string>;

const SEASON_NAMES: Record<string, SeasonNames> = {
  en: { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" },
  ko: { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" },
  ja: { spring: "春", summer: "夏", autumn: "秋", winter: "冬" },
  zh: { spring: "春季", summer: "夏季", autumn: "秋季", winter: "冬季" },
  de: { spring: "Frühling", summer: "Sommer", autumn: "Herbst", winter: "Winter" },
  fr: { spring: "Printemps", summer: "Été", autumn: "Automne", winter: "Hiver" },
  es: { spring: "Primavera", summer: "Verano", autumn: "Otoño", winter: "Invierno" },
};

interface SeasonLabels {
  daysLeft: (n: number) => string;
  /** Days elapsed so far — pairs with daysLeft to sum to the season length. */
  passed: (n: number) => string;
  lastDay: string;
}

const LABELS: Record<string, SeasonLabels> = {
  en: {
    daysLeft: (n) => `${n} ${n === 1 ? "day" : "days"} left`,
    passed: (n) => `${n} ${n === 1 ? "day" : "days"} in`,
    lastDay: "Final day",
  },
  ko: {
    daysLeft: (n) => `${n}일 남음`,
    passed: (n) => `${n}일 경과`,
    lastDay: "마지막 날",
  },
  ja: {
    daysLeft: (n) => `あと${n}日`,
    passed: (n) => `${n}日経過`,
    lastDay: "最終日",
  },
  zh: {
    daysLeft: (n) => `还剩${n}天`,
    passed: (n) => `已过${n}天`,
    lastDay: "最后一天",
  },
  de: {
    daysLeft: (n) => `noch ${n} ${n === 1 ? "Tag" : "Tage"}`,
    passed: (n) => `${n} ${n === 1 ? "Tag" : "Tage"} vergangen`,
    lastDay: "Letzter Tag",
  },
  fr: {
    daysLeft: (n) => `${n} ${n === 1 ? "jour" : "jours"} restant${n === 1 ? "" : "s"}`,
    passed: (n) => `${n} ${n === 1 ? "jour" : "jours"} écoulé${n === 1 ? "" : "s"}`,
    lastDay: "Dernier jour",
  },
  es: {
    daysLeft: (n) => `${n} ${n === 1 ? "día" : "días"} restante${n === 1 ? "" : "s"}`,
    passed: (n) => `${n} ${n === 1 ? "día" : "días"} transcurrido${n === 1 ? "" : "s"}`,
    lastDay: "Último día",
  },
};

function lang(locale: string): string {
  return locale.slice(0, 2).toLowerCase();
}

export function getSeasonName(key: SeasonKey, locale: string): string {
  return (SEASON_NAMES[lang(locale)] ?? SEASON_NAMES.en)[key];
}

export function getSeasonLabels(locale: string): SeasonLabels {
  return LABELS[lang(locale)] ?? LABELS.en;
}
