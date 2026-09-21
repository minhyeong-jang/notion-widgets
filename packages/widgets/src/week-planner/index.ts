import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { WeekPlannerWidget } from "./widget";
import { weekPlannerSchema, weekPlannerDefaults } from "./schema";

export { WeekPlannerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "strip",
    options: [
      { value: "strip", label: "Strip", labelKo: "스트립" },
      { value: "list", label: "Agenda", labelKo: "아젠다" },
      { value: "cards", label: "Cards", labelKo: "카드" },
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
    key: "tasks",
    label: "Tasks (Mon:Text|Wed:Text …)",
    labelKo: "할 일 (Mon:내용|Wed:내용 …)",
    type: "text",
    defaultValue: weekPlannerDefaults.tasks,
    group: "content",
  },
  {
    key: "weekStart",
    label: "Week starts",
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
    key: "showTitle",
    label: "Show Title",
    labelKo: "제목 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "week-planner",
    name: "Weekly Planner",
    description: "See your week at a glance with today highlighted and a task per day",
  },
  paramsSchema: weekPlannerSchema,
  defaultParams: weekPlannerDefaults,
  component: WeekPlannerWidget,
  controls,
  nameKo: "주간 플래너",
  descriptionKo: "이번 주를 한눈에 — 오늘 강조 표시와 요일별 할 일까지",
  category: "productivity",
  recommendedSize: { width: 380, height: 240 },
});
