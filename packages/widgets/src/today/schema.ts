import { z } from "zod";

export const todaySchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["stack", "page", "banner"]).default("stack"),
  locale: z.string().default("en-US"),
  subInfo: z.enum(["none", "dayOfYear", "weekNumber"]).default("none"),
});

export type TodayParams = z.infer<typeof todaySchema>;

export const todayDefaults: TodayParams = todaySchema.parse({});
