import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const flashcardSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /** card: 3D flip · quiz: show-answer prompt · list: tap-to-reveal rows */
  variant: z.enum(["card", "quiz", "list"]).default("card"),
  /** Deck name shown as a small tag. */
  deck: z.string().default("Study Deck"),
  /** Cards as "front~back | front~back | …" (~ splits sides, | splits cards). */
  cards: z
    .string()
    .default(
      "What is the capital of France?~Paris | 2 + 2 = ?~4 | Largest planet?~Jupiter",
    ),
  /** Show the running counter (e.g. 1 / 3). */
  showCounter: booleanStr.default("true"),
});

export type FlashcardParams = z.infer<typeof flashcardSchema>;

export const flashcardDefaults: FlashcardParams = flashcardSchema.parse({});

export interface Card {
  front: string;
  back: string;
}

/** Parse the "front~back | …" string into structured cards. */
export function parseCards(raw: string): Card[] {
  return raw
    .split("|")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [front, ...rest] = chunk.split("~");
      return {
        front: (front ?? "").trim(),
        back: rest.join("~").trim(),
      };
    })
    .filter((c) => c.front || c.back);
}
