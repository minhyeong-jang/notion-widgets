import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { MiniCalendarWidget } from "./widget";
import { miniCalendarSchema, miniCalendarDefaults } from "./schema";

export { MiniCalendarWidget } from "./widget";

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
      { value: "minimal", label: "Minimal", labelKo: "미니멀" },
      { value: "card", label: "Card", labelKo: "카드" },
    ],
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
