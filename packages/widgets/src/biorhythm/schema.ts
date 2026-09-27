import { z } from "zod";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const biorhythmSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("ocean"),
  locale: z.string().default("en-US"),
  variant: z.enum(["chart", "rings", "bars"]).default("chart"),
  /** Birthday to count cycles from (YYYY-MM-DD). */
  birth: dateStr.default("1996-05-20"),
});

export type BiorhythmParams = z.infer<typeof biorhythmSchema>;

export const biorhythmDefaults: BiorhythmParams = biorhythmSchema.parse({});
