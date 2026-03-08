import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { StartupTipsWidget } from "./widget";
import { startupTipsSchema, startupTipsDefaults } from "./schema";

export { StartupTipsWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "color",
    label: "Accent Color",
    labelKo: "강조 색상",
    type: "color",
    defaultValue: "7fb686",
    group: "color",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "배경 색상",
    type: "color",
    defaultValue: "18181b",
    group: "color",
  },
  localeControl,
  {
    key: "category",
    label: "Category",
    labelKo: "카테고리",
    type: "select",
    defaultValue: "all",
    options: [
      { value: "all", label: "All" },
      { value: "startup", label: "Startup" },
      { value: "growth", label: "Growth" },
      { value: "mindset", label: "Mindset" },
    ],
    group: "content",
  },
  {
    key: "mode",
    label: "Mode",
    labelKo: "모드",
    type: "select",
    defaultValue: "daily",
    options: [
      { value: "daily", label: "Daily" },
      { value: "random", label: "Random" },
    ],
    group: "content",
  },
  {
    key: "fontSize",
    label: "Font Size",
    labelKo: "글자 크기",
    type: "select",
    defaultValue: "md",
    options: [
      { value: "sm", label: "Small" },
      { value: "md", label: "Medium" },
      { value: "lg", label: "Large" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "startup-tips",
    name: "Startup Principles",
    description: "Named principles with brief explanation and source",
  },
  paramsSchema: startupTipsSchema,
  defaultParams: startupTipsDefaults,
  component: StartupTipsWidget,
  controls,
  nameKo: "스타트업 원칙",
  descriptionKo: "간단한 설명과 출처가 있는 스타트업 원칙",
  category: "productivity",
  recommendedSize: { width: 400, height: 250 },
});
