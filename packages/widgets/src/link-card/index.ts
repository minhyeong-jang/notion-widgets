import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { LinkCardWidget } from "./widget";
import { linkCardSchema, linkCardDefaults } from "./schema";

export { LinkCardWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Card", labelKo: "카드" },
      { value: "button", label: "Button", labelKo: "버튼" },
      { value: "banner", label: "Banner", labelKo: "배너" },
    ],
    group: "appearance",
  },
  {
    key: "icon",
    label: "Icon (emoji)",
    labelKo: "아이콘 (이모지)",
    type: "text",
    defaultValue: "🔗",
    group: "content",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "My Link",
    group: "content",
  },
  {
    key: "subtitle",
    label: "Subtitle",
    labelKo: "부제목",
    type: "text",
    defaultValue: "Tap to open",
    group: "content",
  },
  {
    key: "url",
    label: "URL",
    labelKo: "링크 주소",
    type: "text",
    defaultValue: "https://www.notion.so",
    group: "content",
  },
  {
    key: "showDomain",
    label: "Show Domain",
    labelKo: "도메인 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "link-card",
    name: "Link Card",
    description: "A styled bookmark card for any link — pin your favorite resource in Notion",
  },
  paramsSchema: linkCardSchema,
  defaultParams: linkCardDefaults,
  component: LinkCardWidget,
  controls,
  nameKo: "링크 카드",
  descriptionKo: "원하는 링크를 감각적인 북마크 카드로 — 노션에 즐겨찾기를 고정하세요",
  category: "utility",
  recommendedSize: { width: 340, height: 200 },
});
