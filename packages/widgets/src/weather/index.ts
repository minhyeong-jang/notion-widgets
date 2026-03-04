import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, themeControl } from "@nw/widget-core";
import { WeatherWidget } from "./widget";
import { weatherSchema, weatherDefaults } from "./schema";

export { WeatherWidget } from "./widget";

const controls: ControlDefinition[] = [
  themeControl,
  {
    key: "style",
    label: "Style",
    labelKo: "\uC2A4\uD0C0\uC77C",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "card", label: "Card" },
    ],
    group: "appearance",
  },
  {
    key: "color",
    label: "Accent Color",
    labelKo: "\uAC15\uC870 \uC0C9\uC0C1",
    type: "color",
    defaultValue: "7fb686",
    group: "appearance",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "\uBC30\uACBD \uC0C9\uC0C1",
    type: "color",
    defaultValue: "18181b",
    group: "appearance",
  },
  {
    key: "city",
    label: "City",
    labelKo: "\uB3C4\uC2DC",
    type: "text",
    defaultValue: "Seoul",
    group: "content",
  },
  {
    key: "units",
    label: "Temperature Unit",
    labelKo: "\uC628\uB3C4 \uB2E8\uC704",
    type: "select",
    defaultValue: "C",
    options: [
      { value: "C", label: "\u00B0C (Celsius)" },
      { value: "F", label: "\u00B0F (Fahrenheit)" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "weather",
    name: "Weather",
    description: "Current weather display with temperature and conditions",
  },
  paramsSchema: weatherSchema,
  defaultParams: weatherDefaults,
  component: WeatherWidget,
  controls,
  nameKo: "\uB0A0\uC528",
  descriptionKo: "\uD604\uC7AC \uB0A0\uC528\uC640 \uAE30\uC628\uC744 \uBCF4\uC5EC\uC8FC\uB294 \uC704\uC82F",
  category: "utility",
  recommendedSize: { width: 350, height: 200 },
});
