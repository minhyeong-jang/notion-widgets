import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { WeekProgressWidget } from "./widget";
import { weekProgressSchema, weekProgressDefaults } from "./schema";

export { WeekProgressWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "dots",
    options: [
      { value: "dots", label: "Dots", labelKo: "도트" },
      { value: "bars", label: "Bars", labelKo: "바" },
      { value: "row", label: "Row", labelKo: "행" },
    ],
    group: "appearance",
  },
  {
    key: "firstDay",
    label: "Week Starts",
    labelKo: "주 시작",
    type: "select",
    defaultValue: "mon",
    options: [
      { value: "mon", label: "Monday", labelKo: "월요일" },
      { value: "sun", label: "Sunday", labelKo: "일요일" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showProgress",
    label: "Show Progress",
    labelKo: "진행률 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
  {
    key: "showWeekNumber",
    label: "Show Week Number",
    labelKo: "주차 표시",
    type: "toggle",
    defaultValue: "false",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "week-progress",
    name: "This Week",
    description: "The current week at a glance — today highlighted, with elapsed-week progress",
  },
  paramsSchema: weekProgressSchema,
  defaultParams: weekProgressDefaults,
  component: WeekProgressWidget,
  controls,
  nameKo: "이번 주",
  descriptionKo: "이번 주 한눈에 보기 — 오늘 강조 표시, 주간 진행률 함께",
  category: "time",
  recommendedSize: { width: 380, height: 220 },
});
