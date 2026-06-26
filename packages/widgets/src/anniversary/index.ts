import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { AnniversaryWidget } from "./widget";
import { anniversarySchema, anniversaryDefaults } from "./schema";

export { AnniversaryWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "plus",
    options: [
      { value: "plus", label: "Plus", labelKo: "플러스" },
      { value: "ring", label: "Ring", labelKo: "링" },
      { value: "stat", label: "Stat", labelKo: "스탯" },
    ],
    group: "appearance",
  },
  {
    key: "startDate",
    label: "Start Date",
    labelKo: "시작 날짜",
    type: "date",
    defaultValue: "2024-01-01",
    group: "content",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Together",
    group: "content",
  },
  localeControl,
  {
    key: "countFromOne",
    label: "Count From Day 1",
    labelKo: "첫날을 1일로",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showMilestone",
    label: "Show Milestone",
    labelKo: "다음 기념일 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showDate",
    label: "Show Start Date",
    labelKo: "시작 날짜 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "anniversary",
    name: "Anniversary Counter",
    description: "Count the days since a date that matters — with milestones",
  },
  paramsSchema: anniversarySchema,
  defaultParams: anniversaryDefaults,
  component: AnniversaryWidget,
  controls,
  nameKo: "기념일 카운터",
  descriptionKo: "소중한 날부터 며칠째인지 D+로 세고, 다음 기념일까지 알려줘요",
  category: "time",
  recommendedSize: { width: 360, height: 220 },
});
