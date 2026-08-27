import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { DateCardWidget } from "./widget";
import { dateCardSchema, dateCardDefaults } from "./schema";

export { DateCardWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "tearoff",
    options: [
      { value: "tearoff", label: "Tear-off", labelKo: "일력" },
      { value: "stack", label: "Stacked", labelKo: "스택" },
      { value: "banner", label: "Banner", labelKo: "배너" },
    ],
    group: "appearance",
  },
  localeControl,
  {
    key: "info",
    label: "Extra Info",
    labelKo: "부가 정보",
    type: "select",
    defaultValue: "none",
    options: [
      { value: "none", label: "None", labelKo: "없음" },
      { value: "dayOfYear", label: "Day of year", labelKo: "올해 며칠째" },
      { value: "week", label: "Week number", labelKo: "주차" },
    ],
    group: "content",
  },
  {
    key: "note",
    label: "Note",
    labelKo: "메모",
    type: "text",
    defaultValue: "",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "date-card",
    name: "Date Card",
    description: "Today's date as a tear-off calendar page",
  },
  paramsSchema: dateCardSchema,
  defaultParams: dateCardDefaults,
  component: DateCardWidget,
  controls,
  nameKo: "오늘 날짜",
  descriptionKo: "일력 스타일로 보여주는 오늘의 날짜",
  category: "time",
  recommendedSize: { width: 320, height: 320 },
});
