/**
 * Zodiac sign data — dates, element, ruling planet, keyword traits, and a
 * hand-crafted constellation star map (normalized to a 100×100 viewBox).
 *
 * The star maps are stylized/recognizable rather than astronomically exact —
 * the goal is an aesthetic constellation, not a sky chart.
 */

export type Element = "fire" | "earth" | "air" | "water";

export interface ZodiacSign {
  id: string;
  /** Unicode astrological glyph */
  glyph: string;
  name: string;
  nameKo: string;
  /** Inclusive start month/day */
  from: { m: number; d: number };
  /** Inclusive end month/day */
  to: { m: number; d: number };
  element: Element;
  planet: string;
  planetKo: string;
  traits: string[];
  traitsKo: string[];
  /** Star coordinates in a 100×100 viewBox */
  stars: Array<[number, number]>;
  /** Connections between star indices */
  lines: Array<[number, number]>;
}

export const ELEMENT_LABELS: Record<Element, { en: string; ko: string; symbol: string }> = {
  fire: { en: "Fire", ko: "불", symbol: "△" },
  earth: { en: "Earth", ko: "흙", symbol: "▽" },
  air: { en: "Air", ko: "공기", symbol: "△" },
  water: { en: "Water", ko: "물", symbol: "▽" },
};

export const SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    glyph: "♈",
    name: "Aries",
    nameKo: "양자리",
    from: { m: 3, d: 21 },
    to: { m: 4, d: 19 },
    element: "fire",
    planet: "Mars",
    planetKo: "화성",
    traits: ["Bold", "Driven", "Fearless"],
    traitsKo: ["대담함", "추진력", "용감함"],
    stars: [
      [16, 66],
      [37, 58],
      [58, 52],
      [79, 40],
      [88, 54],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "taurus",
    glyph: "♉",
    name: "Taurus",
    nameKo: "황소자리",
    from: { m: 4, d: 20 },
    to: { m: 5, d: 20 },
    element: "earth",
    planet: "Venus",
    planetKo: "금성",
    traits: ["Steady", "Loyal", "Grounded"],
    traitsKo: ["끈기", "충직함", "안정감"],
    stars: [
      [18, 28],
      [36, 46],
      [52, 56],
      [68, 46],
      [86, 28],
      [52, 80],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
    ],
  },
  {
    id: "gemini",
    glyph: "♊",
    name: "Gemini",
    nameKo: "쌍둥이자리",
    from: { m: 5, d: 21 },
    to: { m: 6, d: 20 },
    element: "air",
    planet: "Mercury",
    planetKo: "수성",
    traits: ["Curious", "Witty", "Adaptable"],
    traitsKo: ["호기심", "재치", "융통성"],
    stars: [
      [32, 18],
      [30, 45],
      [28, 72],
      [62, 20],
      [60, 47],
      [58, 74],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 4],
      [4, 5],
      [0, 3],
      [2, 5],
    ],
  },
  {
    id: "cancer",
    glyph: "♋",
    name: "Cancer",
    nameKo: "게자리",
    from: { m: 6, d: 21 },
    to: { m: 7, d: 22 },
    element: "water",
    planet: "Moon",
    planetKo: "달",
    traits: ["Caring", "Intuitive", "Loyal"],
    traitsKo: ["따뜻함", "직관력", "헌신"],
    stars: [
      [50, 18],
      [50, 46],
      [30, 70],
      [70, 68],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
  {
    id: "leo",
    glyph: "♌",
    name: "Leo",
    nameKo: "사자자리",
    from: { m: 7, d: 23 },
    to: { m: 8, d: 22 },
    element: "fire",
    planet: "Sun",
    planetKo: "태양",
    traits: ["Confident", "Warm", "Regal"],
    traitsKo: ["자신감", "관대함", "카리스마"],
    stars: [
      [22, 66],
      [34, 50],
      [50, 42],
      [64, 50],
      [74, 68],
      [88, 72],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
  {
    id: "virgo",
    glyph: "♍",
    name: "Virgo",
    nameKo: "처녀자리",
    from: { m: 8, d: 23 },
    to: { m: 9, d: 22 },
    element: "earth",
    planet: "Mercury",
    planetKo: "수성",
    traits: ["Precise", "Kind", "Analytical"],
    traitsKo: ["섬세함", "성실함", "분석력"],
    stars: [
      [18, 38],
      [37, 46],
      [55, 44],
      [70, 54],
      [82, 72],
      [50, 68],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
    ],
  },
  {
    id: "libra",
    glyph: "♎",
    name: "Libra",
    nameKo: "천칭자리",
    from: { m: 9, d: 23 },
    to: { m: 10, d: 22 },
    element: "air",
    planet: "Venus",
    planetKo: "금성",
    traits: ["Fair", "Charming", "Balanced"],
    traitsKo: ["공정함", "매력", "균형감"],
    stars: [
      [50, 24],
      [30, 52],
      [70, 52],
      [22, 72],
      [78, 72],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
    ],
  },
  {
    id: "scorpio",
    glyph: "♏",
    name: "Scorpio",
    nameKo: "전갈자리",
    from: { m: 10, d: 23 },
    to: { m: 11, d: 21 },
    element: "water",
    planet: "Pluto",
    planetKo: "명왕성",
    traits: ["Intense", "Loyal", "Magnetic"],
    traitsKo: ["강렬함", "집중력", "매혹적"],
    stars: [
      [18, 34],
      [30, 44],
      [43, 51],
      [56, 55],
      [69, 60],
      [80, 72],
      [72, 84],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "sagittarius",
    glyph: "♐",
    name: "Sagittarius",
    nameKo: "궁수자리",
    from: { m: 11, d: 22 },
    to: { m: 12, d: 21 },
    element: "fire",
    planet: "Jupiter",
    planetKo: "목성",
    traits: ["Free", "Optimistic", "Bold"],
    traitsKo: ["자유로움", "낙천적", "모험심"],
    stars: [
      [22, 42],
      [42, 54],
      [58, 50],
      [74, 42],
      [56, 70],
      [76, 74],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [4, 5],
    ],
  },
  {
    id: "capricorn",
    glyph: "♑",
    name: "Capricorn",
    nameKo: "염소자리",
    from: { m: 12, d: 22 },
    to: { m: 1, d: 19 },
    element: "earth",
    planet: "Saturn",
    planetKo: "토성",
    traits: ["Disciplined", "Ambitious", "Wise"],
    traitsKo: ["절제력", "야망", "지혜"],
    stars: [
      [22, 44],
      [45, 34],
      [68, 46],
      [80, 66],
      [50, 74],
      [30, 62],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
  {
    id: "aquarius",
    glyph: "♒",
    name: "Aquarius",
    nameKo: "물병자리",
    from: { m: 1, d: 20 },
    to: { m: 2, d: 18 },
    element: "air",
    planet: "Uranus",
    planetKo: "천왕성",
    traits: ["Original", "Visionary", "Free"],
    traitsKo: ["독창적", "혁신적", "자유로움"],
    stars: [
      [18, 44],
      [34, 56],
      [50, 44],
      [66, 56],
      [82, 44],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "pisces",
    glyph: "♓",
    name: "Pisces",
    nameKo: "물고기자리",
    from: { m: 2, d: 19 },
    to: { m: 3, d: 20 },
    element: "water",
    planet: "Neptune",
    planetKo: "해왕성",
    traits: ["Dreamy", "Gentle", "Creative"],
    traitsKo: ["몽환적", "다정함", "창의력"],
    stars: [
      [22, 30],
      [40, 48],
      [55, 64],
      [72, 48],
      [86, 30],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
];

const SIGN_BY_ID = new Map(SIGNS.map((s) => [s.id, s]));

/** Parse a "MM-DD" (or "M-D") birthday string into month/day, or null. */
function parseBirthday(input: string): { m: number; d: number } | null {
  const match = input.trim().match(/^(\d{1,2})[-/.](\d{1,2})$/);
  if (!match) return null;
  const m = Number(match[1]);
  const d = Number(match[2]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { m, d };
}

/** Resolve the zodiac sign for a given month/day. */
function signForDate(m: number, d: number): ZodiacSign {
  for (const sign of SIGNS) {
    const { from, to } = sign;
    // Capricorn wraps across the year boundary (Dec 22 → Jan 19)
    if (from.m > to.m) {
      if (
        (m === from.m && d >= from.d) ||
        (m === to.m && d <= to.d) ||
        m > from.m ||
        m < to.m
      ) {
        return sign;
      }
    } else if (
      (m === from.m && d >= from.d) ||
      (m === to.m && d <= to.d) ||
      (m > from.m && m < to.m)
    ) {
      return sign;
    }
  }
  return SIGNS[0];
}

/**
 * Resolve a sign from a birthday string ("MM-DD") or a direct sign id.
 * Falls back to Aries when the input can't be understood.
 */
export function resolveSign(input: string): ZodiacSign {
  const byId = SIGN_BY_ID.get(input.trim().toLowerCase());
  if (byId) return byId;
  const parsed = parseBirthday(input);
  if (parsed) return signForDate(parsed.m, parsed.d);
  return SIGNS[0];
}

const MONTHS_KO = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];
const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Human-readable date range for a sign, localized. */
export function formatDateRange(sign: ZodiacSign, locale: string): string {
  const isKo = locale.startsWith("ko");
  if (isKo) {
    return `${MONTHS_KO[sign.from.m - 1]} ${sign.from.d}일 – ${MONTHS_KO[sign.to.m - 1]} ${sign.to.d}일`;
  }
  return `${MONTHS_EN[sign.from.m - 1]} ${sign.from.d} – ${MONTHS_EN[sign.to.m - 1]} ${sign.to.d}`;
}
