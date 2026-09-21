// Canonical English QLOCKTWO layout — 11 columns × 10 rows.
// Every row is exactly 11 letters; filler letters (X/S/F/ERU/DC…) stay unlit.
export const GRID = [
  "ITLISASAMPM",
  "ACQUARTERDC",
  "TWENTYFIVEX",
  "HALFSTENFTO",
  "PASTERUNINE",
  "ONESIXTHREE",
  "FOURFIVETWO",
  "EIGHTELEVEN",
  "SEVENTWELVE",
  "TENSEOCLOCK",
] as const;

export type WordKey =
  | "IT" | "IS"
  | "M_FIVE" | "M_TEN" | "QUARTER" | "TWENTY" | "HALF"
  | "PAST" | "TO"
  | "H_ONE" | "H_TWO" | "H_THREE" | "H_FOUR" | "H_FIVE" | "H_SIX"
  | "H_SEVEN" | "H_EIGHT" | "H_NINE" | "H_TEN" | "H_ELEVEN" | "H_TWELVE"
  | "OCLOCK";

// [row, startCol, endCol] — inclusive. Verified against GRID above.
export const SPAN: Record<WordKey, [number, number, number]> = {
  IT: [0, 0, 1],
  IS: [0, 3, 4],
  M_FIVE: [2, 6, 9],
  M_TEN: [3, 5, 7],
  QUARTER: [1, 2, 8],
  TWENTY: [2, 0, 5],
  HALF: [3, 0, 3],
  PAST: [4, 0, 3],
  TO: [3, 9, 10],
  H_ONE: [5, 0, 2],
  H_TWO: [6, 8, 10],
  H_THREE: [5, 6, 10],
  H_FOUR: [6, 0, 3],
  H_FIVE: [6, 4, 7],
  H_SIX: [5, 3, 5],
  H_SEVEN: [8, 0, 4],
  H_EIGHT: [7, 0, 4],
  H_NINE: [4, 7, 10],
  H_TEN: [9, 0, 2],
  H_ELEVEN: [7, 5, 10],
  H_TWELVE: [8, 5, 10],
  OCLOCK: [9, 5, 10],
};

export const LABEL: Record<WordKey, string> = {
  IT: "IT", IS: "IS",
  M_FIVE: "FIVE", M_TEN: "TEN", QUARTER: "QUARTER", TWENTY: "TWENTY", HALF: "HALF",
  PAST: "PAST", TO: "TO",
  H_ONE: "ONE", H_TWO: "TWO", H_THREE: "THREE", H_FOUR: "FOUR", H_FIVE: "FIVE",
  H_SIX: "SIX", H_SEVEN: "SEVEN", H_EIGHT: "EIGHT", H_NINE: "NINE", H_TEN: "TEN",
  H_ELEVEN: "ELEVEN", H_TWELVE: "TWELVE", OCLOCK: "O'CLOCK",
};

const HOUR_KEYS: WordKey[] = [
  "H_TWELVE", "H_ONE", "H_TWO", "H_THREE", "H_FOUR", "H_FIVE", "H_SIX",
  "H_SEVEN", "H_EIGHT", "H_NINE", "H_TEN", "H_ELEVEN", "H_TWELVE",
];

export interface ClockPhrase {
  prefix: WordKey[]; // IT IS
  words: WordKey[]; // minute + past/to (or O'CLOCK), in reading order
  hour: WordKey; // the highlighted hour word
  hourFirst: boolean; // true for "…O'CLOCK" where the hour is spoken before the tail
  extra: number; // 0–4 leftover minutes → corner dots
}

/** Turn an hour (0–23) + minute (0–59) into the words a word clock lights up. */
export function clockPhrase(h: number, m: number): ClockPhrase {
  const extra = m % 5;
  let r = Math.round(m / 5) * 5; // nearest 5-minute step
  let hr = h;
  if (r === 60) {
    r = 0;
    hr = h + 1;
  }
  const useNext = r > 30;

  const words: WordKey[] = [];
  if (r === 0) {
    // hour + O'CLOCK
  } else {
    switch (r) {
      case 5: words.push("M_FIVE"); break;
      case 10: words.push("M_TEN"); break;
      case 15: words.push("QUARTER"); break;
      case 20: words.push("TWENTY"); break;
      case 25: words.push("TWENTY", "M_FIVE"); break;
      case 30: words.push("HALF"); break;
      case 35: words.push("TWENTY", "M_FIVE"); break;
      case 40: words.push("TWENTY"); break;
      case 45: words.push("QUARTER"); break;
      case 50: words.push("M_TEN"); break;
      case 55: words.push("M_FIVE"); break;
    }
    words.push(useNext ? "TO" : "PAST");
  }

  const dispHour = useNext ? hr + 1 : hr;
  const h12 = ((dispHour % 12) + 12) % 12; // 0..11 index into HOUR_KEYS (0 → 12)
  const hour = HOUR_KEYS[h12 === 0 ? 12 : h12];

  return {
    prefix: ["IT", "IS"],
    words: r === 0 ? ["OCLOCK"] : words,
    hour,
    hourFirst: r === 0,
    extra,
  };
}

/** Set of "row-col" cell keys to light for a phrase, for the grid variant. */
export function litCells(p: ClockPhrase): Set<string> {
  const lit = new Set<string>();
  const keys: WordKey[] = [...p.prefix, ...p.words, p.hour];
  for (const key of keys) {
    const [row, s, e] = SPAN[key];
    for (let c = s; c <= e; c++) lit.add(`${row}-${c}`);
  }
  return lit;
}
