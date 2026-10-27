import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { SleepCalculatorWidget } from "./widget";
import { sleepCalculatorSchema, sleepCalculatorDefaults } from "./schema";

export { SleepCalculatorWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "list",
    options: [
      { value: "list", label: "List", labelKo: "리스트" },
      { value: "cards", label: "Cards", labelKo: "카드" },
      { value: "moon", label: "Moon", labelKo: "문" },
    ],
    group: "appearance",
  },
  {
    key: "goal",
    label: "Calculate",
    labelKo: "계산 기준",
    type: "select",
    defaultValue: "wake",
    options: [
      { value: "wake", label: "Bedtime for wake-up", labelKo: "기상 시각 → 취침" },
      { value: "sleep", label: "Wake-up from now", labelKo: "지금 자면 → 기상" },
    ],
    group: "content",
  },
  {
    key: "wakeTime",
    label: "Wake-up Time",
    labelKo: "기상 시각",
    type: "select",
    defaultValue: "07:00",
    options: [
      { value: "05:30", label: "05:30" },
      { value: "06:00", label: "06:00" },
      { value: "06:30", label: "06:30" },
      { value: "07:00", label: "07:00" },
      { value: "07:30", label: "07:30" },
      { value: "08:00", label: "08:00" },
      { value: "08:30", label: "08:30" },
      { value: "09:00", label: "09:00" },
      { value: "10:00", label: "10:00" },
    ],
    group: "content",
  },
  {
    key: "fallAsleep",
    label: "Fall-asleep Buffer",
    labelKo: "잠드는 시간",
    type: "select",
    defaultValue: "15",
    options: [
      { value: "0", label: "0 min" },
      { value: "10", label: "10 min" },
      { value: "15", label: "15 min" },
      { value: "20", label: "20 min" },
      { value: "30", label: "30 min" },
    ],
    group: "content",
  },
  {
    key: "hour12",
    label: "12-hour Clock",
    labelKo: "12시간제",
    type: "toggle",
    defaultValue: "false",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "sleep-calculator",
    name: "Sleep Calculator",
    description: "Find the best bedtime or wake-up time based on 90-minute sleep cycles",
  },
  paramsSchema: sleepCalculatorSchema,
  defaultParams: sleepCalculatorDefaults,
  component: SleepCalculatorWidget,
  controls,
  nameKo: "수면 계산기",
  descriptionKo: "90분 수면 주기로 최적의 취침·기상 시각을 계산",
  category: "lifestyle",
  recommendedSize: { width: 340, height: 360 },
});
