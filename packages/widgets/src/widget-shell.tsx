"use client";

import type { ReactNode, CSSProperties } from "react";
import { getStyleDesign } from "@nw/widget-core";

interface WidgetShellProps {
  params: { style?: string; bg?: string };
  children: ReactNode;
  className?: string;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/**
 * Common wrapper for all widgets.
 * Applies style design properties (font, effects, overlays)
 * while letting color/bg stay under user control.
 */
export function WidgetShell({ params, children, className }: WidgetShellProps) {
  const design = getStyleDesign(params.style || "minimal");
  const bgHex = params.bg || "18181b";
  const isTransparent = bgHex === "transparent";

  let bgColor: string | undefined;
  if (isTransparent) {
    bgColor = undefined;
  } else if (design.bgOpacity !== undefined) {
    bgColor = hexToRgba(bgHex, design.bgOpacity);
  } else {
    bgColor = `#${bgHex}`;
  }

  const rootStyle: CSSProperties = {
    backgroundColor: bgColor,
    fontFamily: design.fontFamily,
  };

  if (design.backdropFilter) {
    rootStyle.backdropFilter = design.backdropFilter;
    rootStyle.WebkitBackdropFilter = design.backdropFilter;
  }

  const innerStyle: CSSProperties = {
    "--w-text-shadow": design.textShadow,
    "--w-box-shadow": design.boxShadow,
    "--w-radius": design.borderRadius,
    "--w-border-width": design.borderWidth,
  } as CSSProperties;

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
        {children}
      </div>
    </div>
  );
}
