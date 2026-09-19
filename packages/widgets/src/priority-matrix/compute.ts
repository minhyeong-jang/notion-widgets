export type QuadrantId = "q1" | "q2" | "q3" | "q4";

export interface Quadrant {
  id: QuadrantId;
  /** Visual emphasis 0 (lowest) … 3 (highest). */
  level: number;
  /** true for the two "important" quadrants (accent-tinted). */
  important: boolean;
  tasks: string[];
  hiddenCount: number;
}

export const QUADRANT_ORDER: QuadrantId[] = ["q1", "q2", "q3", "q4"];
export const MAX_TASKS_PER_QUADRANT = 5;

const META: Record<QuadrantId, { level: number; important: boolean }> = {
  q1: { level: 3, important: true },
  q2: { level: 2, important: true },
  q3: { level: 1, important: false },
  q4: { level: 0, important: false },
};

/** Accept a range of tokens for each quadrant. */
const TOKEN_MAP: Record<string, QuadrantId> = {
  q1: "q1",
  q2: "q2",
  q3: "q3",
  q4: "q4",
  "1": "q1",
  "2": "q2",
  "3": "q3",
  "4": "q4",
  do: "q1",
  schedule: "q2",
  plan: "q2",
  delegate: "q3",
  eliminate: "q4",
  drop: "q4",
};

/**
 * Parse the tasks string ("q1|Ship, q3|Emails") into the four quadrants,
 * preserving order and capping tasks per quadrant.
 */
export function computeQuadrants(raw: string): Quadrant[] {
  const buckets: Record<QuadrantId, string[]> = { q1: [], q2: [], q3: [], q4: [] };
  const overflow: Record<QuadrantId, number> = { q1: 0, q2: 0, q3: 0, q4: 0 };

  if (raw) {
    for (const chunk of raw.split(",")) {
      const entry = chunk.trim();
      if (!entry) continue;

      const sep = entry.indexOf("|");
      if (sep === -1) continue;

      const token = entry.slice(0, sep).trim().toLowerCase();
      const text = entry.slice(sep + 1).trim();
      if (!text) continue;

      const q = TOKEN_MAP[token];
      if (!q) continue;

      if (buckets[q].length < MAX_TASKS_PER_QUADRANT) {
        buckets[q].push(text);
      } else {
        overflow[q]++;
      }
    }
  }

  return QUADRANT_ORDER.map((id) => ({
    id,
    level: META[id].level,
    important: META[id].important,
    tasks: buckets[id],
    hiddenCount: overflow[id],
  }));
}
