import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const lifeProgressSchema = z.object({
  style: z.enum(["minimal", "card"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
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
