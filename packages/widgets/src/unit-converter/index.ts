import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { UnitConverterWidget } from "./widget";
import { unitConverterSchema, unitConverterDefaults } from "./schema";

export { UnitConverterWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "stack",
    options: [
      { value: "stack", label: "Stacked", labelKo: "세로형" },
      { value: "compact", label: "Compact", labelKo: "한 줄" },
      { value: "focus", label: "Focus", labelKo: "결과 강조" },
    ],
    group: "appearance",
  },
  {
    key: "category",
    label: "Category",
    labelKo: "종류",
    type: "select",
    defaultValue: "length",
    options: [
      { value: "length", label: "Length", labelKo: "길이" },
      { value: "weight", label: "Weight", labelKo: "무게" },
      { value: "temperature", label: "Temperature", labelKo: "온도" },
      { value: "volume", label: "Volume", labelKo: "부피" },
    ],
    group: "content",
  },
  {
    key: "from",
    label: "From Unit",
    labelKo: "입력 단위",
    type: "text",
    defaultValue: "km",
    group: "content",
  },
  {
    key: "to",
    label: "To Unit",
    labelKo: "결과 단위",
    type: "text",
    defaultValue: "mi",
    group: "content",
  },
  {
    key: "value",
    label: "Value",
    labelKo: "값",
    type: "text",
    defaultValue: "1",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature and volume — tap a unit to change it.",
  },
  paramsSchema: unitConverterSchema,
  defaultParams: unitConverterDefaults,
  component: UnitConverterWidget,
  controls,
  nameKo: "단위 변환기",
  descriptionKo: "길이·무게·온도·부피 변환 — 단위를 탭해서 바로 바꾸기",
  category: "utility",
  recommendedSize: { width: 320, height: 300 },
});
