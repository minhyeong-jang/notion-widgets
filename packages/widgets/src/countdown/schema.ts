import { z } from "zod";

const hexColor = z.string().regex(/^[0-9a-fA-F]{6}$/).default("fb7185");
const booleanStr = z.enum(["true", "false"]).transform(v => v === "true").default("true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const countdownSchema = z.object({
  theme: z.string().default("minimal"),
  targetDate: dateStr.default("2026-12-31"),
  label: z.string().default("D-Day"),
  color: hexColor,
  bg: z.string().default("18181b"),
  style: z.enum(["card", "simple"]).default("card"),
  showHours: booleanStr,
});

export type CountdownParams = z.infer<typeof countdownSchema>;

export const countdownDefaults: CountdownParams = countdownSchema.parse({});
