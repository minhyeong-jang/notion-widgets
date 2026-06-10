import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const lifeProgressSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  variant: z.enum(["minimal", "card"]).default("minimal"),
  target: dateStr.default("2026-12-31"),
  start: dateStr.default("2026-01-01"),
  label: z.string().default("My Goal"),
  title: z.string().default("Life Progress"),
  locale: z.string().default("en-US"),
  dateFormat: z.string().default("full"),
  showYear: booleanStr.default("true"),
  showMonth: booleanStr.default("true"),
  showQuarter: booleanStr.default("true"),
  showWeek: booleanStr.default("false"),
  showDay: booleanStr.default("false"),
});

export type LifeProgressParams = z.infer<typeof lifeProgressSchema>;

export const lifeProgressDefaults: LifeProgressParams = lifeProgressSchema.parse({});
