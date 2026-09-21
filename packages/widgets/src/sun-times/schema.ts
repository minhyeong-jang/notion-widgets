import { z } from "zod";

export const sunTimesSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  city: z.string().default("seoul"),
  variant: z.enum(["arc", "compact"]).default("arc"),
  locale: z.string().default("ko-KR"),
});

export type SunTimesParams = z.infer<typeof sunTimesSchema>;

export const sunTimesDefaults: SunTimesParams = sunTimesSchema.parse({});
