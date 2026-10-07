import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { CalculatorWidget } from "./widget";
import { calculatorSchema, calculatorDefaults } from "./schema";

export { CalculatorWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "basic",
    options: [
      { value: "basic", label: "Basic", labelKo: "기본" },
      { value: "scientific", label: "Scientific", labelKo: "공학용" },
    ],
    group: "appearance",
  },
  {
    key: "grouping",
    label: "Thousands Separator",
    labelKo: "천 단위 구분",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "calculator",
    name: "Calculator",
    description: "A tap-friendly calculator — basic arithmetic or scientific functions",
  },
  paramsSchema: calculatorSchema,
  defaultParams: calculatorDefaults,
  component: CalculatorWidget,
  controls,
  nameKo: "계산기",
  descriptionKo: "탭하기 좋은 계산기 — 기본 사칙연산과 공학용 함수",
  category: "utility",
  recommendedSize: { width: 320, height: 440 },
});
