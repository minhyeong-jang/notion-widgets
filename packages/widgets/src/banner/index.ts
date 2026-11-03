import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { BannerWidget } from "./widget";
import { bannerSchema, bannerDefaults } from "./schema";

export { BannerWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "banner",
    options: [
      { value: "banner", label: "Banner", labelKo: "배너" },
      { value: "marquee", label: "Marquee", labelKo: "흐르는 글씨" },
      { value: "sign", label: "Sign", labelKo: "사인보드" },
    ],
    group: "appearance",
  },
  {
    key: "text",
    label: "Text",
    labelKo: "텍스트",
    type: "text",
    defaultValue: "Make it happen",
    group: "content",
  },
  {
    key: "subtitle",
    label: "Subtitle",
    labelKo: "부제목",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "size",
    label: "Size",
    labelKo: "크기",
    type: "select",
    defaultValue: "md",
    options: [
      { value: "sm", label: "Small", labelKo: "작게" },
      { value: "md", label: "Medium", labelKo: "보통" },
      { value: "lg", label: "Large", labelKo: "크게" },
    ],
    group: "content",
  },
  {
    key: "speed",
    label: "Marquee speed",
    labelKo: "흐름 속도",
    type: "select",
    defaultValue: "normal",
    options: [
      { value: "slow", label: "Slow", labelKo: "느리게" },
      { value: "normal", label: "Normal", labelKo: "보통" },
      { value: "fast", label: "Fast", labelKo: "빠르게" },
    ],
    group: "content",
  },
  {
    key: "caps",
    label: "Uppercase",
    labelKo: "대문자",
    type: "toggle",
    defaultValue: false,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "banner",
    name: "Banner & Sign",
    description: "Show your own text as a bold headline, scrolling marquee, or neon sign",
  },
  paramsSchema: bannerSchema,
  defaultParams: bannerDefaults,
  component: BannerWidget,
  controls,
  nameKo: "배너 & 사인",
  descriptionKo: "원하는 문구를 헤드라인, 흐르는 글씨, 네온 사인으로 표시",
  category: "lifestyle",
  recommendedSize: { width: 420, height: 180 },
});
