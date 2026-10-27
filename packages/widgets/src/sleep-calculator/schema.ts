import { z } from "zod";

const boolStr = z.enum(["true", "false"]).transform((v) => v === "true");
const timeStr = z.string().regex(/^\d{1,2}:\d{2}$/);

export const sleepCalculatorSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["list", "cards", "moon"]).default("list"),
  // "wake": you want to wake at `wakeTime` -> recommended bedtimes.
  // "sleep": you go to sleep now -> recommended wake times.
  goal: z.enum(["wake", "sleep"]).default("wake"),
  wakeTime: timeStr.default("07:00"),
  // Minutes it takes to fall asleep (buffer added before the first cycle).
  fallAsleep: z.coerce.number().min(0).max(60).default(15),
  // 12-hour clock with AM/PM instead of 24-hour.
  hour12: boolStr.default("false"),
});

export type SleepCalculatorParams = z.infer<typeof sleepCalculatorSchema>;

export const sleepCalculatorDefaults: SleepCalculatorParams = sleepCalculatorSchema.parse({});
