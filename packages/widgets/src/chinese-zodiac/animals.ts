/**
 * Chinese zodiac (십이지, 띠) — fully self-contained (no backend / API).
 * The animal is derived from the birth YEAR (12-year cycle of Earthly
 * Branches 地支), and the element from the 10-year Heavenly-Stem cycle (天干).
 * This is deliberately distinct from Western sun-sign astrology.
 *
 * Note: the Chinese/lunar new year falls in late Jan – mid Feb, so people
 * born in Jan/early-Feb may belong to the previous year's animal. We key off
 * the Gregorian year for a simple, predictable widget and surface that caveat
 * in the UI copy where relevant.
 */

export type ElementId = "wood" | "fire" | "earth" | "metal" | "water";

export interface ChineseElement {
  id: ElementId;
  en: string;
  ko: string;
  hanja: string;
}

export const ELEMENTS: Record<ElementId, ChineseElement> = {
  wood: { id: "wood", en: "Wood", ko: "목", hanja: "木" },
  fire: { id: "fire", en: "Fire", ko: "화", hanja: "火" },
  earth: { id: "earth", en: "Earth", ko: "토", hanja: "土" },
  metal: { id: "metal", en: "Metal", ko: "금", hanja: "金" },
  water: { id: "water", en: "Water", ko: "수", hanja: "水" },
};

export interface ZodiacAnimal {
  id: string;
  name: string;
  nameKo: string;
  /** Earthly Branch hanja used as the emblem glyph (renders as plain text) */
  branch: string;
  traits: string[];
  traitsKo: string[];
}

/** Order follows the Earthly Branches starting at Rat (子). */
export const ANIMALS: ZodiacAnimal[] = [
  { id: "rat", name: "Rat", nameKo: "쥐", branch: "子", traits: ["Clever", "Quick", "Resourceful"], traitsKo: ["영리함", "민첩함", "재치"] },
  { id: "ox", name: "Ox", nameKo: "소", branch: "丑", traits: ["Steady", "Honest", "Diligent"], traitsKo: ["성실함", "정직함", "근면함"] },
  { id: "tiger", name: "Tiger", nameKo: "호랑이", branch: "寅", traits: ["Brave", "Confident", "Charismatic"], traitsKo: ["용맹함", "당당함", "카리스마"] },
  { id: "rabbit", name: "Rabbit", nameKo: "토끼", branch: "卯", traits: ["Gentle", "Elegant", "Kind"], traitsKo: ["온화함", "우아함", "다정함"] },
  { id: "dragon", name: "Dragon", nameKo: "용", branch: "辰", traits: ["Ambitious", "Lucky", "Bold"], traitsKo: ["야망", "행운", "대담함"] },
  { id: "snake", name: "Snake", nameKo: "뱀", branch: "巳", traits: ["Wise", "Intuitive", "Graceful"], traitsKo: ["지혜로움", "직관력", "우아함"] },
  { id: "horse", name: "Horse", nameKo: "말", branch: "午", traits: ["Energetic", "Free", "Warm"], traitsKo: ["활동적", "자유로움", "따뜻함"] },
  { id: "goat", name: "Goat", nameKo: "양", branch: "未", traits: ["Calm", "Creative", "Gentle"], traitsKo: ["차분함", "창의성", "온순함"] },
  { id: "monkey", name: "Monkey", nameKo: "원숭이", branch: "申", traits: ["Witty", "Curious", "Playful"], traitsKo: ["재치", "호기심", "장난기"] },
  { id: "rooster", name: "Rooster", nameKo: "닭", branch: "酉", traits: ["Sharp", "Honest", "Proud"], traitsKo: ["명민함", "솔직함", "자부심"] },
  { id: "dog", name: "Dog", nameKo: "개", branch: "戌", traits: ["Loyal", "Brave", "Sincere"], traitsKo: ["충실함", "용감함", "진실함"] },
  { id: "pig", name: "Pig", nameKo: "돼지", branch: "亥", traits: ["Generous", "Honest", "Easygoing"], traitsKo: ["너그러움", "정직함", "낙천적"] },
];

const ANIMAL_BY_ID: Record<string, ZodiacAnimal> = Object.fromEntries(
  ANIMALS.map((a) => [a.id, a]),
);

export function getAnimalById(id: string): ZodiacAnimal | undefined {
  return ANIMAL_BY_ID[id];
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** Animal index (0 = Rat) for a Gregorian year. 2020 → Rat. */
export function animalIndexForYear(year: number): number {
  return mod(year - 4, 12);
}

export function getAnimalForYear(year: number): ZodiacAnimal {
  return ANIMALS[animalIndexForYear(year)];
}

/** Element for a Gregorian year via the Heavenly-Stem cycle. 2000 → Metal. */
export function getElementForYear(year: number): ChineseElement {
  const stem = mod(year - 4, 10); // 0..9
  const order: ElementId[] = ["wood", "fire", "earth", "metal", "water"];
  return ELEMENTS[order[Math.floor(stem / 2)]];
}

/** Most recent year (<= `upto`) that shares the given animal. */
export function latestYearForAnimal(animalId: string, upto: number): number {
  const target = ANIMALS.findIndex((a) => a.id === animalId);
  if (target < 0) return upto;
  for (let y = upto; y > upto - 12; y--) {
    if (animalIndexForYear(y) === target) return y;
  }
  return upto;
}
