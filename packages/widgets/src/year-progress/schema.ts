import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const yearProgressSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["grid", "months", "weeks"]).default("grid"),
  locale: z.string().default("en-US"),
  label: z.string().default(""),
  showPercent: booleanStr.default("true"),
  showRemaining: booleanStr.default("true"),
});

export type YearProgressParams = z.infer<typeof yearProgressSchema>;

export const yearProgressDefaults: YearProgressParams = yearProgressSchema.parse({});
