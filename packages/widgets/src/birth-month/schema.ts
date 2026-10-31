import { z } from "zod";

export const birthMonthSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("purple"),
  locale: z.string().default("ko-KR"),
  // 1-12; coerce so URL string "3" parses to number 3
  month: z.coerce.number().int().min(1).max(12).default(1),
  variant: z.enum(["gem", "flower", "card"]).default("card"),
});

export type BirthMonthParams = z.infer<typeof birthMonthSchema>;

export const birthMonthDefaults: BirthMonthParams = birthMonthSchema.parse({});
