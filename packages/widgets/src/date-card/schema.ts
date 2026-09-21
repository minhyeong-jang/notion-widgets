import { z } from "zod";

export const dateCardSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["tearoff", "stack", "banner"]).default("tearoff"),
  info: z.enum(["none", "dayOfYear", "week"]).default("none"),
  note: z.string().default(""),
});

export type DateCardParams = z.infer<typeof dateCardSchema>;

export const dateCardDefaults: DateCardParams = dateCardSchema.parse({});
