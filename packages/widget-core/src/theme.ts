export interface ThemeVariables {
  "--widget-bg": string;
  "--widget-text": string;
  "--widget-accent": string;
  "--widget-border": string;
  "--widget-radius": string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  nameKo: string;
  isPremium: boolean;
  variables: ThemeVariables;
}

const themes: ThemeDefinition[] = [
  {
    id: "default",
    name: "Default",
    nameKo: "기본",
    isPremium: false,
    variables: {
      "--widget-bg": "#18181b",
      "--widget-text": "#fafafa",
      "--widget-accent": "#7fb686",
      "--widget-border": "#27272a",
      "--widget-radius": "12px",
    },
  },
  {
    id: "light",
    name: "Light",
    nameKo: "라이트",
    isPremium: false,
    variables: {
      "--widget-bg": "#f8f9fa",
      "--widget-text": "#1a1a1a",
      "--widget-accent": "#6c757d",
      "--widget-border": "#dee2e6",
      "--widget-radius": "12px",
    },
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    nameKo: "글래스모피즘",
    isPremium: true,
    variables: {
      "--widget-bg": "rgba(255, 255, 255, 0.1)",
      "--widget-text": "#ffffff",
      "--widget-accent": "#a78bfa",
      "--widget-border": "rgba(255, 255, 255, 0.2)",
      "--widget-radius": "16px",
    },
  },
  {
    id: "retro",
    name: "Retro Terminal",
    nameKo: "레트로 터미널",
    isPremium: true,
    variables: {
      "--widget-bg": "#0a0a0a",
      "--widget-text": "#33ff33",
      "--widget-accent": "#ffb000",
      "--widget-border": "#33ff33",
      "--widget-radius": "4px",
    },
  },
  {
    id: "neon",
    name: "Neon Glow",
    nameKo: "네온 글로우",
    isPremium: true,
    variables: {
      "--widget-bg": "#0d0d0d",
      "--widget-text": "#ffffff",
      "--widget-accent": "#ff00ff",
      "--widget-border": "#ff00ff",
      "--widget-radius": "12px",
    },
  },
];

const themeMap = new Map(themes.map((t) => [t.id, t]));

export function getTheme(id: string): ThemeDefinition | undefined {
  return themeMap.get(id);
}

export function getAllThemes(): ThemeDefinition[] {
  return [...themes];
}

export function getFreeThemes(): ThemeDefinition[] {
  return themes.filter((t) => !t.isPremium);
}

export function resolveThemeVariables(themeId: string): ThemeVariables {
  const theme = themeMap.get(themeId);
  if (theme) return theme.variables;
  return themeMap.get("default")!.variables;
}
