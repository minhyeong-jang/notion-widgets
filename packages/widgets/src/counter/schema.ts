import { z } from "zod";

export const counterSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["single", "multi"]).default("single"),
  label: z.string().default("Count"),
  step: z.coerce.number().int().positive().max(1000).default(1),
});

export type CounterParams = z.infer<typeof counterSchema>;

export const counterDefaults: CounterParams = counterSchema.parse({});
