import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const kanbanSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["board", "stack"]).default("board"),
  // Optional board heading shown above the columns. Empty = hidden.
  title: z.string().default(""),
  // Each column: a title + "|"-separated cards (URL-friendly).
  col1Title: z.string().default("To Do"),
  col1: z.string().default("Design landing page|Write copy|Pick palette"),
  col2Title: z.string().default("In Progress"),
  col2: z.string().default("Build widget API|User testing"),
  col3Title: z.string().default("Done"),
  col3: z.string().default("Project kickoff|Set up repo"),
  showCount: booleanStr.default("true"),
});

export type KanbanParams = z.infer<typeof kanbanSchema>;

export const kanbanDefaults: KanbanParams = kanbanSchema.parse({});

/** Split a "|"-separated column value into trimmed, non-empty card labels. */
export function parseCards(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export interface KanbanColumn {
  title: string;
  cards: string[];
}

/** Build the ordered, non-empty column list from the flat params. */
export function getColumns(params: KanbanParams): KanbanColumn[] {
  return [
    { title: params.col1Title.trim(), cards: parseCards(params.col1) },
    { title: params.col2Title.trim(), cards: parseCards(params.col2) },
    { title: params.col3Title.trim(), cards: parseCards(params.col3) },
  ].filter((c) => c.title || c.cards.length > 0);
}
