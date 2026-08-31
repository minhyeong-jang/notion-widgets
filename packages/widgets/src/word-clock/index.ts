import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { WordClockWidget } from "./widget";
import { wordClockSchema, wordClockDefaults } from "./schema";

export { WordClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "grid",
    options: [
      { value: "grid", label: "Letter Grid", labelKo: "글자 격자" },
      { value: "phrase", label: "Phrase", labelKo: "문구" },
      { value: "line", label: "One Line", labelKo: "한 줄" },
    ],
    group: "appearance",
  },
  {
    key: "showDots",
    label: "Corner Minute Dots",
    labelKo: "모서리 분 표시",
    type: "toggle",
    defaultValue: "true",
    group: "appearance",
  },
];

registerWidget({
  meta: {
    id: "word-clock",
    name: "Word Clock",
    description: "Tells the time in words, QLOCKTWO-style",
  },
  paramsSchema: wordClockSchema,
  defaultParams: wordClockDefaults,
  component: WordClockWidget,
  controls,
  nameKo: "문장 시계",
  descriptionKo: "시간을 글자로 알려주는 감성 시계 (QLOCKTWO 스타일)",
  category: "time",
  recommendedSize: { width: 320, height: 320 },
});
