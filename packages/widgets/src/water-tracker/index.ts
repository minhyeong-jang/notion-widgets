import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { WaterTrackerWidget } from "./widget";
import { waterTrackerSchema, waterTrackerDefaults } from "./schema";

export { WaterTrackerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "bottle",
    options: [
      { value: "bottle", label: "Bottle", labelKo: "물병" },
      { value: "glasses", label: "Glasses", labelKo: "컵" },
      { value: "droplets", label: "Droplets", labelKo: "물방울" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Water",
    group: "content",
  },
  {
    key: "goal",
    label: "Goal",
    labelKo: "목표량",
    type: "text",
    defaultValue: "8",
    group: "content",
  },
  {
    key: "unit",
    label: "Unit",
    labelKo: "단위",
    type: "text",
    defaultValue: "glasses",
    group: "content",
  },
  {
    key: "period",
    label: "Reset",
    labelKo: "초기화 주기",
    type: "select",
    defaultValue: "daily",
    options: [
      { value: "daily", label: "Daily", labelKo: "매일" },
      { value: "weekly", label: "Weekly", labelKo: "매주" },
      { value: "persist", label: "Never", labelKo: "안 함" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showPercent",
    label: "Show Percent",
    labelKo: "퍼센트 표시",
    type: "toggle",
    defaultValue: "false",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "water-tracker",
    name: "Water Tracker",
    description: "Track your daily water intake with a tap — saved on your device",
  },
  paramsSchema: waterTrackerSchema,
  defaultParams: waterTrackerDefaults,
  component: WaterTrackerWidget,
  controls,
  nameKo: "물 마시기 트래커",
  descriptionKo: "버튼 하나로 물 섭취량 기록 — 기기에 자동 저장, 매일/매주 자동 초기화",
  category: "lifestyle",
  recommendedSize: { width: 280, height: 360 },
});
