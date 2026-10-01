import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { ProfileCardWidget } from "./widget";
import { profileCardSchema, profileCardDefaults } from "./schema";

export { ProfileCardWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "형태",
    type: "select",
    defaultValue: "card",
    options: [
      { value: "card", label: "Card", labelKo: "카드" },
      { value: "banner", label: "Banner", labelKo: "배너" },
    ],
    group: "appearance",
  },
  {
    key: "name",
    label: "Name",
    labelKo: "이름",
    type: "text",
    defaultValue: "Doriri",
    group: "content",
  },
  {
    key: "tagline",
    label: "Tagline",
    labelKo: "소개 문구",
    type: "text",
    defaultValue: "Maker of delightful web things",
    group: "content",
  },
  {
    key: "avatar",
    label: "Avatar (emoji)",
    labelKo: "아바타 (이모지)",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "github",
    label: "GitHub",
    labelKo: "깃허브",
    type: "text",
    defaultValue: "doriri",
    group: "content",
  },
  {
    key: "x",
    label: "X (Twitter)",
    labelKo: "X (트위터)",
    type: "text",
    defaultValue: "doriri",
    group: "content",
  },
  {
    key: "instagram",
    label: "Instagram",
    labelKo: "인스타그램",
    type: "text",
    defaultValue: "doriri",
    group: "content",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    labelKo: "링크드인",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "email",
    label: "Email",
    labelKo: "이메일",
    type: "text",
    defaultValue: "",
    group: "content",
  },
  {
    key: "website",
    label: "Website",
    labelKo: "웹사이트",
    type: "text",
    defaultValue: "widgets.doriri.dev",
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "profile-card",
    name: "Profile Card",
    description: "A link-in-bio identity card with social buttons — introduce yourself in Notion",
  },
  paramsSchema: profileCardSchema,
  defaultParams: profileCardDefaults,
  component: ProfileCardWidget,
  controls,
  nameKo: "프로필 카드",
  descriptionKo: "소셜 버튼이 있는 링크인바이오 카드 — 노션에서 나를 소개하세요",
  category: "utility",
  recommendedSize: { width: 360, height: 300 },
});
