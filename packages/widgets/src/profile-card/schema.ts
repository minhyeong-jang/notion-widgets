import { z } from "zod";

export const profileCardSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["card", "banner"]).default("card"),
  /** Display name. First character is used as the avatar fallback. */
  name: z.string().default("Doriri"),
  /** Role / bio line shown under the name. */
  tagline: z.string().default("Maker of delightful web things"),
  /** Emoji or single character for the avatar. Empty = initial from name. */
  avatar: z.string().default(""),
  /** Social handles or full URLs. Empty values are hidden. */
  github: z.string().default("doriri"),
  x: z.string().default("doriri"),
  instagram: z.string().default("doriri"),
  linkedin: z.string().default(""),
  email: z.string().default(""),
  website: z.string().default("widgets.doriri.dev"),
});

export type ProfileCardParams = z.infer<typeof profileCardSchema>;

export const profileCardDefaults: ProfileCardParams = profileCardSchema.parse({});
