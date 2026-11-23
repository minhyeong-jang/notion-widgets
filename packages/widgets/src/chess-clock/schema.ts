import { z } from "zod";

export const chessClockSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["split", "stacked", "bars"]).default("split"),
  minutes: z.coerce.number().min(1).max(180).default(5),
  increment: z.coerce.number().min(0).max(60).default(0),
});

export type ChessClockParams = z.infer<typeof chessClockSchema>;

export const chessClockDefaults: ChessClockParams = chessClockSchema.parse({});
