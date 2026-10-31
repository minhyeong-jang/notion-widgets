export interface BirthMonth {
  /** 1-12 */
  month: number;
  monthName: string;
  monthNameKo: string;
  /** birthstone */
  stone: string;
  stoneKo: string;
  stoneMeaning: string;
  stoneMeaningKo: string;
  /** birth flower */
  flower: string;
  flowerKo: string;
  flowerMeaning: string;
  flowerMeaningKo: string;
  /** number of petals drawn for the flower illustration (stylistic variety) */
  petals: number;
}

export const BIRTH_MONTHS: BirthMonth[] = [
  {
    month: 1,
    monthName: "January",
    monthNameKo: "1월",
    stone: "Garnet",
    stoneKo: "가넷",
    stoneMeaning: "Protection & friendship",
    stoneMeaningKo: "보호와 우정",
    flower: "Carnation",
    flowerKo: "카네이션",
    flowerMeaning: "Fascination & love",
    flowerMeaningKo: "매혹과 사랑",
    petals: 8,
  },
  {
    month: 2,
    monthName: "February",
    monthNameKo: "2월",
    stone: "Amethyst",
    stoneKo: "자수정",
    stoneMeaning: "Calm & wisdom",
    stoneMeaningKo: "평온과 지혜",
    flower: "Violet",
    flowerKo: "제비꽃",
    flowerMeaning: "Modesty & faith",
    flowerMeaningKo: "겸손과 성실",
    petals: 5,
  },
  {
    month: 3,
    monthName: "March",
    monthNameKo: "3월",
    stone: "Aquamarine",
    stoneKo: "아쿠아마린",
    stoneMeaning: "Courage & luck",
    stoneMeaningKo: "용기와 행운",
    flower: "Daffodil",
    flowerKo: "수선화",
    flowerMeaning: "New beginnings",
    flowerMeaningKo: "새로운 시작",
    petals: 6,
  },
  {
    month: 4,
    monthName: "April",
    monthNameKo: "4월",
    stone: "Diamond",
    stoneKo: "다이아몬드",
    stoneMeaning: "Eternal love",
    stoneMeaningKo: "영원한 사랑",
    flower: "Daisy",
    flowerKo: "데이지",
    flowerMeaning: "Purity & hope",
    flowerMeaningKo: "순수와 희망",
    petals: 12,
  },
  {
    month: 5,
    monthName: "May",
    monthNameKo: "5월",
    stone: "Emerald",
    stoneKo: "에메랄드",
    stoneMeaning: "Rebirth & hope",
    stoneMeaningKo: "재생과 희망",
    flower: "Lily of the Valley",
    flowerKo: "은방울꽃",
    flowerMeaning: "Return of happiness",
    flowerMeaningKo: "행복의 귀환",
    petals: 6,
  },
  {
    month: 6,
    monthName: "June",
    monthNameKo: "6월",
    stone: "Pearl",
    stoneKo: "진주",
    stoneMeaning: "Purity & nobility",
    stoneMeaningKo: "순수와 고귀함",
    flower: "Rose",
    flowerKo: "장미",
    flowerMeaning: "Love & passion",
    flowerMeaningKo: "사랑과 열정",
    petals: 8,
  },
  {
    month: 7,
    monthName: "July",
    monthNameKo: "7월",
    stone: "Ruby",
    stoneKo: "루비",
    stoneMeaning: "Passion & vitality",
    stoneMeaningKo: "열정과 생명력",
    flower: "Larkspur",
    flowerKo: "라크스퍼",
    flowerMeaning: "Positivity & love",
    flowerMeaningKo: "긍정과 사랑",
    petals: 5,
  },
  {
    month: 8,
    monthName: "August",
    monthNameKo: "8월",
    stone: "Peridot",
    stoneKo: "페리도트",
    stoneMeaning: "Happiness & healing",
    stoneMeaningKo: "행복과 치유",
    flower: "Gladiolus",
    flowerKo: "글라디올러스",
    flowerMeaning: "Strength of character",
    flowerMeaningKo: "강인한 성품",
    petals: 6,
  },
  {
    month: 9,
    monthName: "September",
    monthNameKo: "9월",
    stone: "Sapphire",
    stoneKo: "사파이어",
    stoneMeaning: "Truth & wisdom",
    stoneMeaningKo: "진실과 지혜",
    flower: "Aster",
    flowerKo: "아스터",
    flowerMeaning: "Wisdom & faith",
    flowerMeaningKo: "지혜와 믿음",
    petals: 14,
  },
  {
    month: 10,
    monthName: "October",
    monthNameKo: "10월",
    stone: "Opal",
    stoneKo: "오팔",
    stoneMeaning: "Hope & creativity",
    stoneMeaningKo: "희망과 창의력",
    flower: "Marigold",
    flowerKo: "메리골드",
    flowerMeaning: "Warmth & affection",
    flowerMeaningKo: "따뜻한 애정",
    petals: 10,
  },
  {
    month: 11,
    monthName: "November",
    monthNameKo: "11월",
    stone: "Topaz",
    stoneKo: "토파즈",
    stoneMeaning: "Friendship & fidelity",
    stoneMeaningKo: "우정과 충실",
    flower: "Chrysanthemum",
    flowerKo: "국화",
    flowerMeaning: "Friendship & joy",
    flowerMeaningKo: "우정과 기쁨",
    petals: 16,
  },
  {
    month: 12,
    monthName: "December",
    monthNameKo: "12월",
    stone: "Turquoise",
    stoneKo: "터키석",
    stoneMeaning: "Success & protection",
    stoneMeaningKo: "성공과 보호",
    flower: "Narcissus",
    flowerKo: "수선화(겨울)",
    flowerMeaning: "Respect & hope",
    flowerMeaningKo: "존경과 희망",
    petals: 6,
  },
];

export const BIRTH_MONTH_MAP: Record<number, BirthMonth> = Object.fromEntries(
  BIRTH_MONTHS.map((m) => [m.month, m]),
);

export function getBirthMonth(month: number): BirthMonth {
  return BIRTH_MONTH_MAP[month] ?? BIRTH_MONTHS[0];
}
