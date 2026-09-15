import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { TodayWidget } from "./widget";
import { todaySchema, todayDefaults } from "./schema";

export { TodayWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "stack",
    options: [
      { value: "stack", label: "Stack", labelKo: "스택" },
      { value: "page", label: "Calendar Page", labelKo: "달력장" },
      { value: "banner", label: "Banner", labelKo: "배너" },
    ],
    group: "appearance",
  },
  localeControl,
  {
    key: "subInfo",
    label: "Extra Info",
    labelKo: "추가 정보",
    type: "select",
    defaultValue: "none",
    options: [
      { value: "none", label: "None", labelKo: "없음" },
      { value: "dayOfYear", label: "Day of Year", labelKo: "올해 며칠째" },
      { value: "weekNumber", label: "Week Number", labelKo: "몇 번째 주" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "today",
    name: "Today's Date",
    description: "A large, glanceable display of today's date",
  },
  paramsSchema: todaySchema,
  defaultParams: todayDefaults,
  component: TodayWidget,
  controls,
  nameKo: "오늘 날짜",
  descriptionKo: "오늘 날짜를 크게 보여주는 위젯",
  category: "time",
  recommendedSize: { width: 320, height: 260 },
});
