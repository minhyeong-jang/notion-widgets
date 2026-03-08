import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const dailyTarotSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  deck: z.enum(["major", "full"]).default("major"),
  variant: z.enum(["minimal", "detailed"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
  locale: z.string().default("en-US"),
});

export type DailyTarotParams = z.infer<typeof dailyTarotSchema>;

export const dailyTarotDefaults: DailyTarotParams = dailyTarotSchema.parse({});
