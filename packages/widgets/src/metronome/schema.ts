import { z } from "zod";

export const metronomeSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /** Beats per minute. Kept as string (URL param) and clamped in the widget. */
  bpm: z.string().default("120"),
  /** Beats per measure (time signature numerator). */
  beats: z.string().default("4"),
  variant: z.enum(["pendulum", "pulse"]).default("pendulum"),
});

export type MetronomeParams = z.infer<typeof metronomeSchema>;

export const metronomeDefaults: MetronomeParams = metronomeSchema.parse({});
