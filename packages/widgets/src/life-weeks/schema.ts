import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const lifeWeeksSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["weeks", "year", "years"]).default("weeks"),
  birthdate: dateStr.default("2000-01-01"),
  lifespan: z.coerce.number().min(1).max(130).default(80),
  title: z.string().default(""),
  showStats: booleanStr.default("true"),
});

export type LifeWeeksParams = z.infer<typeof lifeWeeksSchema>;

export const lifeWeeksDefaults: LifeWeeksParams = lifeWeeksSchema.parse({});
