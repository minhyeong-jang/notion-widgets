import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const aquariumSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("ocean"),
  /** Scene mood / density. */
  variant: z.enum(["reef", "deep", "calm"]).default("reef"),
  /** Animation tempo. */
  speed: z.enum(["slow", "normal", "fast"]).default("normal"),
  /** Rising bubbles layer. */
  bubbles: booleanStr.default("true"),
});

export type AquariumParams = z.infer<typeof aquariumSchema>;

export const aquariumDefaults: AquariumParams = aquariumSchema.parse({});

/** Multiplier applied to every animation duration. Higher = slower. */
export const SPEED_FACTOR: Record<AquariumParams["speed"], number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.62,
};
