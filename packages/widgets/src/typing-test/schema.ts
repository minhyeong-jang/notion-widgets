import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const typingTestSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["words", "quote", "zen"]).default("words"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  showLive: booleanStr.default("true"),
});

export type TypingTestParams = z.infer<typeof typingTestSchema>;

export const typingTestDefaults: TypingTestParams = typingTestSchema.parse({});
