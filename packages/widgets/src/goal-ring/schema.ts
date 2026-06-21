import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const goalRingSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["ring", "gauge", "segments"]).default("ring"),
  label: z.string().default("Reading Goal"),
  current: z.coerce.number().min(0).default(7),
  target: z.coerce.number().min(1).default(12),
  unit: z.string().default("books"),
  showPercent: booleanStr.default("true"),
});

export type GoalRingParams = z.infer<typeof goalRingSchema>;

export const goalRingDefaults: GoalRingParams = goalRingSchema.parse({});
