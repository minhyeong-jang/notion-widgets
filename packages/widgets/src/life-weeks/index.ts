import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, styleControl, colorThemeControl } from "@nw/widget-core";
import { LifeWeeksWidget } from "./widget";
import { lifeWeeksSchema, lifeWeeksDefaults } from "./schema";

export { LifeWeeksWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  localeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "weeks",
    options: [
      { value: "weeks", label: "Life in weeks", labelKo: "인생 전체 (주)" },
      { value: "year", label: "This year", labelKo: "올해 (주)" },
      { value: "years", label: "Life in years", labelKo: "인생 전체 (년)" },
    ],
    group: "content",
  },
  {
    key: "birthdate",
    label: "Birthdate",
    labelKo: "생년월일",
    type: "date",
    defaultValue: "2000-01-01",
    group: "content",
  },
  {
    key: "lifespan",
    label: "Life Expectancy",
    labelKo: "기대 수명",
    type: "slider",
    defaultValue: 80,
    options: [
      { value: "60", label: "60" },
      { value: "100", label: "100" },
    ],
    group: "content",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "showStats",
    label: "Show Stats",
    labelKo: "통계 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "life-weeks",
    name: "Life in Weeks",
    description: "Visualize your entire life as a grid of weeks — each dot is one week lived",
  },
  paramsSchema: lifeWeeksSchema,
  defaultParams: lifeWeeksDefaults,
  component: LifeWeeksWidget,
  controls,
  nameKo: "인생 달력",
  descriptionKo: "인생 전체를 주 단위 점 그리드로 — 한 점이 지나온 한 주",
  category: "lifestyle",
  recommendedSize: { width: 460, height: 700 },
});
