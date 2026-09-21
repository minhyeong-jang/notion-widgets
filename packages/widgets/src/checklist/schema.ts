import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const checklistSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["list", "card", "circle"]).default("list"),
  title: z.string().default("Today"),
  // Items are separated by "|" (URL-friendly). Empty entries are ignored.
  items: z.string().default("Drink water|Read 20 min|Move your body|Plan tomorrow"),
  period: z.enum(["persist", "daily", "weekly"]).default("daily"),
  showProgress: booleanStr.default("true"),
});

export type ChecklistParams = z.infer<typeof checklistSchema>;

export const checklistDefaults: ChecklistParams = checklistSchema.parse({});

/** Split the "|"-separated items param into trimmed, non-empty labels. */
export function parseItems(items: string): string[] {
  return items
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}
