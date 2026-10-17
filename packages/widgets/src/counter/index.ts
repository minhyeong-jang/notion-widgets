import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { CounterWidget } from "./widget";
import { counterSchema, counterDefaults } from "./schema";

export { CounterWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "single",
    options: [
      { value: "single", label: "Single", labelKo: "단일" },
      { value: "multi", label: "Multiple", labelKo: "여러 개" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label (comma-separated for multiple)",
    labelKo: "라벨 (여러 개는 쉼표로 구분)",
    type: "text",
    defaultValue: "Count",
    group: "content",
  },
  {
    key: "step",
    label: "Step",
    labelKo: "증감 단위",
    type: "select",
    defaultValue: "1",
    options: [
      { value: "1", label: "1" },
      { value: "5", label: "5" },
      { value: "10", label: "10" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "counter",
    name: "Tap Counter",
    description: "A tap counter for anything — reps, cups, pages, head counts. Count up or down with one tap.",
  },
  paramsSchema: counterSchema,
  defaultParams: counterDefaults,
  component: CounterWidget,
  controls,
  nameKo: "탭 카운터",
  descriptionKo: "무엇이든 세는 탭 카운터 — 횟수, 잔 수, 페이지, 인원. 탭 한 번으로 올리고 내리세요.",
  category: "utility",
  recommendedSize: { width: 300, height: 260 },
});
