import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { ChecklistWidget } from "./widget";
import { checklistSchema, checklistDefaults } from "./schema";

export { ChecklistWidget } from "./widget";

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
      { value: "card", label: "Card", labelKo: "카드" },
      { value: "circle", label: "Circle", labelKo: "원형" },
    ],
    group: "appearance",
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
    key: "items",
    label: "Items (separate with |)",
    labelKo: "항목 (| 로 구분)",
    type: "text",
    defaultValue: "Drink water|Read 20 min|Move your body|Plan tomorrow",
    group: "content",
  },
  {
    key: "period",
    label: "Reset",
    labelKo: "초기화 주기",
    type: "select",
    defaultValue: "daily",
    options: [
      { value: "daily", label: "Daily", labelKo: "매일" },
      { value: "weekly", label: "Weekly", labelKo: "매주" },
      { value: "persist", label: "Never", labelKo: "안 함" },
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
];

registerWidget({
  meta: {
    id: "checklist",
    name: "Checklist",
    description: "A tappable to-do list that resets daily — progress saved on your device",
  },
  paramsSchema: checklistSchema,
  defaultParams: checklistDefaults,
  component: ChecklistWidget,
  controls,
  nameKo: "체크리스트",
  descriptionKo: "탭으로 체크하는 할 일 목록 — 매일 자동 초기화, 기기에 저장",
  category: "productivity",
  recommendedSize: { width: 300, height: 340 },
});
