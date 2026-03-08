import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const habitHeatmapSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  color: hexColor,
  bg: z.string().default("18181b"),
  weeks: z.string().default("20"),
  label: z.string().default("Year Progress"),
});

export type HabitHeatmapParams = z.infer<typeof habitHeatmapSchema>;

export const habitHeatmapDefaults: HabitHeatmapParams = habitHeatmapSchema.parse({});
