import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { PriorityMatrixWidget } from "./widget";
import { priorityMatrixSchema, priorityMatrixDefaults } from "./schema";

export { PriorityMatrixWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "quadrant",
    options: [
      { value: "quadrant", label: "Matrix", labelKo: "매트릭스" },
      { value: "list", label: "List", labelKo: "리스트" },
      { value: "focus", label: "Focus", labelKo: "포커스" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "Priorities",
    group: "content",
  },
  {
    key: "tasks",
    label: "Tasks (q1–q4|text, …)",
    labelKo: "할 일 (q1~q4|내용, …)",
    type: "text",
    defaultValue: priorityMatrixDefaults.tasks,
    group: "content",
  },
  localeControl,
  {
    key: "showAxis",
    label: "Show Axis Labels",
    labelKo: "축 레이블 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "priority-matrix",
    name: "Priority Matrix",
    description: "Eisenhower urgent/important matrix to sort what to do first",
  },
  paramsSchema: priorityMatrixSchema,
  defaultParams: priorityMatrixDefaults,
  component: PriorityMatrixWidget,
  controls,
  nameKo: "우선순위 매트릭스",
  descriptionKo: "긴급도·중요도로 할 일을 나눠 무엇부터 할지 정리하는 아이젠하워 매트릭스",
  category: "productivity",
  recommendedSize: { width: 440, height: 380 },
});
