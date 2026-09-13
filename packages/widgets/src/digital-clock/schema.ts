import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const digitalClockSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["classic", "greeting"]).default("classic"),
  hour12: booleanStr.default("false"),
  showSeconds: booleanStr.default("true"),
  showDate: booleanStr.default("true"),
  locale: z.string().default("en-US"),
});

export type DigitalClockParams = z.infer<typeof digitalClockSchema>;

export const digitalClockDefaults: DigitalClockParams = digitalClockSchema.parse({});
