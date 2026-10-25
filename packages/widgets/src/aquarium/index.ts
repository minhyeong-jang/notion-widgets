import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
} from "@nw/widget-core";
import { AquariumWidget } from "./widget";
import { aquariumSchema, aquariumDefaults } from "./schema";

export { AquariumWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Scene",
    labelKo: "분위기",
    type: "select",
    defaultValue: "reef",
    options: [
      { value: "reef", label: "Reef", labelKo: "산호초" },
      { value: "deep", label: "Deep sea", labelKo: "심해" },
      { value: "calm", label: "Calm", labelKo: "고요" },
    ],
    group: "appearance",
  },
  {
    key: "speed",
    label: "Speed",
    labelKo: "속도",
    type: "select",
    defaultValue: "normal",
    options: [
      { value: "slow", label: "Slow", labelKo: "느리게" },
      { value: "normal", label: "Normal", labelKo: "보통" },
      { value: "fast", label: "Lively", labelKo: "활발하게" },
    ],
    group: "content",
  },
  {
    key: "bubbles",
    label: "Bubbles",
    labelKo: "공기방울",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "aquarium",
    name: "Aquarium",
    description: "An ambient animated fish tank for your dashboard",
  },
  paramsSchema: aquariumSchema,
  defaultParams: aquariumDefaults,
  component: AquariumWidget,
  controls,
  nameKo: "아쿠아리움",
  descriptionKo: "대시보드를 채우는 잔잔한 물고기 어항 — 물고기가 헤엄치고 공기방울이 올라와요",
  category: "lifestyle",
  recommendedSize: { width: 360, height: 260 },
});
