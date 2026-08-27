"use client";

import type { ReactNode, CSSProperties } from "react";
import { getStyleDesign, resolveColors } from "@nw/widget-core";
import { useWidgetColorMode } from "./color-mode-context";

interface WidgetShellProps {
  params: { style?: string; accent?: string };
  mode?: "dark" | "light";
  children: ReactNode;
  className?: string;
  /**
   * When true, skip the style's content-card wrapper (soft/glass) but keep the
   * background, overlays, and glass glow. Use for variants that render their
   * own self-contained card and would otherwise nest card-in-card.
   */
  bare?: boolean;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function WidgetShell({ params, mode: modeProp, children, className, bare }: WidgetShellProps) {
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

  const useCard = !!design.contentCard && !bare;
  let cardStyle: CSSProperties | undefined;
  if (useCard && isGlass) {
    cardStyle = {
      backgroundColor: isDark
        ? `rgba(255,255,255,0.06)`
        : `rgba(255,255,255,0.75)`,
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
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
    };
  } else if (useCard) {
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
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
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
      {isGlass && (
        <>
          <div
            className="absolute pointer-events-none z-[1]"
            style={{
              width: "60%",
              paddingBottom: "60%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${hexToRgba(accentHex, isDark ? 0.18 : 0.28)} 0%, transparent 70%)`,
              top: "5%",
              left: "-10%",
            }}
          />
          <div
            className="absolute pointer-events-none z-[1]"
            style={{
              width: "50%",
              paddingBottom: "50%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${hexToRgba(accentHex, isDark ? 0.12 : 0.22)} 0%, transparent 70%)`,
              bottom: "0%",
              right: "-5%",
            }}
          />
        </>
      )}
      <div className={`relative z-[2] w-full flex items-center justify-center ${cardStyle ? "py-6 px-4" : ""}`} style={innerStyle}>
        {cardStyle ? (
          <div style={cardStyle}>{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
