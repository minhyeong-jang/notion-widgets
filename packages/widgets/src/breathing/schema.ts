import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const breathingSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  technique: z.enum(["4-7-8", "box", "equal"]).default("4-7-8"),
  variant: z.enum(["circle", "minimal"]).default("circle"),
  color: hexColor,
  bg: z.string().default("18181b"),
});

export type BreathingParams = z.infer<typeof breathingSchema>;

export const breathingDefaults: BreathingParams = breathingSchema.parse({});
