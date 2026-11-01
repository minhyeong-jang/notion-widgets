import { z } from "zod";

const booleanStr = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((v) => v === true || v === "true");

export const metricSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /**
   * stat    = centered headline number
   * trend   = headline number + delta badge + sparkline
   * compact = horizontal list-item layout (great for stacking)
   */
  variant: z.enum(["stat", "trend", "compact"]).default("trend"),
  /** Small eyebrow / metric name. */
  label: z.string().default("Monthly Revenue"),
  /** The headline value. Commas and spaces are ignored when computing trend. */
  value: z.string().default("12,480"),
  /** Prepended to the value (e.g. `$`). */
  prefix: z.string().default("$"),
  /** Appended to the value (e.g. `%`, `kg`). */
  suffix: z.string().default(""),
  /** Small caption below the value. Empty hides it. */
  caption: z.string().default("vs last month"),
  /** Previous value used to compute the delta badge. Empty hides the badge. */
  previous: z.string().default("11,090"),
  /**
   * Sparkline data points (comma separated numbers) for the `trend` variant.
   * Empty hides the sparkline. Example: `8,9.2,8.6,10.1,11.4,11,12.48`.
   */
  series: z.string().default("8,9.2,8.6,10.1,11.4,11,12.48"),
  /** When true, a downward trend is "good" (green) — e.g. weight, expenses. */
  invertTrend: booleanStr.default("false"),
});

export type MetricParams = z.infer<typeof metricSchema>;

export const metricDefaults: MetricParams = metricSchema.parse({});
