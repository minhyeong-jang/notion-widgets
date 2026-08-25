import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { PhotoWidget } from "./widget";
import { photoSchema, photoDefaults } from "./schema";

export { PhotoWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "polaroid",
    options: [
      { value: "polaroid", label: "Polaroid", labelKo: "폴라로이드" },
      { value: "film", label: "Film", labelKo: "필름" },
      { value: "frame", label: "Frame", labelKo: "액자" },
    ],
    group: "appearance",
  },
  {
    key: "src",
    label: "Image URL",
    labelKo: "이미지 URL",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "caption",
    label: "Caption",
    labelKo: "캡션",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "tilt",
    label: "Tilt",
    labelKo: "기울기",
    type: "select",
    defaultValue: "none",
    options: [
      { value: "none", label: "None", labelKo: "없음" },
      { value: "left", label: "Left", labelKo: "왼쪽" },
      { value: "right", label: "Right", labelKo: "오른쪽" },
    ],
    group: "appearance",
  },
  {
    key: "fit",
    label: "Fit",
    labelKo: "맞춤",
    type: "select",
    defaultValue: "cover",
    options: [
      { value: "cover", label: "Cover", labelKo: "채우기" },
      { value: "contain", label: "Contain", labelKo: "맞추기" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "photo",
    name: "Photo Frame",
    description: "Turn any image URL into a polaroid, film, or framed photo",
  },
  paramsSchema: photoSchema,
  defaultParams: photoDefaults,
  component: PhotoWidget,
  controls,
  nameKo: "포토 프레임",
  descriptionKo: "이미지 URL을 폴라로이드·필름·액자 사진으로 — 캡션과 기울기까지",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 340 },
});
