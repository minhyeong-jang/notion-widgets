import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl, localeControl } from "@nw/widget-core";
import { SavingsGoalWidget } from "./widget";
import { savingsGoalSchema, savingsGoalDefaults } from "./schema";

export { SavingsGoalWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "jar",
    options: [
      { value: "jar", label: "Jar", labelKo: "저금통" },
      { value: "coins", label: "Coins", labelKo: "동전" },
      { value: "card", label: "Card", labelKo: "카드" },
    ],
    group: "appearance",
  },
  {
    key: "label",
    label: "Label",
    labelKo: "라벨",
    type: "text",
    defaultValue: "Savings",
    group: "content",
  },
  {
    key: "goal",
    label: "Goal Amount",
    labelKo: "목표 금액",
    type: "text",
    defaultValue: "1000",
    group: "content",
  },
  {
    key: "deposit",
    label: "Deposit Step",
    labelKo: "1회 저금액",
    type: "text",
    defaultValue: "50",
    group: "content",
  },
  {
    key: "currency",
    label: "Currency",
    labelKo: "통화",
    type: "select",
    defaultValue: "USD",
    options: [
      { value: "USD", label: "$ USD" },
      { value: "KRW", label: "₩ KRW" },
      { value: "EUR", label: "€ EUR" },
      { value: "JPY", label: "¥ JPY" },
      { value: "GBP", label: "£ GBP" },
    ],
    group: "content",
  },
  {
    key: "period",
    label: "Reset",
    labelKo: "초기화 주기",
    type: "select",
    defaultValue: "persist",
    options: [
      { value: "persist", label: "Never", labelKo: "안 함" },
      { value: "weekly", label: "Weekly", labelKo: "매주" },
      { value: "daily", label: "Daily", labelKo: "매일" },
    ],
    group: "content",
  },
  localeControl,
];

registerWidget({
  meta: {
    id: "savings-goal",
    name: "Savings Goal",
    description: "Save toward a money goal with a tap — a coin jar that fills up, saved on your device",
  },
  paramsSchema: savingsGoalSchema,
  defaultParams: savingsGoalDefaults,
  component: SavingsGoalWidget,
  controls,
  nameKo: "저금통",
  descriptionKo: "목표 금액까지 톡톡 저금 — 동전이 차오르는 저금통, 기기에 자동 저장",
  category: "lifestyle",
  recommendedSize: { width: 300, height: 360 },
});
