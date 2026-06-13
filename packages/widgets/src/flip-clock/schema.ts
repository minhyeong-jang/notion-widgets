import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");

export const flipClockSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["minimal", "flip"]).default("minimal"),
  format: z.enum(["12h", "24h"]).default("12h"),
  locale: z.string().default("en-US"),
  showSeconds: booleanStr.default("false"),
  showLabel: booleanStr.default("true"),
});

export type FlipClockParams = z.infer<typeof flipClockSchema>;

export const flipClockDefaults: FlipClockParams = flipClockSchema.parse({});
