import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const ddaySchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["list", "cards", "featured"]).default("list"),
  /**
   * Events encoded as `name~YYYY-MM-DD`, multiple joined by `,`.
   * Example: `New Year~2027-01-01,Christmas~2026-12-25`
   */
  events: z
    .string()
    .default("New Year~2027-01-01,Summer Trip~2026-08-01,Christmas~2026-12-25"),
  sort: z.enum(["soon", "date"]).default("soon"),
  title: z.string().default("D-Day"),
  showDate: booleanStr.default("true"),
});

export type DdayParams = z.infer<typeof ddaySchema>;

export const ddayDefaults: DdayParams = ddaySchema.parse({});
