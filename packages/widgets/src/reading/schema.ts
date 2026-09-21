import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const readingSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["bar", "book", "cover"]).default("bar"),
  title: z.string().default("Atomic Habits"),
  author: z.string().default("James Clear"),
  current: z.coerce.number().min(0).default(168),
  total: z.coerce.number().min(1).default(320),
  showRemaining: booleanStr.default("true"),
});

export type ReadingParams = z.infer<typeof readingSchema>;

export const readingDefaults: ReadingParams = readingSchema.parse({});
