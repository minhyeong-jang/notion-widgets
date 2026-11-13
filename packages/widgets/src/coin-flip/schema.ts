import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const coinFlipSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  sideA: z.string().default("Heads"),
  sideB: z.string().default("Tails"),
  mode: z.enum(["random", "daily"]).default("random"),
  showHint: booleanStr.default("true"),
});

export type CoinFlipParams = z.infer<typeof coinFlipSchema>;

export const coinFlipDefaults: CoinFlipParams = coinFlipSchema.parse({});
