import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { ColorPaletteWidget } from "./widget";
import { colorPaletteSchema, colorPaletteDefaults } from "./schema";

export { ColorPaletteWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "stack",
    options: [
      { value: "stack", label: "Stack", labelKo: "스택" },
      { value: "cards", label: "Cards", labelKo: "카드" },
      { value: "gradient", label: "Gradient", labelKo: "그라데이션" },
    ],
    group: "appearance",
  },
  {
    key: "harmony",
    label: "Harmony",
    labelKo: "배색",
    type: "select",
    defaultValue: "analogous",
    options: [
      { value: "analogous", label: "Analogous", labelKo: "유사색" },
      { value: "monochrome", label: "Monochrome", labelKo: "단색" },
      { value: "complementary", label: "Complementary", labelKo: "보색" },
      { value: "triad", label: "Triad", labelKo: "삼색" },
    ],
    group: "content",
  },
  {
    key: "count",
    label: "Colors",
    labelKo: "색상 수",
    type: "select",
    defaultValue: "5",
    options: [
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
    ],
    group: "content",
  },
  {
    key: "mode",
    label: "Mode",
    labelKo: "모드",
    type: "select",
    defaultValue: "daily",
    options: [
      { value: "daily", label: "Daily", labelKo: "매일" },
      { value: "random", label: "Random", labelKo: "랜덤" },
    ],
    group: "content",
  },
  {
    key: "showHex",
    label: "Show Hex",
    labelKo: "HEX 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "color-palette",
    name: "Color Palette",
    description: "A harmonious color palette generated from your accent color",
  },
  paramsSchema: colorPaletteSchema,
  defaultParams: colorPaletteDefaults,
  component: ColorPaletteWidget,
  controls,
  nameKo: "컬러 팔레트",
  descriptionKo: "강조 색상에서 생성되는 조화로운 컬러 팔레트",
  category: "lifestyle",
  recommendedSize: { width: 380, height: 240 },
});
