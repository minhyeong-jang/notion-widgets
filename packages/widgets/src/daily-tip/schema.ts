import { z } from "zod";

export const dailyTipSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  category: z.enum(["all", "productivity", "mindset", "tech", "life"]).default("all"),
  locale: z.string().default("en-US"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
  mode: z.enum(["daily", "random"]).default("daily"),
});

export type DailyTipParams = z.infer<typeof dailyTipSchema>;

export const dailyTipDefaults: DailyTipParams = dailyTipSchema.parse({});
