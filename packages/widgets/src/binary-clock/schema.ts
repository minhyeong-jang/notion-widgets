import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const binaryClockSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  // columns = classic BCD (vertical bit columns per digit)
  // rows    = one binary number per H/M/S row
  variant: z.enum(["columns", "rows"]).default("columns"),
  hour12: booleanStr.default("false"),
  showSeconds: booleanStr.default("true"),
  showLabels: booleanStr.default("true"),
  showDecimal: booleanStr.default("true"),
});

export type BinaryClockParams = z.infer<typeof binaryClockSchema>;

export const binaryClockDefaults: BinaryClockParams = binaryClockSchema.parse({});
