import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { WordOfTheDayWidget } from "./widget";
import { wordOfTheDaySchema, wordOfTheDayDefaults } from "./schema";

export { WordOfTheDayWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "detailed",
    options: [
      { value: "detailed", label: "Detailed", labelKo: "상세" },
      { value: "compact", label: "Compact", labelKo: "간단" },
    ],
    group: "appearance",
  },
  {
    key: "mode",
    label: "Mode",
    labelKo: "모드",
    type: "select",
    defaultValue: "daily",
    options: [
      { value: "daily", label: "Daily", labelKo: "매일" },
      { value: "random", label: "Random", labelKo: "랜덤" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "word-of-the-day",
    name: "Word of the Day",
    description: "A daily English vocabulary word with meaning and example",
  },
  paramsSchema: wordOfTheDaySchema,
  defaultParams: wordOfTheDayDefaults,
  component: WordOfTheDayWidget,
  controls,
  nameKo: "오늘의 단어",
  descriptionKo: "매일 바뀌는 영어 단어와 뜻·예문 (영어 학습용)",
  category: "lifestyle",
  recommendedSize: { width: 400, height: 260 },
});
