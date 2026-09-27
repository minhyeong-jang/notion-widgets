import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { BiorhythmWidget } from "./widget";
import { biorhythmSchema, biorhythmDefaults } from "./schema";

export { BiorhythmWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "chart",
    options: [
      { value: "chart", label: "Chart", labelKo: "그래프" },
      { value: "rings", label: "Rings", labelKo: "링" },
      { value: "bars", label: "Bars", labelKo: "막대" },
    ],
    group: "appearance",
  },
  {
    key: "birth",
    label: "Birthday",
    labelKo: "생일",
    type: "date",
    defaultValue: "1996-05-20",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "biorhythm",
    name: "Biorhythm",
    description: "Physical, emotional & intellectual cycles from your birthday",
  },
  paramsSchema: biorhythmSchema,
  defaultParams: biorhythmDefaults,
  component: BiorhythmWidget,
  controls,
  nameKo: "바이오리듬",
  descriptionKo: "생일 기준 신체·감정·지성 리듬을 보여주는 위젯",
  category: "lifestyle",
  recommendedSize: { width: 420, height: 260 },
});
