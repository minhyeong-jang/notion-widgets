import { z } from "zod";

export const stickyNoteSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("sunset"),
  /** Decoration attached to the note. */
  variant: z.enum(["tape", "pin", "bar"]).default("tape"),
  /** Optional heading shown above the body. Empty hides it. */
  title: z.string().default(""),
  /**
   * Note body. Use `\n` (literal) or `|` to separate lines.
   * Example: `Buy milk|Call mom|Ship the update`
   */
  text: z.string().default("Don't forget to\nwater the plants 🌿"),
  align: z.enum(["left", "center"]).default("left"),
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
});

export type StickyNoteParams = z.infer<typeof stickyNoteSchema>;

export const stickyNoteDefaults: StickyNoteParams = stickyNoteSchema.parse({});
