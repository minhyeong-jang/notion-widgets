import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("ffffff");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");

export const flipClockSchema = z.object({
  colorTheme: z.string().default("default"),
  color: hexColor,
  bg: z.string().default("0a0a0a"),
  variant: z.enum(["minimal", "flip", "neon"]).default("minimal"),
  format: z.enum(["12h", "24h"]).default("12h"),
  locale: z.string().default("en-US"),
  showSeconds: booleanStr.default("false"),
  showLabel: booleanStr.default("true"),
});

export type FlipClockParams = z.infer<typeof flipClockSchema>;

export const flipClockDefaults: FlipClockParams = flipClockSchema.parse({});
