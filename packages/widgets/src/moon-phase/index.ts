import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { MoonPhaseWidget } from "./widget";
import { moonPhaseSchema, moonPhaseDefaults } from "./schema";

export { MoonPhaseWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "detailed", label: "Detailed" },
    ],
    group: "appearance",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "moon-phase",
    name: "Moon Phase",
    description: "Current moon phase with SVG visualization",
  },
  paramsSchema: moonPhaseSchema,
  defaultParams: moonPhaseDefaults,
  component: MoonPhaseWidget,
  controls,
  nameKo: "\uB2EC\uC758 \uC704\uC0C1",
  descriptionKo: "\uD604\uC7AC \uB2EC\uC758 \uC704\uC0C1\uC744 SVG\uB85C \uBCF4\uC5EC\uC8FC\uB294 \uC704\uC82F",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 300 },
});
