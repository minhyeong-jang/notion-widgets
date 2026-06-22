export interface StyleDesign {
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
  bgColorKey?: "bg" | "surface" | "surface2";
  contentCard?: boolean;
}

const styles: StyleDesign[] = [
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
  },
  {
    id: "neon",
    name: "Neon",
    nameKo: "네온",
    isPremium: true,
    fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
    borderRadius: "4px",
    borderWidth: "1px",
    boxShadow: "0 0 20px rgba(255,0,255,0.15)",
    textShadow: "0 0 10px currentColor, 0 0 30px currentColor",
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
    contentCard: true,
  },
];

const styleMap = new Map(styles.map((s) => [s.id, s]));

const fallback = styleMap.get("minimal")!;

export function getStyleDesign(id: string): StyleDesign {
  return styleMap.get(id) ?? fallback;
}

export function getAllStyles(): StyleDesign[] {
  return [...styles];
}

export function getFreeStyles(): StyleDesign[] {
  return styles.filter((s) => !s.isPremium);
}

/** @deprecated Use getStyleDesign instead */
export const getThemeDesign = getStyleDesign;
/** @deprecated Use getAllStyles instead */
export const getAllThemes = getAllStyles;
/** @deprecated Use getFreeStyles instead */
export const getFreeThemes = getFreeStyles;
/** @deprecated Use StyleDesign instead */
export type ThemeDesign = StyleDesign;
