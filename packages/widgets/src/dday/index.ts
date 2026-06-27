import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { DdayWidget } from "./widget";
import { ddaySchema, ddayDefaults } from "./schema";

export { DdayWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "list",
    options: [
      { value: "list", label: "List", labelKo: "리스트" },
      { value: "cards", label: "Cards", labelKo: "카드" },
      { value: "featured", label: "Featured", labelKo: "대표" },
    ],
    group: "appearance",
  },
  {
    key: "events",
    label: "Events (name~YYYY-MM-DD, …)",
    labelKo: "이벤트 (이름~YYYY-MM-DD, …)",
    type: "text",
    defaultValue: ddayDefaults.events,
    group: "content",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "D-Day",
    group: "content",
  },
  {
    key: "sort",
    label: "Sort",
    labelKo: "정렬",
    type: "select",
    defaultValue: "soon",
    options: [
      { value: "soon", label: "Nearest first", labelKo: "가까운 순" },
      { value: "date", label: "By date", labelKo: "날짜 순" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showDate",
    label: "Show Date",
    labelKo: "날짜 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "dday",
    name: "D-Day Board",
    description: "Track multiple D-day events in one widget",
  },
  paramsSchema: ddaySchema,
  defaultParams: ddayDefaults,
  component: DdayWidget,
  controls,
  nameKo: "디데이 보드",
  descriptionKo: "여러 기념일·이벤트의 남은 날짜를 한 위젯에서 확인하세요",
  category: "time",
  recommendedSize: { width: 360, height: 320 },
});
