import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const weekPlannerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["strip", "list", "cards"]).default("strip"),
  weekStart: z.enum(["mon", "sun"]).default("mon"),
  title: z.string().default("This Week"),
  /**
   * Tasks per weekday, joined by "|" — each entry is `Day:Text`.
   * Day keys are English 3-letter abbreviations (Mon, Tue, Wed, Thu, Fri,
   * Sat, Sun), case-insensitive. Example: `Mon:Team sync|Wed:Design review`.
   */
  tasks: z
    .string()
    .default("Mon:Team sync|Wed:Design review|Fri:Ship v2|Sat:Hiking"),
  showTitle: booleanStr.default("true"),
});

export type WeekPlannerParams = z.infer<typeof weekPlannerSchema>;

export const weekPlannerDefaults: WeekPlannerParams = weekPlannerSchema.parse({});

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

/** Parse the "|"-separated `Day:Text` tasks param into a per-weekday map. */
export function parseTasks(tasks: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of tasks.split("|")) {
    const idx = entry.indexOf(":");
    if (idx === -1) continue;
    const key = entry.slice(0, idx).trim().toLowerCase().slice(0, 3);
    const text = entry.slice(idx + 1).trim();
    if (!DAY_KEYS.includes(key as (typeof DAY_KEYS)[number]) || !text) continue;
    map[key] = text.slice(0, 40);
  }
  return map;
}

/** getDay() index (0=Sun) → English 3-letter task key. */
export function dayKeyFromDate(date: Date): string {
  return DAY_KEYS[date.getDay()];
}
