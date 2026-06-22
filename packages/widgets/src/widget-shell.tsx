"use client";

import type { ReactNode, CSSProperties } from "react";
import { getStyleDesign, resolveColors } from "@nw/widget-core";
import { useWidgetColorMode } from "./color-mode-context";

interface WidgetShellProps {
  params: { style?: string; accent?: string };
  mode?: "dark" | "light";
  children: ReactNode;
  className?: string;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function WidgetShell({ params, mode: modeProp, children, className }: WidgetShellProps) {
  const contextMode = useWidgetColorMode();
  const mode = modeProp || contextMode;
  const design = getStyleDesign(params.style || "minimal");
  const colors = resolveColors(params.accent, mode);
  const bgKey = design.bgColorKey || "bg";
  const bgHex = colors[bgKey];
  const isTransparent = bgHex === "transparent";

  let bgColor: string | undefined;
  if (design.contentCard) {
    bgColor = `#${colors.bg}`;
  } else if (isTransparent) {
    bgColor = undefined;
  } else if (design.bgOpacity !== undefined) {
    bgColor = hexToRgba(bgHex.slice(0, 6), design.bgOpacity);
  } else {
    bgColor = `#${bgHex}`;
  }

  const rootStyle: CSSProperties = {
    backgroundColor: bgColor,
    fontFamily: design.fontFamily,
  };

  if (!design.contentCard && design.backdropFilter) {
    rootStyle.backdropFilter = design.backdropFilter;
    rootStyle.WebkitBackdropFilter = design.backdropFilter;
  }

  const innerStyle: CSSProperties = {
    "--w-text-shadow": design.textShadow,
    "--w-box-shadow": design.boxShadow,
    "--w-radius": design.borderRadius,
    "--w-border-width": design.borderWidth,
  } as CSSProperties;

  const isDark = mode === "dark";
  const accentHex = colors.accent;
  const isGlass = design.id === "glass";

  let cardStyle: CSSProperties | undefined;
  if (design.contentCard && isGlass) {
    cardStyle = {
      backgroundColor: isDark
        ? `rgba(255,255,255,0.06)`
        : `rgba(255,255,255,0.65)`,
      border: `1px solid ${isDark ? `rgba(255,255,255,0.1)` : hexToRgba(accentHex, 0.12)}`,
      borderRadius: 20,
      padding: "28px 24px",
      backdropFilter: "blur(16px) saturate(180%)",
      WebkitBackdropFilter: "blur(16px) saturate(180%)",
      boxShadow: isDark
        ? `0 8px 32px rgba(0,0,0,0.3)`
        : `0 8px 32px rgba(0,0,0,0.06)`,
      maxWidth: 440,
      width: "100%",
    };
  } else if (design.contentCard) {
    cardStyle = {
      backgroundColor: isDark
        ? `#${colors.surface2}`
        : `#ffffff`,
      border: `1px solid #${isDark ? colors.borderSoft : colors.border}`,
      borderRadius: 20,
      padding: "28px 24px",
      boxShadow: isDark
        ? `0 2px 16px rgba(0,0,0,0.2)`
        : `0 2px 20px rgba(0,0,0,0.06)`,
      maxWidth: 440,
      width: "100%",
    };
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full relative overflow-hidden ${isTransparent ? "bg-transparent" : ""} ${className || ""}`}
      style={rootStyle}
    >
      {design.bgOverlay && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ backgroundImage: design.bgOverlay }}
        />
      )}
      <div className="relative z-[2] w-full flex items-center justify-center" style={innerStyle}>
        {cardStyle ? (
          <div style={cardStyle}>{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
