import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { DailyTarotWidget } from "./widget";
import { dailyTarotSchema, dailyTarotDefaults } from "./schema";

export { DailyTarotWidget } from "./widget";

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
      { value: "minimal", label: "Minimal", labelKo: "미니멀" },
      { value: "detailed", label: "Detailed", labelKo: "상세" },
    ],
    group: "appearance",
  },
  {
    key: "deck",
    label: "Deck",
    labelKo: "\uB371",
    type: "select",
    defaultValue: "major",
    options: [
      { value: "major", label: "Major Arcana (22)" },
      { value: "full", label: "Full Deck (78)" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "daily-tarot",
    name: "Daily Tarot",
    description: "Daily 3-card tarot spread with full card interpretation and advice",
  },
  paramsSchema: dailyTarotSchema,
  defaultParams: dailyTarotDefaults,
  component: DailyTarotWidget,
  controls,
  nameKo: "\uC624\uB298\uC758 \uD0C0\uB85C",
  descriptionKo: "\uB9E4\uC77C \uBC14\uB00C\uB294 3\uC7A5 \uD0C0\uB85C \uC2A4\uD504\uB808\uB4DC\uC640 \uCE74\uB4DC\uBCC4 \uC758\uBBF8 \uD574\uC124 \uBC0F \uC870\uC5B8",
  category: "lifestyle",
  recommendedSize: { width: 420, height: 480 },
});
