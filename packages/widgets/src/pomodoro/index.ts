import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget } from "@nw/widget-core";
import { PomodoroWidget } from "./widget";
import { pomodoroSchema, pomodoroDefaults } from "./schema";

export { PomodoroWidget } from "./widget";

const controls: ControlDefinition[] = [
  {
    key: "color",
    label: "Accent Color",
    labelKo: "강조 색상",
    type: "color",
    defaultValue: "7fb686",
    group: "appearance",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "배경 색상",
    type: "color",
    defaultValue: "18181b",
    group: "appearance",
  },
  {
    key: "workMinutes",
    label: "Work Minutes",
    labelKo: "집중 시간 (분)",
    type: "text",
    defaultValue: "25",
    group: "content",
  },
  {
    key: "breakMinutes",
    label: "Break Minutes",
    labelKo: "휴식 시간 (분)",
    type: "text",
    defaultValue: "5",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "pomodoro",
    name: "Pomodoro Timer",
    description: "Focus timer with work and break sessions",
  },
  paramsSchema: pomodoroSchema,
  defaultParams: pomodoroDefaults,
  component: PomodoroWidget,
  controls,
  nameKo: "포모도로 타이머",
  descriptionKo: "집중과 휴식을 번갈아가는 생산성 타이머",
  category: "productivity",
  recommendedSize: { width: 300, height: 300 },
});
