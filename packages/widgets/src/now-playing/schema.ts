import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const nowPlayingSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["vinyl", "cd", "cassette"]).default("vinyl"),
  title: z.string().default("Good Days"),
  artist: z.string().default("SZA"),
  // Playback position, 0–100. Drives the progress bar + synthesized timestamps.
  progress: z.coerce.number().int().min(0).max(100).default(35),
  spin: booleanStr.default("true"),
});

export type NowPlayingParams = z.infer<typeof nowPlayingSchema>;

export const nowPlayingDefaults: NowPlayingParams = nowPlayingSchema.parse({});
