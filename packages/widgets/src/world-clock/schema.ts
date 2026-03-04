import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const worldClockSchema = z.object({
  theme: z.string().default("custom"),
  timezones: z.string().default("America/New_York,Europe/London,Asia/Seoul,Asia/Tokyo"),
  format: z.enum(["12h", "24h"]).default("24h"),
  style: z.enum(["minimal", "list"]).default("minimal"),
  color: hexColor,
  bg: z.string().default("18181b"),
});

export type WorldClockParams = z.infer<typeof worldClockSchema>;

export const worldClockDefaults: WorldClockParams = worldClockSchema.parse({});
