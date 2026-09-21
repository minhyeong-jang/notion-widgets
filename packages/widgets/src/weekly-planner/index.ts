import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { WeeklyPlannerWidget } from "./widget";
import { weeklyPlannerSchema, weeklyPlannerDefaults } from "./schema";

export { WeeklyPlannerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "list",
    options: [
      { value: "list", label: "List", labelKo: "리스트" },
      { value: "strip", label: "Strip", labelKo: "스트립" },
      { value: "stack", label: "Stack", labelKo: "스택" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "This Week",
    group: "content",
  },
  {
    key: "weekStart",
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
  {
    key: "mon",
    label: "Monday",
    labelKo: "월요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "tue",
    label: "Tuesday",
    labelKo: "화요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "wed",
    label: "Wednesday",
    labelKo: "수요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "thu",
    label: "Thursday",
    labelKo: "목요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "fri",
    label: "Friday",
    labelKo: "금요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "sat",
    label: "Saturday",
    labelKo: "토요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "sun",
    label: "Sunday",
    labelKo: "일요일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  localeControl,
  {
    key: "showDate",
    label: "Show Date Range",
    labelKo: "날짜 범위 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "weekly-planner",
    name: "Weekly Planner",
    description: "Plan your week at a glance — today auto-highlighted",
  },
  paramsSchema: weeklyPlannerSchema,
  defaultParams: weeklyPlannerDefaults,
  component: WeeklyPlannerWidget,
  controls,
  nameKo: "주간 플래너",
  descriptionKo: "이번 주 요일별 할 일을 한눈에 — 오늘 자동 강조",
  category: "productivity",
  recommendedSize: { width: 360, height: 440 },
});
