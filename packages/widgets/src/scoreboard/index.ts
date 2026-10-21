import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { ScoreboardWidget } from "./widget";
import { scoreboardSchema, scoreboardDefaults } from "./schema";

export { ScoreboardWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "versus",
    options: [
      { value: "versus", label: "Versus", labelKo: "대결" },
      { value: "stack", label: "Stacked", labelKo: "세로" },
      { value: "minimal", label: "Minimal", labelKo: "미니멀" },
    ],
    group: "appearance",
  },
  {
    key: "team1",
    label: "Team 1 name",
    labelKo: "팀 1 이름",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "team2",
    label: "Team 2 name",
    labelKo: "팀 2 이름",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "step",
    label: "Points per tap",
    labelKo: "탭당 점수",
    type: "select",
    defaultValue: "1",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "5", label: "5" },
    ],
    group: "content",
  },
  {
    key: "target",
    label: "Win target (0 = off)",
    labelKo: "승리 점수 (0 = 끄기)",
    type: "text",
    defaultValue: "0",
    group: "content",
  },
  {
    key: "boardId",
    label: "Board ID",
    labelKo: "보드 ID",
    type: "text",
    defaultValue: "default",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "scoreboard",
    name: "Scoreboard",
    description: "Two-team tap scoreboard that keeps score across reloads",
  },
  paramsSchema: scoreboardSchema,
  defaultParams: scoreboardDefaults,
  component: ScoreboardWidget,
  controls,
  nameKo: "점수판",
  descriptionKo: "탭으로 두 팀 점수를 매기고, 새로고침해도 유지되는 점수판",
  category: "utility",
  recommendedSize: { width: 380, height: 260 },
});
