import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const moonPhaseSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  variant: z.enum(["minimal", "detailed"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
  locale: z.string().default("en-US"),
});

export type MoonPhaseParams = z.infer<typeof moonPhaseSchema>;

export const moonPhaseDefaults: MoonPhaseParams = moonPhaseSchema.parse({});
