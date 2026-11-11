import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { WordOfDayWidget } from "./widget";
import { wordOfDaySchema, wordOfDayDefaults } from "./schema";

export { WordOfDayWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "dictionary",
    options: [
      { value: "dictionary", label: "Dictionary", labelKo: "사전형" },
      { value: "simple", label: "Simple", labelKo: "심플" },
      { value: "poster", label: "Poster", labelKo: "포스터" },
    ],
    group: "appearance",
  },
  localeControl,
  {
    key: "rotation",
    label: "Rotation",
    labelKo: "교체 방식",
    type: "select",
    defaultValue: "daily",
    options: [
      { value: "daily", label: "Daily", labelKo: "매일" },
      { value: "random", label: "Random", labelKo: "랜덤" },
    ],
    group: "content",
  },
  {
    key: "showPhonetic",
    label: "Show pronunciation",
    labelKo: "발음 기호 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showMeaning",
    label: "Show meaning",
    labelKo: "뜻 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showExample",
    label: "Show example",
    labelKo: "예문 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "word-of-day",
    name: "Word of the Day",
    description: "English vocabulary with pronunciation and meaning, refreshed daily",
  },
  paramsSchema: wordOfDaySchema,
  defaultParams: wordOfDayDefaults,
  component: WordOfDayWidget,
  controls,
  nameKo: "오늘의 영단어",
  descriptionKo: "매일 바뀌는 영어 단어 — 발음 기호와 뜻, 예문까지",
  category: "lifestyle",
  recommendedSize: { width: 420, height: 260 },
});
