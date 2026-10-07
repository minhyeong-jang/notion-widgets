import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const calculatorSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  variant: z.enum(["basic", "scientific"]).default("basic"),
  grouping: booleanStr.default("true"),
});

export type CalculatorParams = z.infer<typeof calculatorSchema>;

export const calculatorDefaults: CalculatorParams = calculatorSchema.parse({});
