import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");

export const flipClockSchema = z.object({
  theme: z.string().default("custom"),
  color: hexColor,
  bg: z.string().default("18181b"),
  style: z.enum(["flip", "minimal"]).default("flip"),
  format: z.enum(["12h", "24h"]).default("12h"),
  locale: z.string().default("en-US"),
  showSeconds: booleanStr.default("false"),
  showLabel: booleanStr.default("true"),
});

export type FlipClockParams = z.infer<typeof flipClockSchema>;

export const flipClockDefaults: FlipClockParams = flipClockSchema.parse({});
