import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
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
    key: "current",
    label: "Current",
    labelKo: "현재값",
    type: "text",
    defaultValue: "7",
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
    description: "Track any numeric goal with a circular progress ring",
  },
  paramsSchema: goalRingSchema,
  defaultParams: goalRingDefaults,
  component: GoalRingWidget,
  controls,
  nameKo: "목표 링",
  descriptionKo: "원형 진행 링으로 모든 숫자 목표를 추적",
  category: "productivity",
  recommendedSize: { width: 300, height: 300 },
});
