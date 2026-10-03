import { z } from "zod";

export const roadmapSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  /**
   * steps = numbered circles in a row connected by a line (labels below).
   * vertical = stacked timeline with dots and labels to the right.
   * bar = compact progress bar with a step counter and current/next label.
   */
  variant: z.enum(["steps", "vertical", "bar"]).default("steps"),
  /** Optional heading shown above the roadmap. Empty hides it. */
  title: z.string().default(""),
  /**
   * Stage labels joined by `|`. Example: `Plan|Design|Build|Launch`.
   * When empty, a localized sample is used.
   */
  steps: z.string().default(""),
  /**
   * 1-indexed stage currently in progress. Stages before it are done,
   * stages after it are upcoming. A value past the last stage marks all
   * stages complete.
   */
  current: z.coerce.number().int().min(1).default(2),
});

export type RoadmapParams = z.infer<typeof roadmapSchema>;

export const roadmapDefaults: RoadmapParams = roadmapSchema.parse({});
