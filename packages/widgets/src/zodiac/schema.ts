import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const zodiacSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("purple"),
  variant: z.enum(["card", "constellation", "compact"]).default("card"),
  /**
   * Birthday as `MM-DD` (e.g. `08-14`) — the sign is derived from it.
   * A sign id (e.g. `leo`) is also accepted.
   */
  birthday: z.string().default("08-14"),
  locale: z.string().default("en-US"),
  showTraits: booleanStr.default("true"),
});

export type ZodiacParams = z.infer<typeof zodiacSchema>;

export const zodiacDefaults: ZodiacParams = zodiacSchema.parse({});
