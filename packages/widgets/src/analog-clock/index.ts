import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { AnalogClockWidget } from "./widget";
import { analogClockSchema, analogClockDefaults } from "./schema";

export { AnalogClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Clock Variant",
    labelKo: "시계 변형",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "classic", label: "Classic" },
      { value: "vintage", label: "Vintage" },
    ],
    group: "appearance",
  },
  {
    key: "color",
    label: "Accent Color",
    labelKo: "강조 색상",
    type: "color",
    defaultValue: "7fb686",
    group: "color",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "배경 색상",
    type: "color",
    defaultValue: "18181b",
    group: "color",
  },
  {
    key: "showNumbers",
    label: "Show Numbers",
    labelKo: "숫자 표시",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
  {
    key: "showSeconds",
    label: "Show Seconds",
    labelKo: "초침 표시",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "analog-clock",
    name: "Analog Clock",
    description: "Classic analog clock with customizable style",
  },
  paramsSchema: analogClockSchema,
  defaultParams: analogClockDefaults,
  component: AnalogClockWidget,
  controls,
  nameKo: "아날로그 시계",
  descriptionKo: "다양한 스타일의 클래식 아날로그 시계",
  category: "time",
  recommendedSize: { width: 300, height: 300 },
});
