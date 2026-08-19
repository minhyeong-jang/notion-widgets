import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { StreakWidget } from "./widget";
import { streakSchema, streakDefaults } from "./schema";

export { StreakWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "flame",
    options: [
      { value: "flame", label: "Flame", labelKo: "불꽃" },
      { value: "chain", label: "Chain", labelKo: "체인" },
      { value: "minimal", label: "Number", labelKo: "숫자" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Streak",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "streak",
    name: "Streak Counter",
    description: "Don't break the chain — tap to check in and grow your streak",
  },
  paramsSchema: streakSchema,
  defaultParams: streakDefaults,
  component: StreakWidget,
  controls,
  nameKo: "스트릭 카운터",
  descriptionKo: "매일 체크인하며 연속 기록을 쌓는 위젯 — 기기에 자동 저장",
  category: "productivity",
  recommendedSize: { width: 300, height: 360 },
});
