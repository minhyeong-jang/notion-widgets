import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const intervalTimerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["ring", "bar", "digits"]).default("ring"),
  work: z.coerce.number().int().min(5).max(900).default(30).catch(30),
  rest: z.coerce.number().int().min(0).max(900).default(15).catch(15),
  rounds: z.coerce.number().int().min(1).max(20).default(8).catch(8),
  showControls: booleanStr.default("true"),
});

export type IntervalTimerParams = z.infer<typeof intervalTimerSchema>;

export const intervalTimerDefaults: IntervalTimerParams = intervalTimerSchema.parse({});
