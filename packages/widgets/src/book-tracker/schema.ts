import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const bookTrackerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("sunset"),
  locale: z.string().default("en-US"),
  /** Visual layout */
  variant: z.enum(["cover", "bar", "spine"]).default("cover"),
  /** Book title shown prominently */
  title: z.string().default("Atomic Habits"),
  /** Author line under the title */
  author: z.string().default("James Clear"),
  /** Pages read so far */
  current: z.coerce.number().min(0).default(127),
  /** Total pages in the book */
  total: z.coerce.number().min(1).default(320),
  /** Show the "127 / 320 pages" line */
  showPages: booleanStr.default("true"),
});

export type BookTrackerParams = z.infer<typeof bookTrackerSchema>;

export const bookTrackerDefaults: BookTrackerParams = bookTrackerSchema.parse({});
