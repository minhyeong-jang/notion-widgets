import { z } from "zod";

const booleanStr = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((v) => v === true || v === "true");

export const barChartSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  /** bars = vertical columns, rows = horizontal bars, line = area sparkline. */
  variant: z.enum(["bars", "rows", "line"]).default("bars"),
  /**
   * Data points encoded as `label~value`, joined by `,`.
   * Example: `Mon~4,Tue~7,Wed~5`. When empty, a localized weekly sample is used.
   */
  data: z.string().default(""),
  /** Optional heading above the chart. Empty hides it. */
  title: z.string().default(""),
  /** Fixed axis maximum. 0 (default) auto-scales to the largest value. */
  max: z.coerce.number().default(0),
  showValue: booleanStr.default("true"),
});

export type BarChartParams = z.infer<typeof barChartSchema>;

export const barChartDefaults: BarChartParams = barChartSchema.parse({});
