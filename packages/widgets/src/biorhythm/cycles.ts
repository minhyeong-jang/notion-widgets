export type CycleKey = "physical" | "emotional" | "intellectual";

export interface CycleDef {
  key: CycleKey;
  period: number;
  label: string;
  labelKo: string;
  short: string;
  shortKo: string;
}

export const CYCLES: CycleDef[] = [
  { key: "physical", period: 23, label: "Physical", labelKo: "신체", short: "PHY", shortKo: "신체" },
  { key: "emotional", period: 28, label: "Emotional", labelKo: "감정", short: "EMO", shortKo: "감정" },
  { key: "intellectual", period: 33, label: "Intellectual", labelKo: "지성", short: "INT", shortKo: "지성" },
];

const MS_PER_DAY = 86_400_000;

/** Whole days lived from birth to the reference date. */
export function daysAlive(birth: Date, ref: Date): number {
  const b = Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate());
  const r = Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate());
  return Math.round((r - b) / MS_PER_DAY);
}

/** Cycle value in [-1, 1] for a given day count and period. */
export function cycleValue(days: number, period: number): number {
  return Math.sin((2 * Math.PI * days) / period);
}

/** Percentage in [-100, 100]. */
export function toPercent(v: number): number {
  return Math.round(v * 100);
}
