import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, themeControl } from "@nw/widget-core";
import { BreathingWidget } from "./widget";
import { breathingSchema, breathingDefaults } from "./schema";

export { BreathingWidget } from "./widget";

const controls: ControlDefinition[] = [
  themeControl,
  {
    key: "style",
    label: "Style",
    labelKo: "\uC2A4\uD0C0\uC77C",
    type: "select",
    defaultValue: "circle",
    options: [
      { value: "circle", label: "Circle" },
      { value: "minimal", label: "Minimal" },
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
    key: "technique",
    label: "Technique",
    labelKo: "\uD638\uD761\uBC95",
    type: "select",
    defaultValue: "4-7-8",
    options: [
      { value: "4-7-8", label: "4-7-8 Relaxing" },
      { value: "box", label: "Box Breathing" },
      { value: "equal", label: "Equal Breathing" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "breathing",
    name: "Breathing Exercise",
    description: "Guided breathing animation with multiple techniques",
  },
  paramsSchema: breathingSchema,
  defaultParams: breathingDefaults,
  component: BreathingWidget,
  controls,
  nameKo: "\uD638\uD761 \uC6B4\uB3D9",
  descriptionKo: "\uB2E4\uC591\uD55C \uD638\uD761\uBC95\uC744 \uC548\uB0B4\uD558\uB294 \uC560\uB2C8\uBA54\uC774\uC158 \uC704\uC82F",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 300 },
});
