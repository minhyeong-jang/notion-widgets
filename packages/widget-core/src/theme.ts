export interface ThemeDesign {
  id: string;
  name: string;
  nameKo: string;
  isPremium: boolean;
  // Design properties
  fontFamily: string;
  borderRadius: string;
  borderWidth: string;
  boxShadow: string;
  textShadow: string;
  bgOverlay?: string;
  backdropFilter?: string;
  bgOpacity?: number;
  // Recommended colors (hex without #)
  recommendedColors: {
    accent: string;
    bg: string;
    text: string;
    border: string;
  };
}

const themes: ThemeDesign[] = [
  {
    id: "minimal",
    name: "Minimal",
    nameKo: "미니멀",
    isPremium: false,
    fontFamily: "inherit",
    borderRadius: "12px",
    borderWidth: "1px",
    boxShadow: "none",
    textShadow: "none",
    recommendedColors: {
      accent: "7fb686",
      bg: "18181b",
      text: "fafafa",
      border: "27272a",
    },
  },
  {
    id: "soft",
    name: "Soft",
    nameKo: "소프트",
    isPremium: false,
    fontFamily: "inherit",
    borderRadius: "16px",
    borderWidth: "1px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
    textShadow: "none",
    recommendedColors: {
      accent: "7fb686",
      bg: "fafaf9",
      text: "1c1917",
      border: "e7e5e4",
    },
  },
  {
    id: "retro",
    name: "Retro",
    nameKo: "레트로",
    isPremium: true,
    fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
    borderRadius: "2px",
    borderWidth: "1px",
    boxShadow: "0 0 12px rgba(51,255,51,0.1)",
    textShadow: "0 0 8px currentColor",
    bgOverlay:
      "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
    recommendedColors: {
      accent: "33ff33",
      bg: "0a0a0a",
      text: "33ff33",
      border: "33ff33",
    },
  },
  {
    id: "neon",
    name: "Neon",
    nameKo: "네온",
    isPremium: true,
    fontFamily: "inherit",
    borderRadius: "12px",
    borderWidth: "1px",
    boxShadow: "0 0 30px rgba(255,0,255,0.15)",
    textShadow: "0 0 10px currentColor, 0 0 30px currentColor",
    recommendedColors: {
      accent: "ff00ff",
      bg: "0d0d0d",
      text: "ffffff",
      border: "ff00ff",
    },
  },
  {
    id: "glass",
    name: "Glass",
    nameKo: "글래스",
    isPremium: true,
    fontFamily: "inherit",
    borderRadius: "16px",
    borderWidth: "1px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    textShadow: "none",
    backdropFilter: "blur(12px) saturate(180%)",
    bgOpacity: 0.12,
    recommendedColors: {
      accent: "a78bfa",
      bg: "1a1a2e",
      text: "ffffff",
      border: "ffffff",
    },
  },
];

const themeMap = new Map(themes.map((t) => [t.id, t]));

const fallback = themeMap.get("minimal")!;

export function getThemeDesign(id: string): ThemeDesign {
  return themeMap.get(id) ?? fallback;
}

export function getAllThemes(): ThemeDesign[] {
  return [...themes];
}

export function getFreeThemes(): ThemeDesign[] {
  return themes.filter((t) => !t.isPremium);
}
