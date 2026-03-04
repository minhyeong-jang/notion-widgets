import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, themeControl, localeControl } from "@nw/widget-core";
import { DailyTarotWidget } from "./widget";
import { dailyTarotSchema, dailyTarotDefaults } from "./schema";

export { DailyTarotWidget } from "./widget";

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
      { value: "detailed", label: "Detailed" },
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
    description: "Daily tarot card draw with meaning and keywords",
  },
  paramsSchema: dailyTarotSchema,
  defaultParams: dailyTarotDefaults,
  component: DailyTarotWidget,
  controls,
  nameKo: "\uC624\uB298\uC758 \uD0C0\uB85C",
  descriptionKo: "\uB9E4\uC77C \uBC14\uB00C\uB294 \uD0C0\uB85C \uCE74\uB4DC\uC640 \uC758\uBBF8 \uD574\uC124",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 400 },
});
