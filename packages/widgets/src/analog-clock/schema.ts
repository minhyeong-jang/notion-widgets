import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");

export const analogClockSchema = z.object({
  theme: z.string().default("minimal"),
  style: z.enum(["minimal", "classic", "vintage"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
  showNumbers: booleanStr.default("false"),
  showSeconds: booleanStr.default("false"),
});

export type AnalogClockParams = z.infer<typeof analogClockSchema>;

export const analogClockDefaults: AnalogClockParams = analogClockSchema.parse({});
