import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { SunTimesWidget } from "./widget";
import { sunTimesSchema, sunTimesDefaults } from "./schema";
import { CITIES } from "./cities";

export { SunTimesWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "city",
    label: "City",
    labelKo: "도시",
    type: "select",
    defaultValue: "seoul",
    options: CITIES.map((c) => ({ value: c.id, label: c.name, labelKo: c.nameKo })),
    group: "content",
  },
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "arc",
    options: [
      { value: "arc", label: "Arc", labelKo: "아크" },
      { value: "compact", label: "Compact", labelKo: "컴팩트" },
    ],
    group: "appearance",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "sun-times",
    name: "Sun Times",
    description: "Sunrise, sunset and golden hour for your city",
  },
  paramsSchema: sunTimesSchema,
  defaultParams: sunTimesDefaults,
  component: SunTimesWidget,
  controls,
  nameKo: "일출·일몰",
  descriptionKo: "도시별 일출·일몰 시각과 낮 길이를 아크로 보여주는 위젯",
  category: "lifestyle",
  recommendedSize: { width: 360, height: 260 },
});
