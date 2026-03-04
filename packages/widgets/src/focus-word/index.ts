import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, themeControl } from "@nw/widget-core";
import { FocusWordWidget } from "./widget";
import { focusWordSchema, focusWordDefaults } from "./schema";

export { FocusWordWidget } from "./widget";

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
      { value: "gradient", label: "Gradient" },
      { value: "bold", label: "Bold" },
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
  {
    key: "word",
    label: "Custom Word",
    labelKo: "커스텀 단어",
    type: "text",
    defaultValue: "",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "focus-word",
    name: "Focus Word",
    description: "Large typography single word for daily motivation",
  },
  paramsSchema: focusWordSchema,
  defaultParams: focusWordDefaults,
  component: FocusWordWidget,
  controls,
  nameKo: "포커스 워드",
  descriptionKo: "하루 동기부여를 위한 대형 타이포그래피 단어",
  category: "productivity",
  recommendedSize: { width: 400, height: 200 },
});
