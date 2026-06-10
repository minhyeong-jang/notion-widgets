import { z } from "zod";

export const worldClockSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  timezones: z.string().default("America/New_York,Europe/London,Asia/Seoul,Asia/Tokyo"),
  format: z.enum(["12h", "24h"]).default("24h"),
  variant: z.enum(["minimal", "list"]).default("minimal"),
});

export type WorldClockParams = z.infer<typeof worldClockSchema>;

export const worldClockDefaults: WorldClockParams = worldClockSchema.parse({});
