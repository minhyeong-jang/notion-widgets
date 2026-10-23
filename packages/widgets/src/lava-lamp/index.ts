import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { LavaLampWidget } from "./widget";
import { lavaLampSchema, lavaLampDefaults } from "./schema";

export { LavaLampWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "lamp",
    options: [
      { value: "lamp", label: "Lamp bottle", labelKo: "램프" },
      { value: "ambient", label: "Ambient panel", labelKo: "앰비언트" },
    ],
    group: "appearance",
  },
  {
    key: "speed",
    label: "Speed",
    labelKo: "속도",
    type: "select",
    defaultValue: "normal",
    options: [
      { value: "slow", label: "Slow", labelKo: "느리게" },
      { value: "normal", label: "Normal", labelKo: "보통" },
      { value: "fast", label: "Fast", labelKo: "빠르게" },
    ],
    group: "appearance",
  },
];

registerWidget({
  meta: {
    id: "lava-lamp",
    name: "Lava Lamp",
    description: "A mesmerizing lava lamp to decorate your dashboard",
  },
  paramsSchema: lavaLampSchema,
  defaultParams: lavaLampDefaults,
  component: LavaLampWidget,
  controls,
  nameKo: "라바 램프",
  descriptionKo: "대시보드를 꾸며주는 몽환적인 라바 램프",
  category: "lifestyle",
  recommendedSize: { width: 280, height: 360 },
});
