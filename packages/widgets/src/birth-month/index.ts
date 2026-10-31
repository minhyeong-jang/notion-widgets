import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { BirthMonthWidget } from "./widget";
import { birthMonthSchema, birthMonthDefaults } from "./schema";

export { BirthMonthWidget } from "./widget";

const MONTH_OPTIONS = [
  { value: "1", label: "January", labelKo: "1월" },
  { value: "2", label: "February", labelKo: "2월" },
  { value: "3", label: "March", labelKo: "3월" },
  { value: "4", label: "April", labelKo: "4월" },
  { value: "5", label: "May", labelKo: "5월" },
  { value: "6", label: "June", labelKo: "6월" },
  { value: "7", label: "July", labelKo: "7월" },
  { value: "8", label: "August", labelKo: "8월" },
  { value: "9", label: "September", labelKo: "9월" },
  { value: "10", label: "October", labelKo: "10월" },
  { value: "11", label: "November", labelKo: "11월" },
  { value: "12", label: "December", labelKo: "12월" },
];

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "month",
    label: "Birth Month",
    labelKo: "태어난 달",
    type: "select",
    defaultValue: "1",
    options: MONTH_OPTIONS,
    group: "content",
  },
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Both", labelKo: "함께 보기" },
      { value: "gem", label: "Birthstone", labelKo: "탄생석" },
      { value: "flower", label: "Birth Flower", labelKo: "탄생화" },
    ],
    group: "appearance",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "birth-month",
    name: "Birthstone & Flower",
    description: "Your birth month's gemstone and flower with their meanings",
  },
  paramsSchema: birthMonthSchema,
  defaultParams: birthMonthDefaults,
  component: BirthMonthWidget,
  controls,
  nameKo: "탄생석 · 탄생화",
  descriptionKo: "태어난 달의 탄생석과 탄생화를 의미와 함께 보여주는 위젯",
  category: "lifestyle",
  recommendedSize: { width: 340, height: 300 },
});
