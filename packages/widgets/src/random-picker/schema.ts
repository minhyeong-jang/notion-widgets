import { z } from "zod";

export const randomPickerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /** Which picker to show. */
  variant: z.enum(["dice", "coin", "oracle", "pick"]).default("dice"),
  /** daily = stable per day (decision of the day); random = fresh each load. */
  mode: z.enum(["daily", "random"]).default("random"),
  /** Comma-separated options for the "pick" variant. */
  options: z.string().default("Pizza, Sushi, Tacos, Salad, Ramen"),
});

export type RandomPickerParams = z.infer<typeof randomPickerSchema>;

export const randomPickerDefaults: RandomPickerParams = randomPickerSchema.parse({});
