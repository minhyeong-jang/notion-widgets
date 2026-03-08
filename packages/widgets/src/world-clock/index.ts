import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { WorldClockWidget } from "./widget";
import { worldClockSchema, worldClockDefaults } from "./schema";

export { WorldClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "list", label: "List" },
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
    key: "timezones",
    label: "Timezones",
    labelKo: "시간대",
    type: "text",
    defaultValue: "America/New_York,Europe/London,Asia/Seoul,Asia/Tokyo",
    group: "content",
  },
  {
    key: "format",
    label: "Time Format",
    labelKo: "시간 형식",
    type: "select",
    defaultValue: "24h",
    options: [
      { value: "12h", label: "12h" },
      { value: "24h", label: "24h" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "world-clock",
    name: "World Clock",
    description: "Display multiple timezone clocks side by side",
  },
  paramsSchema: worldClockSchema,
  defaultParams: worldClockDefaults,
  component: WorldClockWidget,
  controls,
  nameKo: "세계 시계",
  descriptionKo: "여러 시간대의 시계를 나란히 표시합니다",
  category: "time",
  recommendedSize: { width: 400, height: 200 },
});
