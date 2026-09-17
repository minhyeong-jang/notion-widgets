import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { FlashcardWidget } from "./widget";
import { flashcardSchema, flashcardDefaults } from "./schema";

export { FlashcardWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Layout",
    labelKo: "레이아웃",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Flip card", labelKo: "뒤집기 카드" },
      { value: "quiz", label: "Quiz", labelKo: "퀴즈" },
      { value: "list", label: "List", labelKo: "리스트" },
    ],
    group: "appearance",
  },
  {
    key: "deck",
    label: "Deck name",
    labelKo: "덱 이름",
    type: "text",
    defaultValue: flashcardDefaults.deck,
    group: "content",
  },
  {
    key: "cards",
    label: "Cards (front~back, separate with |)",
    labelKo: "카드 (앞면~뒷면, | 로 구분)",
    type: "text",
    defaultValue: flashcardDefaults.cards,
    group: "content",
  },
  localeControl,
  {
    key: "showCounter",
    label: "Show counter",
    labelKo: "카운터 표시",
    type: "toggle",
    defaultValue: true,
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "flashcard",
    name: "Flashcard",
    description: "Tap-to-flip study flashcards for any subject",
  },
  paramsSchema: flashcardSchema,
  defaultParams: flashcardDefaults,
  component: FlashcardWidget,
  controls,
  nameKo: "플래시카드",
  descriptionKo: "탭하면 뒤집히는 학습용 플래시카드 — 노션 공부 페이지에 바로 임베드",
  category: "productivity",
  recommendedSize: { width: 380, height: 300 },
});
