import { z } from "zod";

export const breathingSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  technique: z.enum(["4-7-8", "box", "equal"]).default("4-7-8"),
  variant: z.enum(["circle", "minimal"]).default("circle"),
});

export type BreathingParams = z.infer<typeof breathingSchema>;

export const breathingDefaults: BreathingParams = breathingSchema.parse({});
