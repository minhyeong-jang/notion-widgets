import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

// 0–100 percentage; over-achievement is clamped for the arc but kept for display.
const pct = z.coerce.number().min(0).max(999);

export const activityRingsSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["rings", "row"]).default("rings"),
  // Ring 1 (outer)
  r1: pct.default(80),
  l1: z.string().default("Move"),
  // Ring 2 (middle)
  r2: pct.default(65),
  l2: z.string().default("Exercise"),
  // Ring 3 (inner)
  r3: pct.default(45),
  l3: z.string().default("Stand"),
  showLegend: booleanStr.default("true"),
});

export type ActivityRingsParams = z.infer<typeof activityRingsSchema>;

export const activityRingsDefaults: ActivityRingsParams = activityRingsSchema.parse({});
