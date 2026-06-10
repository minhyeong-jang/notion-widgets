import { z } from "zod";

export const pomodoroSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  variant: z.enum(["compact", "standard"]).default("compact"),
  workMinutes: z.string().default("25"),
  breakMinutes: z.string().default("5"),
  sessions: z.string().default("4"),
});

export type PomodoroParams = z.infer<typeof pomodoroSchema>;

export const pomodoroDefaults: PomodoroParams = pomodoroSchema.parse({});
