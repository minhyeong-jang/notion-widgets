import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const progressBarSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["bar", "segmented", "striped", "steps"]).default("bar"),
  label: z.string().default("Project Progress"),
  value: z.coerce.number().min(0).default(72),
  target: z.coerce.number().min(1).default(100),
  unit: z.string().default(""),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  showPercent: booleanStr.default("true"),
});

export type ProgressBarParams = z.infer<typeof progressBarSchema>;

export const progressBarDefaults: ProgressBarParams = progressBarSchema.parse({});
