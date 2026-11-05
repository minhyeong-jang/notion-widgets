import { z } from "zod";

const booleanStr = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((v) => v === true || v === "true");

export const chineseZodiacSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("red"),
  locale: z.string().default("en-US"),
  variant: z.enum(["card", "animal", "wheel"]).default("card"),
  // Either a direct animal id, or "auto" to derive from `year`.
  sign: z
    .enum([
      "auto",
      "rat",
      "ox",
      "tiger",
      "rabbit",
      "dragon",
      "snake",
      "horse",
      "goat",
      "monkey",
      "rooster",
      "dog",
      "pig",
    ])
    .default("auto"),
  // Birth year, used when sign === "auto".
  year: z.coerce.number().int().default(2000),
  showYear: booleanStr.default("true"),
  showElement: booleanStr.default("true"),
  showTraits: booleanStr.default("true"),
});

export type ChineseZodiacParams = z.infer<typeof chineseZodiacSchema>;

export const chineseZodiacDefaults: ChineseZodiacParams =
  chineseZodiacSchema.parse({});
