import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, styleControl, colorThemeControl } from "@nw/widget-core";
import { MoodTrackerWidget } from "./widget";
import { moodTrackerSchema, moodTrackerDefaults } from "./schema";

export { MoodTrackerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  localeControl,
  {
    key: "variant",
    label: "Mood Set",
    labelKo: "이모지 세트",
    type: "select",
    defaultValue: "faces",
    options: [
      { value: "faces", label: "Faces", labelKo: "표정" },
      { value: "weather", label: "Weather", labelKo: "날씨" },
      { value: "nature", label: "Nature", labelKo: "자연" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "showWeek",
    label: "Show Week",
    labelKo: "주간 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "mood-tracker",
    name: "Mood Tracker",
    description: "Log your daily mood and see the week at a glance",
  },
  paramsSchema: moodTrackerSchema,
  defaultParams: moodTrackerDefaults,
  component: MoodTrackerWidget,
  controls,
  nameKo: "기분 트래커",
  descriptionKo: "매일 기분을 기록하고 한 주를 한눈에 확인하세요",
  category: "lifestyle",
  recommendedSize: { width: 340, height: 360 },
});
