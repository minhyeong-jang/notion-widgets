import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const priorityMatrixSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["quadrant", "list", "focus"]).default("quadrant"),
  title: z.string().default("Priorities"),
  /**
   * Tasks encoded as `quadrant|text` entries separated by commas.
   * Quadrant token: q1 (do), q2 (schedule), q3 (delegate), q4 (eliminate).
   * The same quadrant may appear multiple times for multiple tasks.
   */
  tasks: z
    .string()
    .default(
      "q1|Fix login bug, q1|Prep board deck, q2|Plan Q4 roadmap, q2|Learn Rust, q3|Reply to emails, q3|Team lunch RSVP, q4|Scroll social media",
    ),
  showAxis: booleanStr.default("true"),
});

export type PriorityMatrixParams = z.infer<typeof priorityMatrixSchema>;

export const priorityMatrixDefaults: PriorityMatrixParams =
  priorityMatrixSchema.parse({});
