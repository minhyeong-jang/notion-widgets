import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const wordClockSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  // grid = QLOCKTWO-style letter matrix, phrase = stacked words, line = single sentence
  variant: z.enum(["grid", "phrase", "line"]).default("grid"),
  // The 4 corner dots that show the leftover 1–4 minutes (QLOCKTWO detail).
  showDots: booleanStr.default("true"),
});

export type WordClockParams = z.infer<typeof wordClockSchema>;

export const wordClockDefaults: WordClockParams = wordClockSchema.parse({});
