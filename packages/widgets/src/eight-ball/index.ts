import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { EightBallWidget } from "./widget";
import { eightBallSchema, eightBallDefaults } from "./schema";

export { EightBallWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "ball",
    options: [
      { value: "ball", label: "Ball", labelKo: "볼" },
      { value: "orb", label: "Orb", labelKo: "오브" },
      { value: "card", label: "Card", labelKo: "카드" },
    ],
    group: "appearance",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "eight-ball",
    name: "Magic 8-Ball",
    description: "Tap for a fortune-teller answer to any yes-or-no question",
  },
  paramsSchema: eightBallSchema,
  defaultParams: eightBallDefaults,
  component: EightBallWidget,
  controls,
  nameKo: "매직 8볼",
  descriptionKo: "예/아니오 질문에 운세로 답해주는 매직 8볼",
  category: "lifestyle",
  recommendedSize: { width: 340, height: 400 },
});
