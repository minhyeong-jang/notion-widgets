import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { YearProgressWidget } from "./widget";
import { yearProgressSchema, yearProgressDefaults } from "./schema";

export { YearProgressWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "grid",
    options: [
      { value: "grid", label: "Grid", labelKo: "그리드" },
      { value: "months", label: "Months", labelKo: "월별" },
      { value: "weeks", label: "Weeks", labelKo: "주별" },
    ],
    group: "appearance",
  },
  localeControl,
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "showPercent",
    label: "Show Percent",
    labelKo: "퍼센트 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
  {
    key: "showRemaining",
    label: "Show Days Left",
    labelKo: "남은 일수 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "year-progress",
    name: "Year Progress",
    description: "A dotted view of the year — days gone, today highlighted, and how much is left",
  },
  paramsSchema: yearProgressSchema,
  defaultParams: yearProgressDefaults,
  component: YearProgressWidget,
  controls,
  nameKo: "올해 진행률",
  descriptionKo: "점으로 보는 올해 — 지난 날, 오늘 강조, 남은 날까지 한눈에",
  category: "time",
  recommendedSize: { width: 420, height: 320 },
});
