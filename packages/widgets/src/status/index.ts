import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { StatusWidget } from "./widget";
import { statusSchema, statusDefaults } from "./schema";

export { StatusWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  localeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Card", labelKo: "카드" },
      { value: "pill", label: "Pill", labelKo: "필" },
      { value: "banner", label: "Banner", labelKo: "배너" },
    ],
    group: "appearance",
  },
  {
    key: "status",
    label: "Status",
    labelKo: "상태",
    type: "select",
    defaultValue: "available",
    options: [
      { value: "available", label: "Available", labelKo: "활동 중" },
      { value: "busy", label: "Busy", labelKo: "바쁨" },
      { value: "away", label: "Away", labelKo: "자리 비움" },
      { value: "focus", label: "Focusing", labelKo: "집중 중" },
      { value: "offline", label: "Offline", labelKo: "오프라인" },
      { value: "custom", label: "Custom", labelKo: "직접 입력" },
    ],
    group: "content",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "message",
    label: "Message",
    labelKo: "메시지",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "pulse",
    label: "Pulse",
    labelKo: "맥동 효과",
    type: "toggle",
    defaultValue: "true",
    group: "appearance",
  },
];

registerWidget({
  meta: {
    id: "status",
    name: "Status",
    description: "Show your current availability or what you're working on",
  },
  paramsSchema: statusSchema,
  defaultParams: statusDefaults,
  component: StatusWidget,
  controls,
  nameKo: "상태 표시",
  descriptionKo: "현재 상태나 작업 중인 일을 한눈에 보여주세요",
  category: "productivity",
  recommendedSize: { width: 300, height: 220 },
});
