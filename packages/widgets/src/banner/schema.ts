import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const bannerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["banner", "marquee", "sign"]).default("banner"),
  /** Main display text. */
  text: z.string().default("Make it happen"),
  /** Optional subtitle (shown in the banner variant). */
  subtitle: z.string().default(""),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  /** Marquee scroll speed. */
  speed: z.enum(["slow", "normal", "fast"]).default("normal"),
  /** Force UPPERCASE display. */
  caps: booleanStr.default("false"),
});

export type BannerParams = z.infer<typeof bannerSchema>;

export const bannerDefaults: BannerParams = bannerSchema.parse({});
