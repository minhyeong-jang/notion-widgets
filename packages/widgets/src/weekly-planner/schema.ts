import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const weeklyPlannerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["list", "strip", "stack"]).default("list"),
  title: z.string().default("This Week"),
  weekStart: z.enum(["mon", "sun"]).default("mon"),
  // Per-day plan text (short focus/task). Empty = no plan shown.
  mon: z.string().default(""),
  tue: z.string().default(""),
  wed: z.string().default(""),
  thu: z.string().default(""),
  fri: z.string().default(""),
  sat: z.string().default(""),
  sun: z.string().default(""),
  showDate: booleanStr.default("true"),
});

export type WeeklyPlannerParams = z.infer<typeof weeklyPlannerSchema>;

export const weeklyPlannerDefaults: WeeklyPlannerParams =
  weeklyPlannerSchema.parse({});
