import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const miniCalendarSchema = z.object({
  theme: z.string().default("minimal"),
  locale: z.string().default("en-US"),
  firstDay: z.enum(["sun", "mon"]).default("sun"),
  color: hexColor,
  bg: z.string().default("18181b"),
  style: z.enum(["minimal", "card"]).default("minimal"),
});

export type MiniCalendarParams = z.infer<typeof miniCalendarSchema>;

export const miniCalendarDefaults: MiniCalendarParams = miniCalendarSchema.parse({});
