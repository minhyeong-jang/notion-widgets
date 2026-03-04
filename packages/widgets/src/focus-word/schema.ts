import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const focusWordSchema = z.object({
  theme: z.string().default("minimal"),
  word: z.string().default(""),
  style: z.enum(["minimal", "gradient", "bold"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
});

export type FocusWordParams = z.infer<typeof focusWordSchema>;

export const focusWordDefaults: FocusWordParams = focusWordSchema.parse({});
