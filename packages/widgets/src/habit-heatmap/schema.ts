import { z } from "zod";

export const habitHeatmapSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  weeks: z.string().default("20"),
  label: z.string().default("Year Progress"),
});

export type HabitHeatmapParams = z.infer<typeof habitHeatmapSchema>;

export const habitHeatmapDefaults: HabitHeatmapParams = habitHeatmapSchema.parse({});
