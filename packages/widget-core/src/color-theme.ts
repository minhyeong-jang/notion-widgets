export interface ColorTheme {
  id: string;
  name: string;
  nameKo: string;
  colors: {
    accent: string; // hex without #
    bg: string;
    text: string;
    border: string;
  };
}

const colorThemes: ColorTheme[] = [
  {
    id: "default",
    name: "Default",
    nameKo: "기본",
    colors: { accent: "7fb686", bg: "18181b", text: "fafafa", border: "27272a" },
  },
  {
    id: "red",
    name: "Red",
    nameKo: "레드",
    colors: { accent: "ef4444", bg: "18181b", text: "fafafa", border: "27272a" },
  },
  {
    id: "blue",
    name: "Blue",
    nameKo: "블루",
    colors: { accent: "3b82f6", bg: "18181b", text: "fafafa", border: "27272a" },
  },
  {
    id: "ocean",
    name: "Ocean",
    nameKo: "오션",
    colors: { accent: "06b6d4", bg: "0c1222", text: "e0f2fe", border: "164e63" },
  },
  {
    id: "forest",
    name: "Forest",
    nameKo: "포레스트",
    colors: { accent: "7fb686", bg: "18181b", text: "fafafa", border: "27272a" },
  },
  {
    id: "sunset",
    name: "Sunset",
    nameKo: "선셋",
    colors: { accent: "f97316", bg: "1c1210", text: "fff7ed", border: "7c2d12" },
  },
  {
    id: "purple",
    name: "Purple",
    nameKo: "퍼플",
    colors: { accent: "a855f7", bg: "13091f", text: "f5f3ff", border: "3b0764" },
  },
  {
    id: "light",
    name: "Light",
    nameKo: "라이트",
    colors: { accent: "7fb686", bg: "fafaf9", text: "1c1917", border: "e7e5e4" },
  },
];

const colorThemeMap = new Map(colorThemes.map((t) => [t.id, t]));

export function getColorTheme(id: string): ColorTheme | undefined {
  return colorThemeMap.get(id);
}

export function getAllColorThemes(): ColorTheme[] {
  return [...colorThemes];
}

export const COLOR_THEME_OPTIONS = colorThemes.map((t) => ({
  value: t.id,
  label: t.name,
}));
