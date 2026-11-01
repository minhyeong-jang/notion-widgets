import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { MetricWidget } from "./widget";
import { metricSchema, metricDefaults } from "./schema";

export { MetricWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "trend",
    options: [
      { value: "stat", label: "Stat", labelKo: "숫자" },
      { value: "trend", label: "Trend", labelKo: "추세" },
      { value: "compact", label: "Compact", labelKo: "컴팩트" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Monthly Revenue",
    group: "content",
  },
  {
    key: "value",
    label: "Value",
    labelKo: "값",
    type: "text",
    defaultValue: "12,480",
    group: "content",
  },
  {
    key: "prefix",
    label: "Prefix",
    labelKo: "접두사",
    type: "text",
    defaultValue: "$",
    group: "content",
  },
  {
    key: "suffix",
    label: "Suffix",
    labelKo: "접미사",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "caption",
    label: "Caption",
    labelKo: "설명",
    type: "text",
    defaultValue: "vs last month",
    group: "content",
  },
  {
    key: "previous",
    label: "Previous Value",
    labelKo: "이전 값",
    type: "text",
    defaultValue: "11,090",
    group: "content",
  },
  {
    key: "series",
    label: "Sparkline Data",
    labelKo: "스파크라인 데이터",
    type: "text",
    defaultValue: "8,9.2,8.6,10.1,11.4,11,12.48",
    group: "content",
  },
  {
    key: "invertTrend",
    label: "Lower is Better",
    labelKo: "낮을수록 좋음",
    type: "toggle",
    defaultValue: "false",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "metric",
    name: "Metric Card",
    description: "Headline KPI with trend delta and sparkline for dashboards",
  },
  paramsSchema: metricSchema,
  defaultParams: metricDefaults,
  component: MetricWidget,
  controls,
  nameKo: "지표 카드",
  descriptionKo: "추세 변화와 스파크라인을 보여주는 대시보드용 지표 카드",
  category: "productivity",
  recommendedSize: { width: 360, height: 300 },
});
