import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const waterTrackerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("ocean"),
  variant: z.enum(["bottle", "glasses", "droplets"]).default("bottle"),
  label: z.string().default("Water"),
  current: z.coerce.number().min(0).default(5),
  goal: z.coerce.number().min(1).default(8),
  unit: z.string().default("glasses"),
  showPercent: booleanStr.default("false"),
});

export type WaterTrackerParams = z.infer<typeof waterTrackerSchema>;

export const waterTrackerDefaults: WaterTrackerParams = waterTrackerSchema.parse({});
