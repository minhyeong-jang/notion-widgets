import { resolveThemeVariables } from "./theme";

export interface WidgetColors {
  bg: string;
  text: string;
  accent: string;
  border: string;
  radius: string;
}

/**
 * Resolve widget colors from theme or individual params.
 * When theme is "custom" (default), uses params.color/bg directly.
 * Otherwise, applies the named theme's predefined palette.
 */
export function resolveColors(params: {
  theme?: string;
  color?: string;
  bg?: string;
}): WidgetColors {
  if (params.theme && params.theme !== "custom") {
    const vars = resolveThemeVariables(params.theme);
    return {
      bg: vars["--widget-bg"],
      text: vars["--widget-text"],
      accent: vars["--widget-accent"],
      border: vars["--widget-border"],
      radius: vars["--widget-radius"],
    };
  }

  const bg = params.bg === "transparent" ? "transparent" : `#${params.bg || "18181b"}`;

  return {
    bg,
    text: "#fafafa",
    accent: `#${params.color || "7fb686"}`,
    border: "#27272a",
    radius: "12px",
  };
}
