import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const weatherSchema = z.object({
  theme: z.string().default("minimal"),
  style: z.enum(["minimal", "card"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
  city: z.string().default("Seoul"),
  units: z.enum(["C", "F"]).default("C"),
});

export type WeatherParams = z.infer<typeof weatherSchema>;

export const weatherDefaults: WeatherParams = weatherSchema.parse({});
