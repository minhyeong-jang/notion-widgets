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
  {
    key: "color",
    label: "Accent Color",
    labelKo: "\uAC15\uC870 \uC0C9\uC0C1",
    type: "color",
    defaultValue: "7fb686",
    group: "color",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "\uBC30\uACBD \uC0C9\uC0C1",
    type: "color",
    defaultValue: "18181b",
    group: "color",
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
