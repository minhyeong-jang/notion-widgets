import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { DigitalClockWidget } from "./widget";
import { digitalClockSchema, digitalClockDefaults } from "./schema";

export { DigitalClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "classic",
    options: [
      { value: "classic", label: "Classic", labelKo: "클래식" },
      { value: "greeting", label: "With greeting", labelKo: "인사말 포함" },
    ],
    group: "appearance",
  },
  {
    key: "hour12",
    label: "12-hour clock",
    labelKo: "12시간제",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
  {
    key: "showSeconds",
    label: "Show seconds",
    labelKo: "초 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showDate",
    label: "Show date",
    labelKo: "날짜 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "digital-clock",
    name: "Digital Clock",
    description: "Clean digital clock with date and greeting",
  },
  paramsSchema: digitalClockSchema,
  defaultParams: digitalClockDefaults,
  component: DigitalClockWidget,
  controls,
  nameKo: "디지털 시계",
  descriptionKo: "날짜와 인사말을 곁들인 깔끔한 디지털 시계",
  category: "time",
  recommendedSize: { width: 360, height: 200 },
});
