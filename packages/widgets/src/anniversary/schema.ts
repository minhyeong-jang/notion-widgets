import { z } from "zod";

const booleanStr = z
  .enum(["true", "false"])
  .transform((v) => v === "true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const anniversarySchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /** plus: big D+ number · ring: progress to next 100-day mark · stat: days/weeks/months grid */
  variant: z.enum(["plus", "ring", "stat"]).default("plus"),
  /** The memorable date we count up from (YYYY-MM-DD). */
  startDate: dateStr.default("2024-01-01"),
  label: z.string().default("Together"),
  /** Korean convention: the start day itself is day 1 (D+1). */
  countFromOne: booleanStr.default("true"),
  /** Show the "next milestone" hint (next 100-day mark or anniversary). */
  showMilestone: booleanStr.default("true"),
  /** Show the start date line. */
  showDate: booleanStr.default("true"),
});

export type AnniversaryParams = z.infer<typeof anniversarySchema>;

export const anniversaryDefaults: AnniversaryParams = anniversarySchema.parse({});
