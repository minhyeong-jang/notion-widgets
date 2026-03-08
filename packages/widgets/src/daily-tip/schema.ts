import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const dailyTipSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  category: z.enum(["all", "productivity", "mindset", "tech", "life"]).default("all"),
  locale: z.string().default("en-US"),
  color: hexColor,
  bg: z.string().default("18181b"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
  mode: z.enum(["daily", "random"]).default("daily"),
});

export type DailyTipParams = z.infer<typeof dailyTipSchema>;

export const dailyTipDefaults: DailyTipParams = dailyTipSchema.parse({});
