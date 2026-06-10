import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform(v => v === "true");

export const analogClockSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  variant: z.enum(["minimal", "classic", "vintage"]).default("minimal"),
  showNumbers: booleanStr.default("false"),
  showSeconds: booleanStr.default("false"),
});

export type AnalogClockParams = z.infer<typeof analogClockSchema>;

export const analogClockDefaults: AnalogClockParams = analogClockSchema.parse({});
