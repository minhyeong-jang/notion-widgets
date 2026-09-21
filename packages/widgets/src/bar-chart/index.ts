import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { BarChartWidget } from "./widget";
import { barChartSchema, barChartDefaults } from "./schema";

export { BarChartWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Chart Type",
    labelKo: "차트 형태",
    type: "select",
    defaultValue: "bars",
    options: [
      { value: "bars", label: "Bars", labelKo: "막대" },
      { value: "rows", label: "Rows", labelKo: "가로 막대" },
      { value: "line", label: "Line", labelKo: "라인" },
    ],
    group: "appearance",
  },
  {
    key: "data",
    label: "Data (label~value, …)",
    labelKo: "데이터 (라벨~값, …)",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "max",
    label: "Max (0 = auto)",
    labelKo: "최댓값 (0 = 자동)",
    type: "text",
    defaultValue: "0",
    group: "content",
  },
  {
    key: "showValue",
    label: "Show Values",
    labelKo: "값 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "bar-chart",
    name: "Mini Chart",
    description: "Compact bar or line chart for tracking small stats",
  },
  paramsSchema: barChartSchema,
  defaultParams: barChartDefaults,
  component: BarChartWidget,
  controls,
  nameKo: "미니 차트",
  descriptionKo: "주간 통계나 간단한 수치를 막대·라인으로 보여주는 위젯",
  category: "productivity",
  recommendedSize: { width: 360, height: 260 },
});
