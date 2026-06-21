import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const colorPaletteSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["stack", "cards", "gradient"]).default("stack"),
  harmony: z.enum(["analogous", "monochrome", "complementary", "triad"]).default("analogous"),
  count: z.coerce.number().int().min(3).max(6).default(5),
  showHex: booleanStr.default("true"),
  mode: z.enum(["daily", "random"]).default("daily"),
});

export type ColorPaletteParams = z.infer<typeof colorPaletteSchema>;

export const colorPaletteDefaults: ColorPaletteParams = colorPaletteSchema.parse({});
