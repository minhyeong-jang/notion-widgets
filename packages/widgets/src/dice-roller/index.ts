import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { DiceRollerWidget } from "./widget";
import { diceRollerSchema, diceRollerDefaults } from "./schema";

export { DiceRollerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "double",
    options: [
      { value: "single", label: "1 Die", labelKo: "주사위 1개" },
      { value: "double", label: "2 Dice", labelKo: "주사위 2개" },
      { value: "d20", label: "D20", labelKo: "20면체" },
    ],
    group: "appearance",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "dice-roller",
    name: "Dice Roller",
    description: "Roll dice with a tap — d6 pairs or a D20 for games and decisions",
  },
  paramsSchema: diceRollerSchema,
  defaultParams: diceRollerDefaults,
  component: DiceRollerWidget,
  controls,
  nameKo: "주사위",
  descriptionKo: "탭 한 번으로 주사위 굴리기 — 게임·의사결정용 d6/D20",
  category: "utility",
  recommendedSize: { width: 300, height: 260 },
});
