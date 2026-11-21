import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { IntervalTimerWidget } from "./widget";
import { intervalTimerSchema, intervalTimerDefaults } from "./schema";

export { IntervalTimerWidget } from "./widget";

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
      { value: "digits", label: "Digits", labelKo: "숫자" },
    ],
    group: "appearance",
  },
  {
    key: "work",
    label: "Work (sec)",
    labelKo: "운동 (초)",
    type: "select",
    defaultValue: "30",
    options: [
      { value: "15", label: "15s" },
      { value: "20", label: "20s" },
      { value: "30", label: "30s" },
      { value: "40", label: "40s" },
      { value: "45", label: "45s" },
      { value: "60", label: "60s" },
      { value: "90", label: "90s" },
    ],
    group: "content",
  },
  {
    key: "rest",
    label: "Rest (sec)",
    labelKo: "휴식 (초)",
    type: "select",
    defaultValue: "15",
    options: [
      { value: "0", label: "None" },
      { value: "10", label: "10s" },
      { value: "15", label: "15s" },
      { value: "20", label: "20s" },
      { value: "30", label: "30s" },
      { value: "45", label: "45s" },
      { value: "60", label: "60s" },
    ],
    group: "content",
  },
  {
    key: "rounds",
    label: "Rounds",
    labelKo: "라운드",
    type: "select",
    defaultValue: "8",
    options: [
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "8", label: "8" },
      { value: "10", label: "10" },
      { value: "12", label: "12" },
      { value: "15", label: "15" },
      { value: "20", label: "20" },
    ],
    group: "content",
  },
  {
    key: "showControls",
    label: "Show Controls",
    labelKo: "컨트롤 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "interval-timer",
    name: "Interval Timer",
    description: "HIIT / Tabata workout timer with work & rest rounds and audible cues",
  },
  paramsSchema: intervalTimerSchema,
  defaultParams: intervalTimerDefaults,
  component: IntervalTimerWidget,
  controls,
  nameKo: "인터벌 타이머",
  descriptionKo: "운동·휴식 라운드와 알림음을 지원하는 HIIT·타바타 운동 타이머",
  category: "lifestyle",
  recommendedSize: { width: 320, height: 360 },
});
