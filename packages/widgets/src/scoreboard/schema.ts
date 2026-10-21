import { z } from "zod";

export const scoreboardSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["versus", "stack", "minimal"]).default("versus"),
  /** Team / side names. Empty → localized defaults ("Team A" / "Team B"). */
  team1: z.string().default(""),
  team2: z.string().default(""),
  /** Points added per tap. */
  step: z.coerce.number().min(1).max(100).default(1),
  /** Win target; 0 = no target (just a running tally). */
  target: z.coerce.number().min(0).max(999).default(0),
  /**
   * Storage-key suffix so several scoreboards in one Notion page keep
   * independent scores. NOT named `mode`/`colorMode` (reserved for dark/light).
   */
  boardId: z.string().default("default"),
});

export type ScoreboardParams = z.infer<typeof scoreboardSchema>;

export const scoreboardDefaults: ScoreboardParams = scoreboardSchema.parse({});
