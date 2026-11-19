import { z } from "zod";

export const zenGardenSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["circular", "linear"]).default("circular"),
  stones: z.enum(["2", "3"]).default("3"),
  locale: z.string().default("en-US"),
});

export type ZenGardenParams = z.infer<typeof zenGardenSchema>;

export const zenGardenDefaults: ZenGardenParams = zenGardenSchema.parse({});
