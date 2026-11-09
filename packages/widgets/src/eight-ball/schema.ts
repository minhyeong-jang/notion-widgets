import { z } from "zod";

export const eightBallSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("purple"),
  locale: z.string().default("en-US"),
  variant: z.enum(["ball", "orb", "card"]).default("ball"),
});

export type EightBallParams = z.infer<typeof eightBallSchema>;

export const eightBallDefaults: EightBallParams = eightBallSchema.parse({});
