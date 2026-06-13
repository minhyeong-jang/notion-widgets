import { z } from "zod";

export const moonPhaseSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["minimal", "detailed"]).default("minimal"),
  locale: z.string().default("en-US"),
});

export type MoonPhaseParams = z.infer<typeof moonPhaseSchema>;

export const moonPhaseDefaults: MoonPhaseParams = moonPhaseSchema.parse({});
