import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, styleControl, colorThemeControl } from "@nw/widget-core";
import { RandomPickerWidget } from "./widget";
import { randomPickerSchema, randomPickerDefaults } from "./schema";

export { RandomPickerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Picker",
    labelKo: "종류",
    type: "select",
    defaultValue: "dice",
    options: [
      { value: "dice", label: "Dice", labelKo: "주사위" },
      { value: "coin", label: "Coin", labelKo: "동전" },
      { value: "oracle", label: "Magic 8-Ball", labelKo: "마법의 대답" },
      { value: "pick", label: "Pick from List", labelKo: "목록에서 뽑기" },
    ],
    group: "appearance",
  },
  localeControl,
  {
    key: "mode",
    label: "Mode",
    labelKo: "모드",
    type: "select",
    defaultValue: "random",
    options: [
      { value: "random", label: "Random", labelKo: "랜덤" },
      { value: "daily", label: "Daily", labelKo: "매일" },
    ],
    group: "content",
  },
  {
    key: "options",
    label: "Options (comma separated)",
    labelKo: "선택지 (쉼표로 구분)",
    type: "text",
    defaultValue: "Pizza, Sushi, Tacos, Salad, Ramen",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "random-picker",
    name: "Random Picker",
    description: "Roll a die, flip a coin, ask the 8-ball, or pick from a list",
  },
  paramsSchema: randomPickerSchema,
  defaultParams: randomPickerDefaults,
  component: RandomPickerWidget,
  controls,
  nameKo: "랜덤 결정기",
  descriptionKo: "주사위, 동전, 마법의 대답, 목록 뽑기로 무작위 결정을 도와주는 위젯",
  category: "utility",
  recommendedSize: { width: 340, height: 360 },
});
