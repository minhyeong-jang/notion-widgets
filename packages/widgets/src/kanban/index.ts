import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { KanbanWidget } from "./widget";
import { kanbanSchema, kanbanDefaults } from "./schema";

export { KanbanWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "board",
    options: [
      { value: "board", label: "Board", labelKo: "보드" },
      { value: "stack", label: "Stack", labelKo: "스택" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Board title (optional)",
    labelKo: "보드 제목 (선택)",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "col1Title",
    label: "Column 1 title",
    labelKo: "1열 제목",
    type: "text",
    defaultValue: "To Do",
    group: "content",
  },
  {
    key: "col1",
    label: "Column 1 cards (separate with |)",
    labelKo: "1열 카드 (| 로 구분)",
    type: "text",
    defaultValue: "Design landing page|Write copy|Pick palette",
    group: "content",
  },
  {
    key: "col2Title",
    label: "Column 2 title",
    labelKo: "2열 제목",
    type: "text",
    defaultValue: "In Progress",
    group: "content",
  },
  {
    key: "col2",
    label: "Column 2 cards (separate with |)",
    labelKo: "2열 카드 (| 로 구분)",
    type: "text",
    defaultValue: "Build widget API|User testing",
    group: "content",
  },
  {
    key: "col3Title",
    label: "Column 3 title",
    labelKo: "3열 제목",
    type: "text",
    defaultValue: "Done",
    group: "content",
  },
  {
    key: "col3",
    label: "Column 3 cards (separate with |)",
    labelKo: "3열 카드 (| 로 구분)",
    type: "text",
    defaultValue: "Project kickoff|Set up repo",
    group: "content",
  },
  localeControl,
  {
    key: "showCount",
    label: "Show card count",
    labelKo: "카드 개수 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "kanban",
    name: "Kanban Board",
    description: "A tidy status board with columns — plan a project right on your page",
  },
  paramsSchema: kanbanSchema,
  defaultParams: kanbanDefaults,
  component: KanbanWidget,
  controls,
  nameKo: "칸반 보드",
  descriptionKo: "열로 정리하는 상태 보드 — 페이지에서 바로 프로젝트를 계획하세요",
  category: "productivity",
  recommendedSize: { width: 460, height: 300 },
});
