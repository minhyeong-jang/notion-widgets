import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { ProgressBarWidget } from "./widget";
import { progressBarSchema, progressBarDefaults } from "./schema";

export { ProgressBarWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "bar",
    options: [
      { value: "bar", label: "Bar", labelKo: "바" },
      { value: "segmented", label: "Segmented", labelKo: "세그먼트" },
      { value: "striped", label: "Striped", labelKo: "스트라이프" },
      { value: "steps", label: "Steps", labelKo: "스텝" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Project Progress",
    group: "content",
  },
  {
    key: "value",
    label: "Value",
    labelKo: "현재값",
    type: "text",
    defaultValue: "72",
    group: "content",
  },
  {
    key: "target",
    label: "Target",
    labelKo: "목표값",
    type: "text",
    defaultValue: "100",
    group: "content",
  },
  {
    key: "unit",
    label: "Unit",
    labelKo: "단위",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "size",
    label: "Size",
    labelKo: "크기",
    type: "select",
    defaultValue: "md",
    options: [
      { value: "sm", label: "Small", labelKo: "작게" },
      { value: "md", label: "Medium", labelKo: "보통" },
      { value: "lg", label: "Large", labelKo: "크게" },
    ],
    group: "appearance",
  },
  {
    key: "showPercent",
    label: "Show Percent",
    labelKo: "퍼센트 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "progress-bar",
    name: "Progress Bar",
    description: "Customizable progress bar for projects, goals, and OKRs",
  },
  paramsSchema: progressBarSchema,
  defaultParams: progressBarDefaults,
  component: ProgressBarWidget,
  controls,
  nameKo: "진행률 바",
  descriptionKo: "프로젝트·목표·OKR을 위한 커스텀 진행률 바",
  category: "productivity",
  recommendedSize: { width: 420, height: 160 },
});
