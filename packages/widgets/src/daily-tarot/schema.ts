import { z } from "zod";

export const dailyTarotSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  deck: z.enum(["major", "full"]).default("major"),
  variant: z.enum(["minimal", "detailed"]).default("minimal"),
  locale: z.string().default("en-US"),
});

export type DailyTarotParams = z.infer<typeof dailyTarotSchema>;

export const dailyTarotDefaults: DailyTarotParams = dailyTarotSchema.parse({});
