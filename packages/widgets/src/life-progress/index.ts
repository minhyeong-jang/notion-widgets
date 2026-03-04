import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, dateFormatControl, themeControl } from "@nw/widget-core";
import { LifeProgressWidget } from "./widget";
import { lifeProgressSchema, lifeProgressDefaults } from "./schema";

export { ProgressBar } from "./progress-bar";
export { LifeProgressWidget } from "./widget";

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
  dateFormatControl,
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "Life Progress",
    group: "content",
  },
  {
    key: "label",
    label: "Goal Label",
    labelKo: "목표 라벨",
    type: "text",
    defaultValue: "My Goal",
    group: "content",
  },
  {
    key: "target",
    label: "Target Date",
    labelKo: "목표 날짜",
    type: "date",
    defaultValue: "2026-12-31",
    group: "content",
  },
  {
    key: "start",
    label: "Start Date",
    labelKo: "시작 날짜",
    type: "date",
    defaultValue: "2026-01-01",
    group: "content",
  },
  {
    key: "showYear",
    label: "Show Year",
    labelKo: "연도 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showMonth",
    label: "Show Month",
    labelKo: "월 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showQuarter",
    label: "Show Quarter",
    labelKo: "분기 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showWeek",
    label: "Show Week",
    labelKo: "주 표시",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
  {
    key: "showDay",
    label: "Show Day",
    labelKo: "일 표시",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "life-progress",
    name: "Life Progress",
    description: "Progress bars for year, month, quarter, and custom target",
  },
  paramsSchema: lifeProgressSchema,
  defaultParams: lifeProgressDefaults,
  component: LifeProgressWidget,
  controls,
  nameKo: "라이프 프로그레스",
  descriptionKo: "연도, 월, 분기, 사용자 정의 목표의 진행 상황을 보여주는 위젯",
  category: "productivity",
  recommendedSize: { width: 380, height: 320 },
});
