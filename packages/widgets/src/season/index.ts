import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { SeasonWidget } from "./widget";
import { seasonSchema, seasonDefaults } from "./schema";

export { SeasonWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "ring",
    options: [
      { value: "ring", label: "Ring", labelKo: "링" },
      { value: "bar", label: "Bar", labelKo: "바" },
      { value: "seasons", label: "Four Seasons", labelKo: "사계절" },
    ],
    group: "appearance",
  },
  {
    key: "hemisphere",
    label: "Hemisphere",
    labelKo: "반구",
    type: "select",
    defaultValue: "north",
    options: [
      { value: "north", label: "Northern", labelKo: "북반구" },
      { value: "south", label: "Southern", labelKo: "남반구" },
    ],
    group: "content",
  },
  localeControl,
  {
    key: "showPercent",
    label: "Show Percent",
    labelKo: "퍼센트 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "season",
    name: "Season Progress",
    description: "See how far you are through the current season and days left",
  },
  paramsSchema: seasonSchema,
  defaultParams: seasonDefaults,
  component: SeasonWidget,
  controls,
  nameKo: "계절 진행률",
  descriptionKo: "지금 계절이 얼마나 지났는지, 며칠 남았는지 한눈에 — 남/북반구 지원",
  category: "lifestyle",
  recommendedSize: { width: 360, height: 300 },
});
