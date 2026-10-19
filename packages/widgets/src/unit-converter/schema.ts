import { z } from "zod";

export const unitConverterSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["stack", "compact", "focus"]).default("stack"),
  category: z.enum(["length", "weight", "temperature", "volume"]).default("length"),
  from: z.string().default("km"),
  to: z.string().default("mi"),
  value: z.coerce.number().default(1),
});

export type UnitConverterParams = z.infer<typeof unitConverterSchema>;

export const unitConverterDefaults: UnitConverterParams = unitConverterSchema.parse({});
