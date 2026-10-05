import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  localeControl,
  styleControl,
  colorThemeControl,
} from "@nw/widget-core";
import { ScheduleWidget } from "./widget";
import { scheduleSchema, scheduleDefaults } from "./schema";

export { ScheduleWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  localeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "timeline",
    options: [
      { value: "timeline", label: "Timeline", labelKo: "타임라인" },
      { value: "list", label: "List", labelKo: "목록" },
      { value: "cards", label: "Cards", labelKo: "카드" },
    ],
    group: "appearance",
  },
  {
    key: "events",
    label: "Events (label~HH:MM~HH:MM, comma-separated)",
    labelKo: "일정 (이름~시작~종료, 쉼표로 구분)",
    type: "text",
    defaultValue: scheduleDefaults.events,
    group: "content",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "Today",
    group: "content",
  },
  {
    key: "showTitle",
    label: "Show Title",
    labelKo: "제목 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
  {
    key: "showNow",
    label: "Show Current Time",
    labelKo: "현재 시각 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "schedule",
    name: "Daily Schedule",
    description: "Today's time-blocked plan with a live current-event highlight",
  },
  paramsSchema: scheduleSchema,
  defaultParams: scheduleDefaults,
  component: ScheduleWidget,
  controls,
  nameKo: "하루 일정",
  descriptionKo: "오늘의 시간표를 타임라인으로 — 지금 진행 중인 일정을 자동 강조",
  category: "productivity",
  recommendedSize: { width: 360, height: 420 },
});
