import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const quoteSchema = z.object({
  language: z.enum(["ko", "en"]).default("ko"),
  color: hexColor,
  bg: z.string().default("18181b"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
});

export type QuoteParams = z.infer<typeof quoteSchema>;

export const quoteDefaults: QuoteParams = quoteSchema.parse({});
