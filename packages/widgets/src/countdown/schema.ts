import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform(v => v === "true").default("true");
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const countdownSchema = z.object({
  style: z.string().default("minimal"),
  colorTheme: z.string().default("default"),
  targetDate: dateStr.default("2026-12-31"),
  label: z.string().default("D-Day"),
  variant: z.enum(["card", "simple"]).default("card"),
  showHours: booleanStr,
});

export type CountdownParams = z.infer<typeof countdownSchema>;

export const countdownDefaults: CountdownParams = countdownSchema.parse({});
