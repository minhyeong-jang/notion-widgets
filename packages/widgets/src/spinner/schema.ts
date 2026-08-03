import { z } from "zod";

export const spinnerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("purple"),
  locale: z.string().default("en-US"),
  variant: z.enum(["classic", "accent"]).default("classic"),
  /**
   * Wheel options separated by `,`.
   * Example: `Pizza,Sushi,Salad,Burger`
   */
  options: z.string().default("Pizza,Sushi,Salad,Burger,Pasta,Tacos"),
  title: z.string().default(""),
});

export type SpinnerParams = z.infer<typeof spinnerSchema>;

export const spinnerDefaults: SpinnerParams = spinnerSchema.parse({});
