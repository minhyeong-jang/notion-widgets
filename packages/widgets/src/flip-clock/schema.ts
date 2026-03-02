import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true").default("false");

export const flipClockSchema = z.object({
  color: hexColor,
  bg: z.string().default("18181b"),
  format: z.enum(["12h", "24h"]).default("12h"),
  locale: z.string().default("en-US"),
  showSeconds: booleanStr,
});

export type FlipClockParams = z.infer<typeof flipClockSchema>;

export const flipClockDefaults: FlipClockParams = flipClockSchema.parse({});
