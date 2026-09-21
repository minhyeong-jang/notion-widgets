import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { TypingTestWidget } from "./widget";
import { typingTestSchema, typingTestDefaults } from "./schema";

export { TypingTestWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Mode",
    labelKo: "모드",
    type: "select",
    defaultValue: "words",
    options: [
      { value: "words", label: "Words", labelKo: "단어" },
      { value: "quote", label: "Quote", labelKo: "문장" },
      { value: "zen", label: "Zen", labelKo: "젠" },
    ],
    group: "appearance",
  },
  {
    key: "length",
    label: "Length",
    labelKo: "길이",
    type: "select",
    defaultValue: "medium",
    options: [
      { value: "short", label: "Short (15)", labelKo: "짧게 (15)" },
      { value: "medium", label: "Medium (25)", labelKo: "보통 (25)" },
      { value: "long", label: "Long (40)", labelKo: "길게 (40)" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showLive",
    label: "Live WPM",
    labelKo: "실시간 속도",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "typing-test",
    name: "Typing Speed Test",
    description: "Measure your typing speed — words or a quote, WPM and accuracy",
  },
  paramsSchema: typingTestSchema,
  defaultParams: typingTestDefaults,
  component: TypingTestWidget,
  controls,
  nameKo: "타자 속도 테스트",
  descriptionKo: "타자 속도를 측정 — 단어 또는 문장, WPM과 정확도 표시",
  category: "utility",
  recommendedSize: { width: 360, height: 300 },
});
