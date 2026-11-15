import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const statusSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["card", "pill", "banner"]).default("card"),
  status: z
    .enum(["available", "busy", "away", "focus", "offline", "custom"])
    .default("available"),
  /** Optional label override; empty → preset default label. */
  label: z.string().default(""),
  /** Optional secondary line (what you're doing, until when, etc.). */
  message: z.string().default(""),
  pulse: booleanStr.default("true"),
});

export type StatusParams = z.infer<typeof statusSchema>;

export const statusDefaults: StatusParams = statusSchema.parse({});
