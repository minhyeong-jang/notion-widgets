import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { MandalaWidget } from "./widget";
import { mandalaSchema, mandalaDefaults } from "./schema";

export { MandalaWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Pattern",
    labelKo: "패턴",
    type: "select",
    defaultValue: "rose",
    options: [
      { value: "rose", label: "Rose", labelKo: "로즈" },
      { value: "spiro", label: "Spirograph", labelKo: "스피로" },
      { value: "star", label: "Star", labelKo: "스타" },
      { value: "web", label: "Web", labelKo: "웹" },
    ],
    group: "appearance",
  },
  {
    key: "complexity",
    label: "Complexity",
    labelKo: "복잡도",
    type: "select",
    defaultValue: "med",
    options: [
      { value: "low", label: "Simple", labelKo: "단순" },
      { value: "med", label: "Medium", labelKo: "보통" },
      { value: "high", label: "Intricate", labelKo: "복잡" },
    ],
    group: "appearance",
  },
  {
    key: "animate",
    label: "Rotate",
    labelKo: "회전 애니메이션",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "mandala",
    name: "Mandala",
    description: "Generative geometric line art that rotates gently",
  },
  paramsSchema: mandalaSchema,
  defaultParams: mandalaDefaults,
  component: MandalaWidget,
  controls,
  nameKo: "만다라",
  descriptionKo: "색상에 맞춰 그려지는 기하학 라인 아트 (장식용)",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 300 },
});
