import { z } from "zod";

export const focusWordSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  word: z.string().default(""),
  variant: z.enum(["minimal"]).default("minimal"),
});

export type FocusWordParams = z.infer<typeof focusWordSchema>;

export const focusWordDefaults: FocusWordParams = focusWordSchema.parse({});
