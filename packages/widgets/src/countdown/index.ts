import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget } from "@nw/widget-core";
import { CountdownWidget } from "./widget";
import { countdownSchema, countdownDefaults } from "./schema";

export { CountdownWidget } from "./widget";

const controls: ControlDefinition[] = [
  {
    key: "color",
    label: "Accent Color",
    labelKo: "강조 색상",
    type: "color",
    defaultValue: "7fb686",
    group: "appearance",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "배경 색상",
    type: "color",
    defaultValue: "18181b",
    group: "appearance",
  },
  {
    key: "targetDate",
    label: "Target Date",
    labelKo: "목표 날짜",
    type: "date",
    defaultValue: "2026-12-31",
    group: "content",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "D-Day",
    group: "content",
  },
  {
    key: "showHours",
    label: "Show Hours",
    labelKo: "시간 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "countdown",
    name: "D-Day Countdown",
    description: "Count down to your target date",
  },
  paramsSchema: countdownSchema,
  defaultParams: countdownDefaults,
  component: CountdownWidget,
  controls,
  nameKo: "D-Day 카운트다운",
  descriptionKo: "목표 날짜까지 남은 일수를 표시합니다",
  category: "time",
  recommendedSize: { width: 350, height: 200 },
});
