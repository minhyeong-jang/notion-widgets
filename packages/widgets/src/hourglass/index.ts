import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { HourglassWidget } from "./widget";
import { hourglassSchema, hourglassDefaults } from "./schema";

export { HourglassWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "모양",
    type: "select",
    defaultValue: "classic",
    options: [
      { value: "classic", label: "Classic", labelKo: "클래식" },
      { value: "curved", label: "Curved", labelKo: "곡선" },
      { value: "slim", label: "Slim", labelKo: "슬림" },
    ],
    group: "appearance",
  },
  {
    key: "duration",
    label: "Duration",
    labelKo: "시간",
    type: "select",
    defaultValue: "300",
    options: [
      { value: "60", label: "1 min", labelKo: "1분" },
      { value: "180", label: "3 min", labelKo: "3분" },
      { value: "300", label: "5 min", labelKo: "5분" },
      { value: "600", label: "10 min", labelKo: "10분" },
      { value: "900", label: "15 min", labelKo: "15분" },
      { value: "1500", label: "25 min", labelKo: "25분" },
    ],
    group: "content",
  },
  {
    key: "loop",
    label: "Auto Flip",
    labelKo: "자동 뒤집기",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showTime",
    label: "Show Timer",
    labelKo: "남은 시간 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "hourglass",
    name: "Hourglass",
    description: "An animated sand timer that flows and flips",
  },
  paramsSchema: hourglassSchema,
  defaultParams: hourglassDefaults,
  component: HourglassWidget,
  controls,
  nameKo: "모래시계",
  descriptionKo: "모래가 흐르고 자동으로 뒤집히는 애니메이션 타이머",
  category: "time",
  recommendedSize: { width: 260, height: 320 },
});
