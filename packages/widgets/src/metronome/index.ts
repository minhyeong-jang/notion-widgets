import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { MetronomeWidget } from "./widget";
import { metronomeSchema, metronomeDefaults } from "./schema";

export { MetronomeWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "pendulum",
    options: [
      { value: "pendulum", label: "Pendulum", labelKo: "진자" },
      { value: "pulse", label: "Pulse", labelKo: "펄스" },
    ],
    group: "appearance",
  },
  {
    key: "bpm",
    label: "Tempo (BPM)",
    labelKo: "빠르기 (BPM)",
    type: "select",
    defaultValue: "120",
    options: [
      { value: "50", label: "50 · Largo" },
      { value: "70", label: "70 · Adagio" },
      { value: "90", label: "90 · Andante" },
      { value: "110", label: "110 · Moderato" },
      { value: "120", label: "120 · Moderato" },
      { value: "140", label: "140 · Allegro" },
      { value: "160", label: "160 · Vivace" },
      { value: "180", label: "180 · Presto" },
    ],
    group: "content",
  },
  {
    key: "beats",
    label: "Beats per bar",
    labelKo: "박자 수",
    type: "select",
    defaultValue: "4",
    options: [
      { value: "2", label: "2/4" },
      { value: "3", label: "3/4" },
      { value: "4", label: "4/4" },
      { value: "6", label: "6/4" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "metronome",
    name: "Metronome",
    description: "Visual metronome with a pendulum swinging at your tempo",
  },
  paramsSchema: metronomeSchema,
  defaultParams: metronomeDefaults,
  component: MetronomeWidget,
  controls,
  nameKo: "메트로놈",
  descriptionKo: "설정한 빠르기로 진자가 움직이는 비주얼 메트로놈",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 340 },
});
