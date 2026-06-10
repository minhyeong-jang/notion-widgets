import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { FocusWordWidget } from "./widget";
import { focusWordSchema, focusWordDefaults } from "./schema";

export { FocusWordWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "word",
    label: "Custom Word",
    labelKo: "커스텀 단어",
    type: "text",
    defaultValue: "",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "focus-word",
    name: "Focus Word",
    description: "Large typography single word for daily motivation",
  },
  paramsSchema: focusWordSchema,
  defaultParams: focusWordDefaults,
  component: FocusWordWidget,
  controls,
  nameKo: "포커스 워드",
  descriptionKo: "하루 동기부여를 위한 대형 타이포그래피 단어",
  category: "productivity",
  recommendedSize: { width: 400, height: 200 },
});
