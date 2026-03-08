import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, styleControl, colorThemeControl } from "@nw/widget-core";
import { QuoteWidget } from "./widget";
import { quoteSchema, quoteDefaults } from "./schema";

export { QuoteWidget } from "./widget";

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
    id: "quote",
    name: "Daily Quote",
    description: "Inspirational quote that changes daily",
  },
  paramsSchema: quoteSchema,
  defaultParams: quoteDefaults,
  component: QuoteWidget,
  controls,
  nameKo: "오늘의 명언",
  descriptionKo: "매일 바뀌는 영감을 주는 명언",
  category: "lifestyle",
  recommendedSize: { width: 400, height: 200 },
});
