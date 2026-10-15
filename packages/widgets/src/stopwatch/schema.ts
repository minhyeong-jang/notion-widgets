import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const stopwatchSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["digits", "laps", "badge"]).default("digits"),
  label: z.string().default("Stopwatch"),
  showCenti: booleanStr.default("true"),
});

export type StopwatchParams = z.infer<typeof stopwatchSchema>;

export const stopwatchDefaults: StopwatchParams = stopwatchSchema.parse({});
