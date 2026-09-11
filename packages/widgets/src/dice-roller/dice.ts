/**
 * Pip layout for a six-sided die. Positions index a 3×3 grid:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 */
export const PIP_LAYOUT: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export interface DiceStrings {
  roll: string;
  rolling: string;
  total: string;
}

const STRINGS: Record<string, DiceStrings> = {
  ko: { roll: "굴리기", rolling: "굴리는 중…", total: "합계" },
  en: { roll: "Roll", rolling: "Rolling…", total: "Total" },
  ja: { roll: "振る", rolling: "振っています…", total: "合計" },
  zh: { roll: "掷骰", rolling: "投掷中…", total: "合计" },
  de: { roll: "Würfeln", rolling: "Würfelt…", total: "Summe" },
  fr: { roll: "Lancer", rolling: "Lancement…", total: "Total" },
  es: { roll: "Tirar", rolling: "Tirando…", total: "Total" },
};

export function getDiceStrings(locale: string): DiceStrings {
  const lang = locale.slice(0, 2);
  return STRINGS[lang] ?? STRINGS.en;
}
