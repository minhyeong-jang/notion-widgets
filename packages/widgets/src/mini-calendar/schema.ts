import { z } from "zod";

export const miniCalendarSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  firstDay: z.enum(["sun", "mon"]).default("sun"),
  variant: z.enum(["minimal", "card"]).default("minimal"),
});

export type MiniCalendarParams = z.infer<typeof miniCalendarSchema>;

export const miniCalendarDefaults: MiniCalendarParams = miniCalendarSchema.parse({});
