import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const goalRingSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["ring", "gauge", "segments"]).default("ring"),
  label: z.string().default("Reading Goal"),
  target: z.coerce.number().min(1).default(12),
  unit: z.string().default("books"),
  step: z.coerce.number().min(1).default(1),
  period: z.enum(["daily", "weekly", "persist"]).default("persist"),
  showPercent: booleanStr.default("true"),
});

export type GoalRingParams = z.infer<typeof goalRingSchema>;

export const goalRingDefaults: GoalRingParams = goalRingSchema.parse({});
