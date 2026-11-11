import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const wordOfDaySchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("ko-KR"),
  variant: z.enum(["dictionary", "simple", "poster"]).default("dictionary"),
  // NOTE: not named "mode" — the embed renderer treats a `mode` query param as
  // the dark/light color mode. `rotation` controls which word is shown.
  rotation: z.enum(["daily", "random"]).default("daily"),
  showPhonetic: booleanStr.default("true"),
  showExample: booleanStr.default("true"),
  showMeaning: booleanStr.default("true"),
});

export type WordOfDayParams = z.infer<typeof wordOfDaySchema>;

export const wordOfDayDefaults: WordOfDayParams = wordOfDaySchema.parse({});
