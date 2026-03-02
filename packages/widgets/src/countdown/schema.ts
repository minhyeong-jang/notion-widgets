import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("7fb686");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true").default("true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const countdownSchema = z.object({
  targetDate: dateStr.default("2026-12-31"),
  label: z.string().default("D-Day"),
  color: hexColor,
  bg: z.string().default("18181b"),
  showHours: booleanStr,
});

export type CountdownParams = z.infer<typeof countdownSchema>;

export const countdownDefaults: CountdownParams = countdownSchema.parse({});
