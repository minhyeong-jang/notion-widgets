import { z } from "zod";

export const diceRollerSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("sunset"),
  locale: z.string().default("en-US"),
  variant: z.enum(["single", "double", "d20"]).default("double"),
});

export type DiceRollerParams = z.infer<typeof diceRollerSchema>;

export const diceRollerDefaults: DiceRollerParams = diceRollerSchema.parse({});
