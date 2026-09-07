import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { ReadingWidget } from "./widget";
import { readingSchema, readingDefaults } from "./schema";

export { ReadingWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "bar",
    options: [
      { value: "bar", label: "Bar", labelKo: "바" },
      { value: "book", label: "Book", labelKo: "북" },
      { value: "cover", label: "Cover", labelKo: "커버" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Book Title",
    labelKo: "책 제목",
    type: "text",
    defaultValue: "Atomic Habits",
    group: "content",
  },
  {
    key: "author",
    label: "Author",
    labelKo: "저자",
    type: "text",
    defaultValue: "James Clear",
    group: "content",
  },
  {
    key: "current",
    label: "Current Page",
    labelKo: "현재 페이지",
    type: "text",
    defaultValue: "168",
    group: "content",
  },
  {
    key: "total",
    label: "Total Pages",
    labelKo: "전체 페이지",
    type: "text",
    defaultValue: "320",
    group: "content",
  },
  {
    key: "showRemaining",
    label: "Show Remaining",
    labelKo: "남은 페이지 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "reading",
    name: "Reading Tracker",
    description: "Track your current book's reading progress",
  },
  paramsSchema: readingSchema,
  defaultParams: readingDefaults,
  component: ReadingWidget,
  controls,
  nameKo: "독서 트래커",
  descriptionKo: "지금 읽는 책의 페이지 진행률을 보여주는 위젯",
  category: "lifestyle",
  recommendedSize: { width: 380, height: 300 },
});
