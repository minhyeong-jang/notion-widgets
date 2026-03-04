import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("ef4444");

export const pomodoroSchema = z.object({
  theme: z.string().default("custom"),
  style: z.enum(["compact", "standard"]).default("compact"),
  workMinutes: z.string().default("25"),
  breakMinutes: z.string().default("5"),
  color: hexColor,
  bg: z.string().default("18181b"),
  sessions: z.string().default("4"),
});

export type PomodoroParams = z.infer<typeof pomodoroSchema>;

export const pomodoroDefaults: PomodoroParams = pomodoroSchema.parse({});
