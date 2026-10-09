import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const seasonSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  /** ring: circular progress · bar: compact bar · seasons: four-season cycle */
  variant: z.enum(["ring", "bar", "seasons"]).default("ring"),
  /** Hemisphere decides which season each month belongs to. */
  hemisphere: z.enum(["north", "south"]).default("north"),
  /** Show the big percentage; when off, show the days-left number instead. */
  showPercent: booleanStr.default("true"),
});

export type SeasonParams = z.infer<typeof seasonSchema>;

export const seasonDefaults: SeasonParams = seasonSchema.parse({});
