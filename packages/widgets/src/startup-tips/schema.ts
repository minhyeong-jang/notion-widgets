import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const startupTipsSchema = z.object({
  theme: z.string().default("minimal"),
  category: z.enum(["all", "startup", "growth", "mindset"]).default("all"),
  locale: z.string().default("en-US"),
  color: hexColor,
  bg: z.string().default("18181b"),
  mode: z.enum(["daily", "random"]).default("daily"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
});

export type StartupTipsParams = z.infer<typeof startupTipsSchema>;

export const startupTipsDefaults: StartupTipsParams = startupTipsSchema.parse({});
