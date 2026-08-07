import type { ControlDefinition } from "@nw/widget-core";
import {
  registerWidget,
  styleControl,
  colorThemeControl,
} from "@nw/widget-core";
import { StickyNoteWidget } from "./widget";
import { stickyNoteSchema, stickyNoteDefaults } from "./schema";

export { StickyNoteWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Decoration",
    labelKo: "장식",
    type: "select",
    defaultValue: "tape",
    options: [
      { value: "tape", label: "Tape", labelKo: "테이프" },
      { value: "pin", label: "Pin", labelKo: "핀" },
      { value: "bar", label: "Accent bar", labelKo: "액센트 바" },
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
    key: "text",
    label: "Note (use | or \\n for new lines)",
    labelKo: "메모 (줄바꿈은 | 또는 \\n)",
    type: "text",
    defaultValue: stickyNoteDefaults.text,
    group: "content",
  },
  {
    key: "align",
    label: "Align",
    labelKo: "정렬",
    type: "select",
    defaultValue: "left",
    options: [
      { value: "left", label: "Left", labelKo: "왼쪽" },
      { value: "center", label: "Center", labelKo: "가운데" },
    ],
    group: "appearance",
  },
  {
    key: "fontSize",
    label: "Font Size",
    labelKo: "글자 크기",
    type: "select",
    defaultValue: "md",
    options: [
      { value: "sm", label: "Small", labelKo: "작게" },
      { value: "md", label: "Medium", labelKo: "보통" },
      { value: "lg", label: "Large", labelKo: "크게" },
    ],
    group: "appearance",
  },
];

registerWidget({
  meta: {
    id: "sticky-note",
    name: "Sticky Note",
    description: "A customizable pinned memo for your own reminders",
  },
  paramsSchema: stickyNoteSchema,
  defaultParams: stickyNoteDefaults,
  component: StickyNoteWidget,
  controls,
  nameKo: "스티키 노트",
  descriptionKo: "URL 하나로 완성하는 나만의 메모·리마인더 위젯",
  category: "lifestyle",
  recommendedSize: { width: 320, height: 240 },
});
