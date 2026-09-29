import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { BinaryClockWidget } from "./widget";
import { binaryClockSchema, binaryClockDefaults } from "./schema";

export { BinaryClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "columns",
    options: [
      { value: "columns", label: "Columns (BCD)", labelKo: "컬럼 (BCD)" },
      { value: "rows", label: "Rows", labelKo: "가로줄" },
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
    key: "showLabels",
    label: "Show labels",
    labelKo: "레이블 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
  {
    key: "showDecimal",
    label: "Show decimal",
    labelKo: "숫자 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "binary-clock",
    name: "Binary Clock",
    description: "Geeky LED binary clock that reads hours, minutes and seconds in bits",
  },
  paramsSchema: binaryClockSchema,
  defaultParams: binaryClockDefaults,
  component: BinaryClockWidget,
  controls,
  nameKo: "바이너리 시계",
  descriptionKo: "시·분·초를 비트로 표시하는 LED 이진 시계",
  category: "time",
  recommendedSize: { width: 360, height: 240 },
});
