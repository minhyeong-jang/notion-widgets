import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { ChineseZodiacWidget } from "./widget";
import { chineseZodiacSchema, chineseZodiacDefaults } from "./schema";

export { ChineseZodiacWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Card", labelKo: "카드" },
      { value: "animal", label: "Animal", labelKo: "동물" },
      { value: "wheel", label: "Cycle Wheel", labelKo: "십이지 휠" },
    ],
    group: "appearance",
  },
  {
    key: "sign",
    label: "Animal",
    labelKo: "띠",
    type: "select",
    defaultValue: "auto",
    options: [
      { value: "auto", label: "Auto (from year)", labelKo: "자동 (출생연도)" },
      { value: "rat", label: "Rat 子", labelKo: "쥐띠 子" },
      { value: "ox", label: "Ox 丑", labelKo: "소띠 丑" },
      { value: "tiger", label: "Tiger 寅", labelKo: "호랑이띠 寅" },
      { value: "rabbit", label: "Rabbit 卯", labelKo: "토끼띠 卯" },
      { value: "dragon", label: "Dragon 辰", labelKo: "용띠 辰" },
      { value: "snake", label: "Snake 巳", labelKo: "뱀띠 巳" },
      { value: "horse", label: "Horse 午", labelKo: "말띠 午" },
      { value: "goat", label: "Goat 未", labelKo: "양띠 未" },
      { value: "monkey", label: "Monkey 申", labelKo: "원숭이띠 申" },
      { value: "rooster", label: "Rooster 酉", labelKo: "닭띠 酉" },
      { value: "dog", label: "Dog 戌", labelKo: "개띠 戌" },
      { value: "pig", label: "Pig 亥", labelKo: "돼지띠 亥" },
    ],
    group: "content",
  },
  {
    key: "year",
    label: "Birth Year",
    labelKo: "출생연도",
    type: "text",
    defaultValue: "2000",
    group: "content",
  },
  {
    key: "showYear",
    label: "Show Year",
    labelKo: "연도 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showElement",
    label: "Show Element",
    labelKo: "오행 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showTraits",
    label: "Show Traits",
    labelKo: "성격 키워드 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "chinese-zodiac",
    name: "Chinese Zodiac",
    description: "Your Chinese zodiac animal (띠) from your birth year — with the 12-animal cycle and element",
  },
  paramsSchema: chineseZodiacSchema,
  defaultParams: chineseZodiacDefaults,
  component: ChineseZodiacWidget,
  controls,
  nameKo: "띠 (십이지)",
  descriptionKo: "태어난 해로 알아보는 나의 띠 — 십이지 동물, 오행, 음양까지 한눈에",
  category: "lifestyle",
  recommendedSize: { width: 360, height: 420 },
});
