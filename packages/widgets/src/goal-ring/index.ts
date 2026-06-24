import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { GoalRingWidget } from "./widget";
import { goalRingSchema, goalRingDefaults } from "./schema";

export { GoalRingWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "ring",
    options: [
      { value: "ring", label: "Ring", labelKo: "링" },
      { value: "gauge", label: "Gauge", labelKo: "게이지" },
      { value: "segments", label: "Segments", labelKo: "세그먼트" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Reading Goal",
    group: "content",
  },
  {
    key: "target",
    label: "Target",
    labelKo: "목표값",
    type: "text",
    defaultValue: "12",
    group: "content",
  },
  {
    key: "unit",
    label: "Unit",
    labelKo: "단위",
    type: "text",
    defaultValue: "books",
    group: "content",
  },
  {
    key: "step",
    label: "Step",
    labelKo: "증가 단위",
    type: "text",
    defaultValue: "1",
    group: "content",
  },
  {
    key: "period",
    label: "Reset",
    labelKo: "초기화 주기",
    type: "select",
    defaultValue: "persist",
    options: [
      { value: "persist", label: "Never", labelKo: "안 함" },
      { value: "daily", label: "Daily", labelKo: "매일" },
      { value: "weekly", label: "Weekly", labelKo: "매주" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showPercent",
    label: "Show Percent",
    labelKo: "퍼센트 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "goal-ring",
    name: "Goal Ring",
    description: "Track any numeric goal with a tap — progress saved on your device",
  },
  paramsSchema: goalRingSchema,
  defaultParams: goalRingDefaults,
  component: GoalRingWidget,
  controls,
  nameKo: "목표 링",
  descriptionKo: "버튼으로 숫자 목표 진행 기록 — 기기에 자동 저장",
  category: "productivity",
  recommendedSize: { width: 300, height: 360 },
});
