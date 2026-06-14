import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, colorThemeControl, styleControl } from "@nw/widget-core";
import { FlipClockWidget } from "./widget";
import { flipClockSchema, flipClockDefaults } from "./schema";

export { FlipCard } from "./flip-clock";
export { MinimalCard } from "./minimal-clock";
export { FlipClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal", labelKo: "미니멀" },
      { value: "flip", label: "Flip", labelKo: "플립" },
    ],
    group: "appearance",
  },
  colorThemeControl,
  {
    key: "format",
    label: "Time Format",
    labelKo: "시간 형식",
    type: "select",
    defaultValue: "12h",
    options: [
      { value: "12h", label: "12h", labelKo: "12시간" },
      { value: "24h", label: "24h", labelKo: "24시간" },
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
    name: "Clock",
    description: "A clean digital clock with multiple display styles",
  },
  paramsSchema: flipClockSchema,
  defaultParams: flipClockDefaults,
  component: FlipClockWidget,
  controls,
  nameKo: "시계",
  descriptionKo: "다양한 디스플레이 스타일의 디지털 시계",
  category: "time",
  recommendedSize: { width: 420, height: 200 },
});
