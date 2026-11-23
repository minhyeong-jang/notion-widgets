import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, localeControl, styleControl, colorThemeControl } from "@nw/widget-core";
import { ChessClockWidget } from "./widget";
import { chessClockSchema, chessClockDefaults } from "./schema";

export { ChessClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "split",
    options: [
      { value: "split", label: "Side by side", labelKo: "좌우 분할" },
      { value: "stacked", label: "Face to face", labelKo: "마주보기" },
      { value: "bars", label: "Compact bars", labelKo: "컴팩트 바" },
    ],
    group: "appearance",
  },
  {
    key: "minutes",
    label: "Time per side",
    labelKo: "진영별 시간",
    type: "select",
    defaultValue: "5",
    options: [
      { value: "1", label: "1 min · Bullet" },
      { value: "3", label: "3 min · Blitz" },
      { value: "5", label: "5 min · Blitz" },
      { value: "10", label: "10 min · Rapid" },
      { value: "15", label: "15 min · Rapid" },
      { value: "30", label: "30 min · Classic" },
    ],
    group: "content",
  },
  {
    key: "increment",
    label: "Increment (Fischer)",
    labelKo: "증가 시간 (피셔)",
    type: "select",
    defaultValue: "0",
    options: [
      { value: "0", label: "None" },
      { value: "2", label: "+2 sec / move" },
      { value: "3", label: "+3 sec / move" },
      { value: "5", label: "+5 sec / move" },
      { value: "10", label: "+10 sec / move" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "chess-clock",
    name: "Chess Clock",
    description: "A two-player game clock for chess, board games, and timed debates",
  },
  paramsSchema: chessClockSchema,
  defaultParams: chessClockDefaults,
  component: ChessClockWidget,
  controls,
  nameKo: "체스 시계",
  descriptionKo: "체스·보드게임·토론용 2인 대국 시계 (피셔 증가 지원)",
  category: "utility",
  recommendedSize: { width: 420, height: 300 },
});
