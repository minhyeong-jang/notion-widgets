import { z } from "zod";

export const wordOfTheDaySchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["detailed", "compact"]).default("detailed"),
  // daily = deterministic per day, random = changes each load.
  // Not named `colorMode` (reserved by the embed renderer for dark/light).
  mode: z.enum(["daily", "random"]).default("daily"),
});

export type WordOfTheDayParams = z.infer<typeof wordOfTheDaySchema>;

export const wordOfTheDayDefaults: WordOfTheDayParams = wordOfTheDaySchema.parse({});
