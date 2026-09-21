import { z } from "zod";

export const qrCodeSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  data: z.string().default("https://widgets.doriri.dev"),
  variant: z.enum(["square", "rounded", "dots"]).default("rounded"),
  ecLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
  caption: z.string().default(""),
});

export type QrCodeParams = z.infer<typeof qrCodeSchema>;

export const qrCodeDefaults: QrCodeParams = qrCodeSchema.parse({});
