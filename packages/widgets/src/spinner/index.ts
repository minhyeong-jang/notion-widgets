import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { SpinnerWidget } from "./widget";
import { spinnerSchema, spinnerDefaults } from "./schema";

export { SpinnerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Color",
    labelKo: "색상",
    type: "select",
    defaultValue: "classic",
    options: [
      { value: "classic", label: "Rainbow", labelKo: "무지개" },
      { value: "accent", label: "Accent", labelKo: "포인트 컬러" },
    ],
    group: "appearance",
  },
  {
    key: "options",
    label: "Options (comma separated)",
    labelKo: "선택지 (쉼표로 구분)",
    type: "text",
    defaultValue: spinnerDefaults.options,
    group: "content",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "spinner",
    name: "Decision Wheel",
    description: "Spin the wheel to pick a random choice",
  },
  paramsSchema: spinnerSchema,
  defaultParams: spinnerDefaults,
  component: SpinnerWidget,
  controls,
  nameKo: "돌림판",
  descriptionKo: "돌림판을 돌려 무작위로 하나를 골라주는 위젯",
  category: "utility",
  recommendedSize: { width: 320, height: 380 },
});
