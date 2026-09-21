import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { QrCodeWidget } from "./widget";
import { qrCodeSchema, qrCodeDefaults } from "./schema";

export { QrCodeWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "data",
    label: "Link / Text",
    labelKo: "링크 / 텍스트",
    type: "text",
    defaultValue: "https://widgets.doriri.dev",
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
    key: "variant",
    label: "Dot Shape",
    labelKo: "도트 모양",
    type: "select",
    defaultValue: "rounded",
    options: [
      { value: "rounded", label: "Rounded", labelKo: "라운드" },
      { value: "square", label: "Square", labelKo: "사각" },
      { value: "dots", label: "Dots", labelKo: "원형" },
    ],
    group: "appearance",
  },
  {
    key: "ecLevel",
    label: "Error Correction",
    labelKo: "오류 보정",
    type: "select",
    defaultValue: "M",
    options: [
      { value: "L", label: "Low" },
      { value: "M", label: "Medium" },
      { value: "Q", label: "Quartile" },
      { value: "H", label: "High" },
    ],
    group: "advanced",
  },
];

registerWidget({
  meta: {
    id: "qr-code",
    name: "QR Code",
    description: "Turn any link into a scannable QR code for your Notion page",
  },
  paramsSchema: qrCodeSchema,
  defaultParams: qrCodeDefaults,
  component: QrCodeWidget,
  controls,
  nameKo: "QR 코드",
  descriptionKo: "링크를 스캔 가능한 QR 코드로 — 노션에서 바로 연결",
  category: "utility",
  recommendedSize: { width: 320, height: 340 },
});
