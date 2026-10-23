import { z } from "zod";

export const lavaLampSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  // lamp    = classic lava-lamp bottle silhouette with rising blobs
  // ambient = full-panel floating metaballs, for use as a background
  variant: z.enum(["lamp", "ambient"]).default("lamp"),
  speed: z.enum(["slow", "normal", "fast"]).default("normal"),
});

export type LavaLampParams = z.infer<typeof lavaLampSchema>;

export const lavaLampDefaults: LavaLampParams = lavaLampSchema.parse({});
