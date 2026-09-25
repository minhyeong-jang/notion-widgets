import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { ActivityRingsWidget } from "./widget";
import { activityRingsSchema, activityRingsDefaults } from "./schema";

export { ActivityRingsWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "rings",
    options: [
      { value: "rings", label: "Concentric", labelKo: "겹친 링" },
      { value: "row", label: "Row", labelKo: "가로 배열" },
    ],
    group: "appearance",
  },
  {
    key: "l1",
    label: "Ring 1 Label",
    labelKo: "링 1 라벨",
    type: "text",
    defaultValue: "Move",
    group: "content",
  },
  {
    key: "r1",
    label: "Ring 1 %",
    labelKo: "링 1 진행률",
    type: "text",
    defaultValue: "80",
    group: "content",
  },
  {
    key: "l2",
    label: "Ring 2 Label",
    labelKo: "링 2 라벨",
    type: "text",
    defaultValue: "Exercise",
    group: "content",
  },
  {
    key: "r2",
    label: "Ring 2 %",
    labelKo: "링 2 진행률",
    type: "text",
    defaultValue: "65",
    group: "content",
  },
  {
    key: "l3",
    label: "Ring 3 Label",
    labelKo: "링 3 라벨",
    type: "text",
    defaultValue: "Stand",
    group: "content",
  },
  {
    key: "r3",
    label: "Ring 3 %",
    labelKo: "링 3 진행률",
    type: "text",
    defaultValue: "45",
    group: "content",
  },
  {
    key: "showLegend",
    label: "Show Legend",
    labelKo: "범례 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "activity-rings",
    name: "Activity Rings",
    description: "Track three goals at a glance with concentric progress rings",
  },
  paramsSchema: activityRingsSchema,
  defaultParams: activityRingsDefaults,
  component: ActivityRingsWidget,
  controls,
  nameKo: "액티비티 링",
  descriptionKo: "세 가지 목표를 한눈에 보는 삼중 진행 링 (애플 워치 스타일)",
  category: "productivity",
  recommendedSize: { width: 400, height: 280 },
});
