import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");

export const pomodoroSchema = z.object({
  workMinutes: z.string().default("25"),
  breakMinutes: z.string().default("5"),
  color: hexColor,
  bg: z.string().default("18181b"),
});

export type PomodoroParams = z.infer<typeof pomodoroSchema>;

export const pomodoroDefaults: PomodoroParams = pomodoroSchema.parse({});
