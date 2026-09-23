import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { ZodiacWidget } from "./widget";
import { zodiacSchema, zodiacDefaults } from "./schema";

export { ZodiacWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Card", labelKo: "카드" },
      { value: "constellation", label: "Constellation", labelKo: "별자리도" },
      { value: "compact", label: "Compact", labelKo: "컴팩트" },
    ],
    group: "appearance",
  },
  {
    key: "birthday",
    label: "Birthday (MM-DD)",
    labelKo: "생일 (MM-DD)",
    type: "text",
    defaultValue: "08-14",
    group: "content",
  },
  localeControl,
  {
    key: "showTraits",
    label: "Show Traits",
    labelKo: "특성 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "zodiac",
    name: "Zodiac Sign",
    description: "Your star sign with its constellation, dates, and traits",
  },
  paramsSchema: zodiacSchema,
  defaultParams: zodiacDefaults,
  component: ZodiacWidget,
  controls,
  nameKo: "별자리",
  descriptionKo: "생일로 찾는 나의 별자리 — 별자리도, 날짜, 특성까지",
  category: "lifestyle",
  recommendedSize: { width: 320, height: 360 },
});
