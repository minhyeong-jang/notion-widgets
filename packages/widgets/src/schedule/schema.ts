import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const scheduleSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("blue"),
  locale: z.string().default("en-US"),
  variant: z.enum(["timeline", "list", "cards"]).default("timeline"),
  title: z.string().default("Today"),
  /**
   * Events encoded as `label~HH:MM~HH:MM` (start~end), joined by `,`.
   * The end time is optional (`label~HH:MM`). Example:
   * `Deep work~09:00~12:00,Lunch~12:00~13:00,Gym~18:00`
   */
  events: z
    .string()
    .default(
      "Morning routine~07:00~08:00,Deep work~09:00~12:00,Lunch~12:00~13:00,Team sync~14:00~15:00,Gym~18:00~19:00,Reading~21:00~22:00",
    ),
  showTitle: booleanStr.default("true"),
  showNow: booleanStr.default("true"),
});

export type ScheduleParams = z.infer<typeof scheduleSchema>;

export const scheduleDefaults: ScheduleParams = scheduleSchema.parse({});
