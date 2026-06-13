import { z } from "zod";

export const startupTipsSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  category: z.enum(["all", "startup", "growth", "mindset"]).default("all"),
  locale: z.string().default("en-US"),
  mode: z.enum(["daily", "random"]).default("daily"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
});

export type StartupTipsParams = z.infer<typeof startupTipsSchema>;

export const startupTipsDefaults: StartupTipsParams = startupTipsSchema.parse({});
