import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { HabitHeatmapWidget } from "./widget";
import { habitHeatmapSchema, habitHeatmapDefaults } from "./schema";

export { HabitHeatmapWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "color",
    label: "Accent Color",
    labelKo: "\uAC15\uC870 \uC0C9\uC0C1",
    type: "color",
    defaultValue: "7fb686",
    group: "color",
  },
  {
    key: "bg",
    label: "Background Color",
    labelKo: "\uBC30\uACBD \uC0C9\uC0C1",
    type: "color",
    defaultValue: "18181b",
    group: "color",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "\uB77C\uBCA8",
    type: "text",
    defaultValue: "Year Progress",
    group: "content",
  },
  {
    key: "weeks",
    label: "Weeks",
    labelKo: "\uC8FC \uC218",
    type: "slider",
    defaultValue: 20,
    options: [
      { value: "12", label: "12" },
      { value: "52", label: "52" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "habit-heatmap",
    name: "Habit Heatmap",
    description: "GitHub-style contribution heatmap showing year progress",
  },
  paramsSchema: habitHeatmapSchema,
  defaultParams: habitHeatmapDefaults,
  component: HabitHeatmapWidget,
  controls,
  nameKo: "\uC2B5\uAD00 \uD788\uD2B8\uB9F5",
  descriptionKo: "GitHub \uC2A4\uD0C0\uC77C\uC758 \uC5F0\uAC04 \uD65C\uB3D9 \uD788\uD2B8\uB9F5",
  category: "productivity",
  recommendedSize: { width: 400, height: 200 },
});
