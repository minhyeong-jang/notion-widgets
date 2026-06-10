import { z } from "zod";

export const weatherSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  variant: z.enum(["minimal", "card"]).default("minimal"),
  city: z.string().default("Seoul"),
  units: z.enum(["C", "F"]).default("C"),
});

export type WeatherParams = z.infer<typeof weatherSchema>;

export const weatherDefaults: WeatherParams = weatherSchema.parse({});
