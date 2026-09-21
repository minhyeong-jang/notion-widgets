import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { BookTrackerWidget } from "./widget";
import { bookTrackerSchema, bookTrackerDefaults } from "./schema";

export { BookTrackerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "cover",
    options: [
      { value: "cover", label: "Cover", labelKo: "표지" },
      { value: "bar", label: "Bar", labelKo: "바" },
      { value: "spine", label: "Spine", labelKo: "책등" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Book Title",
    labelKo: "책 제목",
    type: "text",
    defaultValue: bookTrackerDefaults.title,
    group: "content",
  },
  {
    key: "author",
    label: "Author",
    labelKo: "저자",
    type: "text",
    defaultValue: bookTrackerDefaults.author,
    group: "content",
  },
  {
    key: "current",
    label: "Current Page",
    labelKo: "현재 쪽",
    type: "text",
    defaultValue: String(bookTrackerDefaults.current),
    group: "content",
  },
  {
    key: "total",
    label: "Total Pages",
    labelKo: "전체 쪽수",
    type: "text",
    defaultValue: String(bookTrackerDefaults.total),
    group: "content",
  },
  localeControl,
  {
    key: "showPages",
    label: "Show Pages",
    labelKo: "쪽수 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "book-tracker",
    name: "Reading Tracker",
    description: "Track your current book's reading progress",
  },
  paramsSchema: bookTrackerSchema,
  defaultParams: bookTrackerDefaults,
  component: BookTrackerWidget,
  controls,
  nameKo: "독서 트래커",
  descriptionKo: "지금 읽는 책의 진행률을 한눈에 보여주세요",
  category: "lifestyle",
  recommendedSize: { width: 400, height: 220 },
});
