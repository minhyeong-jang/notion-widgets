import { z } from "zod";

export const photoSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["polaroid", "film", "frame"]).default("polaroid"),
  src: z.string().default(""),
  caption: z.string().default(""),
  tilt: z.enum(["none", "left", "right"]).default("none"),
  fit: z.enum(["cover", "contain"]).default("cover"),
});

export type PhotoParams = z.infer<typeof photoSchema>;

export const photoDefaults: PhotoParams = photoSchema.parse({});
