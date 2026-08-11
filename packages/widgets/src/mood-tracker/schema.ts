import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const moodTrackerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /** Emoji set used for the 5-level mood scale. */
  variant: z.enum(["faces", "weather", "nature"]).default("faces"),
  /** Optional heading shown above the picker. Empty → localized default. */
  label: z.string().default(""),
  /** Show the 7-day week strip under the picker. */
  showWeek: booleanStr.default("true"),
});

export type MoodTrackerParams = z.infer<typeof moodTrackerSchema>;

export const moodTrackerDefaults: MoodTrackerParams = moodTrackerSchema.parse({});
