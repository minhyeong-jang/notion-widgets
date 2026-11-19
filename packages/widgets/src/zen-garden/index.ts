import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { ZenGardenWidget } from "./widget";
import { zenGardenSchema, zenGardenDefaults } from "./schema";

export { ZenGardenWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Pattern",
    labelKo: "패턴",
    type: "select",
    defaultValue: "circular",
    options: [
      { value: "circular", label: "Ripples", labelKo: "물결" },
      { value: "linear", label: "Rake lines", labelKo: "갈퀴선" },
    ],
    group: "appearance",
  },
  {
    key: "stones",
    label: "Stones",
    labelKo: "돌 개수",
    type: "select",
    defaultValue: "3",
    options: [
      { value: "2", label: "2" },
      { value: "3", label: "3" },
    ],
    group: "appearance",
  },
];

registerWidget({
  meta: {
    id: "zen-garden",
    name: "Zen Garden",
    description: "A calming raked-sand zen garden scene",
  },
  paramsSchema: zenGardenSchema,
  defaultParams: zenGardenDefaults,
  component: ZenGardenWidget,
  controls,
  nameKo: "젠 가든",
  descriptionKo: "마음을 가라앉히는 선(禪) 정원 풍경",
  category: "lifestyle",
  recommendedSize: { width: 340, height: 300 },
});
