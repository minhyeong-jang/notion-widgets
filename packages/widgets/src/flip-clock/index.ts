import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl } from "@nw/widget-core";
import { FlipClockWidget } from "./widget";
import { flipClockSchema, flipClockDefaults } from "./schema";

export { FlipCard } from "./flip-clock";
export { MinimalCard } from "./minimal-clock";
export { FlipClockWidget } from "./widget";

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
    key: "style",
    label: "Style",
    labelKo: "스타일",
    type: "select",
    defaultValue: "flip",
    options: [
      { value: "flip", label: "Flip" },
      { value: "minimal", label: "Minimal" },
    ],
    group: "appearance",
  },
  {
    key: "format",
    label: "Time Format",
    labelKo: "시간 형식",
    type: "select",
    defaultValue: "12h",
    options: [
      { value: "12h", label: "12h" },
      { value: "24h", label: "24h" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showSeconds",
    label: "Show Seconds",
    labelKo: "초 표시",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
  {
    key: "showLabel",
    label: "Show Labels",
    labelKo: "라벨 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "flip-clock",
    name: "Flip Clock",
    description: "A retro flip-style clock showing hours and minutes",
  },
  paramsSchema: flipClockSchema,
  defaultParams: flipClockDefaults,
  component: FlipClockWidget,
  controls,
  nameKo: "플립 시계",
  descriptionKo: "레트로 감성의 플립 스타일 시계",
  category: "time",
  recommendedSize: { width: 420, height: 200 },
});
