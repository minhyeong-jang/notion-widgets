import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
  localeControl,
} from "@nw/widget-core";
import { TimelineWidget } from "./widget";
import { timelineSchema, timelineDefaults } from "./schema";

export { TimelineWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "vertical",
    options: [
      { value: "vertical", label: "Vertical", labelKo: "세로" },
      { value: "horizontal", label: "Horizontal", labelKo: "가로" },
      { value: "compact", label: "Compact", labelKo: "컴팩트" },
    ],
    group: "appearance",
  },
  {
    key: "title",
    label: "Title",
    labelKo: "제목",
    type: "text",
    defaultValue: "Roadmap",
    group: "content",
  },
  {
    key: "items",
    label: "Steps (label::date::status, separate with |)",
    labelKo: "단계 (label::날짜::상태, | 로 구분)",
    type: "text",
    defaultValue:
      "Research::Q1::done|Design::Q2::done|Build::Q3::active|Launch::Q4::upcoming",
    group: "content",
  },
  localeControl,
  {
    key: "showDate",
    label: "Show Date",
    labelKo: "날짜 표시",
    type: "toggle",
    defaultValue: "true",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "timeline",
    name: "Timeline",
    description:
      "A roadmap of milestones with done, active, and upcoming steps",
  },
  paramsSchema: timelineSchema,
  defaultParams: timelineDefaults,
  component: TimelineWidget,
  controls,
  nameKo: "타임라인",
  descriptionKo: "완료·진행·예정 단계로 보여주는 프로젝트 로드맵",
  category: "productivity",
  recommendedSize: { width: 360, height: 320 },
});
