import { z } from "zod";

export const quoteSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  locale: z.string().default("ko-KR"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
  mode: z.enum(["daily", "random"]).default("daily"),
});

export type QuoteParams = z.infer<typeof quoteSchema>;

export const quoteDefaults: QuoteParams = quoteSchema.parse({});
