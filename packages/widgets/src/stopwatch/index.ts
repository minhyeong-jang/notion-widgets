import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { StopwatchWidget } from "./widget";
import { stopwatchSchema, stopwatchDefaults } from "./schema";

export { StopwatchWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "digits",
    options: [
      { value: "digits", label: "Digits", labelKo: "숫자" },
      { value: "laps", label: "Laps", labelKo: "랩 기록" },
      { value: "badge", label: "Badge", labelKo: "뱃지" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Stopwatch",
    group: "content",
  },
  {
    key: "showCenti",
    label: "Show Centiseconds",
    labelKo: "0.01초 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "stopwatch",
    name: "Stopwatch",
    description: "Time anything with start, lap and reset — keeps running even after a reload",
  },
  paramsSchema: stopwatchSchema,
  defaultParams: stopwatchDefaults,
  component: StopwatchWidget,
  controls,
  nameKo: "스톱워치",
  descriptionKo: "시작·랩·초기화로 무엇이든 시간 측정 — 새로고침해도 계속 작동, 기기에 저장",
  category: "time",
  recommendedSize: { width: 360, height: 280 },
});
