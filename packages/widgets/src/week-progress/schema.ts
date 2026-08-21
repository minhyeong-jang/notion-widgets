import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const weekProgressSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["dots", "bars", "row"]).default("dots"),
  firstDay: z.enum(["sun", "mon"]).default("mon"),
  showProgress: booleanStr.default("true"),
  showWeekNumber: booleanStr.default("false"),
});

export type WeekProgressParams = z.infer<typeof weekProgressSchema>;

export const weekProgressDefaults: WeekProgressParams = weekProgressSchema.parse({});
