import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const hourglassSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  /** classic: angular bowtie · curved: elegant concave glass · slim: tall narrow */
  variant: z.enum(["classic", "curved", "slim"]).default("classic"),
  /** Total seconds for one full drain. */
  duration: z.enum(["60", "180", "300", "600", "900", "1500"]).default("300"),
  /** Auto-flip and run forever vs. drain once and stop. */
  loop: booleanStr.default("true"),
  /** Show remaining time digits below the glass. */
  showTime: booleanStr.default("true"),
  /**
   * Internal: render a static frame at this progress (0..1) with no animation.
   * Used by the gallery/preview and screenshots — not exposed as a control.
   */
  seek: z.coerce.number().min(0).max(1).optional(),
});

export type HourglassParams = z.infer<typeof hourglassSchema>;

export const hourglassDefaults: HourglassParams = hourglassSchema.parse({});
