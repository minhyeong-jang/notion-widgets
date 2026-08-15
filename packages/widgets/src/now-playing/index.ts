import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { NowPlayingWidget } from "./widget";
import { nowPlayingSchema, nowPlayingDefaults } from "./schema";

export { NowPlayingWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Player",
    labelKo: "플레이어",
    type: "select",
    defaultValue: "vinyl",
    options: [
      { value: "vinyl", label: "Vinyl", labelKo: "바이닐" },
      { value: "cd", label: "CD", labelKo: "CD" },
      { value: "cassette", label: "Cassette", labelKo: "카세트" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Song",
    labelKo: "곡 제목",
    type: "text",
    defaultValue: "Good Days",
    group: "content",
  },
  {
    key: "artist",
    label: "Artist",
    labelKo: "아티스트",
    type: "text",
    defaultValue: "SZA",
    group: "content",
  },
  {
    key: "progress",
    label: "Progress",
    labelKo: "재생 위치",
    type: "slider",
    defaultValue: "35",
    group: "content",
  },
  {
    key: "spin",
    label: "Animate",
    labelKo: "애니메이션",
    type: "toggle",
    defaultValue: "true",
    group: "appearance",
  },
];

registerWidget({
  meta: {
    id: "now-playing",
    name: "Now Playing",
    description: "An aesthetic music player showing your current song",
  },
  paramsSchema: nowPlayingSchema,
  defaultParams: nowPlayingDefaults,
  component: NowPlayingWidget,
  controls,
  nameKo: "나우 플레잉",
  descriptionKo: "지금 듣는 음악을 보여주는 감성 뮤직 위젯",
  category: "lifestyle",
  recommendedSize: { width: 460, height: 200 },
});
