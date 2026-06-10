import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");

export const flipClockSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  variant: z.enum(["minimal", "flip", "neon"]).default("minimal"),
  format: z.enum(["12h", "24h"]).default("12h"),
  locale: z.string().default("en-US"),
  showSeconds: booleanStr.default("false"),
  showLabel: booleanStr.default("true"),
});

export type FlipClockParams = z.infer<typeof flipClockSchema>;

export const flipClockDefaults: FlipClockParams = flipClockSchema.parse({});
