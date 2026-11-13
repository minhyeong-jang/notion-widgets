import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { CoinFlipWidget } from "./widget";
import { coinFlipSchema, coinFlipDefaults } from "./schema";

export { CoinFlipWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "sideA",
    label: "Side A",
    labelKo: "앞면",
    type: "text",
    defaultValue: "Heads",
    group: "content",
  },
  {
    key: "sideB",
    label: "Side B",
    labelKo: "뒷면",
    type: "text",
    defaultValue: "Tails",
    group: "content",
  },
  {
    key: "mode",
    label: "Mode",
    labelKo: "모드",
    type: "select",
    defaultValue: "random",
    options: [
      { value: "random", label: "Random", labelKo: "랜덤" },
      { value: "daily", label: "Daily", labelKo: "매일 고정" },
    ],
    group: "content",
  },
  {
    key: "showHint",
    label: "Show tap hint",
    labelKo: "안내 문구 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "coin-flip",
    name: "Coin Flip",
    description: "Flip a coin to settle any decision — tap to re-flip",
  },
  paramsSchema: coinFlipSchema,
  defaultParams: coinFlipDefaults,
  component: CoinFlipWidget,
  controls,
  nameKo: "동전 던지기",
  descriptionKo: "결정이 필요할 때 동전 던지기 — 눌러서 다시 던지기",
  category: "utility",
  recommendedSize: { width: 300, height: 260 },
});
