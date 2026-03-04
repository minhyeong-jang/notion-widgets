import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, themeControl, localeControl } from "@nw/widget-core";
import { MiniCalendarWidget } from "./widget";
import { miniCalendarSchema, miniCalendarDefaults } from "./schema";

export { MiniCalendarWidget } from "./widget";

const controls: ControlDefinition[] = [
  themeControl,
  {
    key: "style",
    label: "Style",
    labelKo: "스타일",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "card", label: "Card" },
    ],
    group: "appearance",
  },
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
  localeControl,
  {
    key: "firstDay",
    label: "First Day of Week",
    labelKo: "주 시작일",
    type: "select",
    defaultValue: "sun",
    options: [
      { value: "sun", label: "Sunday" },
      { value: "mon", label: "Monday" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "mini-calendar",
    name: "Mini Calendar",
    description: "Monthly calendar grid with today highlighted",
  },
  paramsSchema: miniCalendarSchema,
  defaultParams: miniCalendarDefaults,
  component: MiniCalendarWidget,
  controls,
  nameKo: "미니 캘린더",
  descriptionKo: "오늘 날짜가 강조된 월간 캘린더",
  category: "time",
  recommendedSize: { width: 300, height: 300 },
});
