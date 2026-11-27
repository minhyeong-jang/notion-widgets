import { z } from "zod";

const booleanStr = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((v) => v === true || v === "true");

export const mandalaSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  variant: z.enum(["rose", "spiro", "star", "web"]).default("rose"),
  complexity: z.enum(["low", "med", "high"]).default("med"),
  animate: booleanStr.default("true"),
});

export type MandalaParams = z.infer<typeof mandalaSchema>;

export const mandalaDefaults: MandalaParams = mandalaSchema.parse({});
