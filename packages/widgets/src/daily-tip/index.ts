import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, themeControl, localeControl } from "@nw/widget-core";
import { DailyTipWidget } from "./widget";
import { dailyTipSchema, dailyTipDefaults } from "./schema";

export { DailyTipWidget } from "./widget";

const controls: ControlDefinition[] = [
  themeControl,
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
  localeControl,
  {
    key: "category",
    label: "Category",
    labelKo: "카테고리",
    type: "select",
    defaultValue: "all",
    options: [
      { value: "all", label: "All" },
      { value: "productivity", label: "Productivity" },
      { value: "mindset", label: "Mindset" },
      { value: "tech", label: "Tech" },
      { value: "life", label: "Life" },
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
    id: "daily-tip",
    name: "Daily Tip",
    description: "Actionable daily tips with category tags",
  },
  paramsSchema: dailyTipSchema,
  defaultParams: dailyTipDefaults,
  component: DailyTipWidget,
  controls,
  nameKo: "오늘의 팁",
  descriptionKo: "카테고리 태그가 있는 실행 가능한 일일 팁",
  category: "productivity",
  recommendedSize: { width: 400, height: 200 },
});
