import { z } from "zod";

export const streakSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["flame", "chain", "minimal"]).default("flame"),
  label: z.string().default("Streak"),
});

export type StreakParams = z.infer<typeof streakSchema>;

export const streakDefaults: StreakParams = streakSchema.parse({});
