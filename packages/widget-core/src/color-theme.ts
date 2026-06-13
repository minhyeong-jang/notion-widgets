export interface ModeColors {
  bg: string;
  bgSoft: string;
  surface: string;
  surface2: string;
  inset: string;
  border: string;
  borderSoft: string;
  borderStrong: string;
  track: string;
  text: string;
  textDim: string;
  textFaint: string;
}

export interface AccentColors {
  accent: string;
  accentBright: string;
  accentDeep: string;
  accentDim: string;
  accentTint: string;
  btnText: string;
}

export type ResolvedColors = ModeColors & AccentColors;

const MODES: Record<"dark" | "light", ModeColors> = {
  dark: {
    bg: "100f0d", bgSoft: "15140f", surface: "1a1916", surface2: "201e1a",
    inset: "131210", border: "2a2823", borderSoft: "232119", borderStrong: "3a372f",
    track: "2a2823", text: "f2f0ea", textDim: "a7a399", textFaint: "6f6b60",
  },
  light: {
    bg: "faf9f7", bgSoft: "f1efe9", surface: "ffffff", surface2: "f6f4ef",
    inset: "f3f1ea", border: "e6e3da", borderSoft: "eeebe3", borderStrong: "d6d2c7",
    track: "e4e0d5", text: "1c1917", textDim: "6b665e", textFaint: "9b9489",
  },
};

const ACCENTS: Record<string, { dark: AccentColors; light: AccentColors }> = {
  green: {
    dark: { accent: "7fb686", accentBright: "98cc9f", accentDeep: "52b07a", accentDim: "2c5b3e", accentTint: "7fb68620", btnText: "0e1a10" },
    light: { accent: "4f9e69", accentBright: "3d8556", accentDeep: "52b07a", accentDim: "bfe0c8", accentTint: "4f9e6924", btnText: "ffffff" },
  },
  red: {
    dark: { accent: "ef4444", accentBright: "f87171", accentDeep: "c93636", accentDim: "5e2222", accentTint: "ef444420", btnText: "1a0d0d" },
    light: { accent: "dc2626", accentBright: "b91c1c", accentDeep: "ef4444", accentDim: "f3c4c4", accentTint: "dc262621", btnText: "ffffff" },
  },
  blue: {
    dark: { accent: "3b82f6", accentBright: "60a5fa", accentDeep: "2f68c8", accentDim: "21345e", accentTint: "3b82f620", btnText: "08111f" },
    light: { accent: "2563eb", accentBright: "1d4ed8", accentDeep: "3b82f6", accentDim: "c2d5f7", accentTint: "2563eb20", btnText: "ffffff" },
  },
  ocean: {
    dark: { accent: "06b6d4", accentBright: "38d0ea", accentDeep: "0794ac", accentDim: "134e5a", accentTint: "06b6d420", btnText: "03141a" },
    light: { accent: "0891b2", accentBright: "0e7490", accentDeep: "06b6d4", accentDim: "b6e6ef", accentTint: "0891b221", btnText: "ffffff" },
  },
  sunset: {
    dark: { accent: "f97316", accentBright: "fb923c", accentDeep: "c85e12", accentDim: "5e3216", accentTint: "f9731620", btnText: "1a0d05" },
    light: { accent: "ea580c", accentBright: "c2410c", accentDeep: "f97316", accentDim: "fbd9b8", accentTint: "ea580c21", btnText: "ffffff" },
  },
  purple: {
    dark: { accent: "a855f7", accentBright: "c084fc", accentDeep: "8a3fd4", accentDim: "3b2358", accentTint: "a855f720", btnText: "120819" },
    light: { accent: "9333ea", accentBright: "7e22ce", accentDeep: "a855f7", accentDim: "e3cdf7", accentTint: "9333ea21", btnText: "ffffff" },
  },
};

export const ACCENT_IDS = Object.keys(ACCENTS);

export function resolveColors(accent?: string, mode?: "dark" | "light"): ResolvedColors {
  const m = MODES[mode || "dark"];
  const a = (ACCENTS[accent || "green"] || ACCENTS.green)[mode || "dark"];
  return { ...m, ...a };
}

export function getAllAccents() {
  return ACCENT_IDS.map((id) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
  }));
}

// Backward compat: map old colorTheme values
export function mapLegacyTheme(colorTheme: string): string {
  if (colorTheme === "default" || colorTheme === "forest") return "green";
  if (colorTheme === "light") return "green";
  if (ACCENTS[colorTheme]) return colorTheme;
  return "green";
}
