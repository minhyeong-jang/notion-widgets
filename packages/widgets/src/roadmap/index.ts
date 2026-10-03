import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { RoadmapWidget } from "./widget";
import { roadmapSchema, roadmapDefaults } from "./schema";

export { RoadmapWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "형태",
    type: "select",
    defaultValue: "steps",
    options: [
      { value: "steps", label: "Steps", labelKo: "가로 단계" },
      { value: "vertical", label: "Timeline", labelKo: "세로 타임라인" },
      { value: "bar", label: "Progress Bar", labelKo: "진행 바" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "steps",
    label: "Stages (A|B|C)",
    labelKo: "단계 (A|B|C)",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "current",
    label: "Current Stage",
    labelKo: "현재 단계",
    type: "text",
    defaultValue: "2",
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "roadmap",
    name: "Roadmap",
    description: "Visualize progress through sequential project stages",
  },
  paramsSchema: roadmapSchema,
  defaultParams: roadmapDefaults,
  component: RoadmapWidget,
  controls,
  nameKo: "로드맵",
  descriptionKo: "프로젝트의 진행 단계를 타임라인·진행 바로 보여주는 위젯",
  category: "productivity",
  recommendedSize: { width: 400, height: 220 },
});
