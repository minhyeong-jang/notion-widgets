"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { StickyNoteParams } from "./schema";

/* ─── helpers ─── */

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/** Split the body into lines on literal "\n", real newlines, or "|". */
function toLines(text: string): string[] {
  const lines = text
    .replace(/\\n/g, "\n")
    .split(/\n|\|/)
    .map((l) => l.trim());
  const cleaned = lines.filter((l, i) => l.length > 0 || (i > 0 && i < lines.length - 1));
  return cleaned.length > 0 ? cleaned : [""];
}

const bodySizeMap = {
  sm: "text-[15px] leading-relaxed",
  md: "text-lg leading-relaxed",
  lg: "text-2xl leading-snug",
} as const;

const titleSizeMap = {
  sm: "text-xs",
  md: "text-[13px]",
  lg: "text-sm",
} as const;

/* ─── component ─── */

export function StickyNoteWidget({ params }: { params: StickyNoteParams }) {
  const colorMode = useWidgetColorMode();
  const isDark = colorMode === "dark";
  const colors = resolveColors(params.accent, colorMode);
  const style = params.style || "minimal";
  const isNeon = style === "neon";
  const isGlass = style === "glass";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;

  const lines = toLines(params.text);
  const alignClass = params.align === "center" ? "text-center items-center" : "text-left items-start";

  /* Note "paper" surface — colored pastel for standard styles, glowing frame for neon. */
  let paperStyle: CSSProperties;
  let bodyColor: string;
  let headingColor: string;

  if (isNeon) {
    paperStyle = {
      backgroundColor: isDark ? "rgba(0,0,0,0.25)" : hexToRgba(colors.bg, 0.4),
      border: `1px solid ${accent}`,
      borderRadius: "var(--w-radius)",
      boxShadow: `0 0 14px ${hexToRgba(accent, 0.45)}, inset 0 0 18px ${hexToRgba(accent, 0.12)}`,
    };
    bodyColor = accentBright;
    headingColor = accent;
  } else {
    // Pastel sticky-note paper derived from the accent.
    paperStyle = {
      backgroundColor: `#${colors.accentDim}`,
      border: `1px solid ${hexToRgba(isDark ? colors.accent : colors.accentDeep, 0.28)}`,
      borderRadius: 14,
      boxShadow: isGlass
        ? `0 10px 30px ${hexToRgba(colors.accent, isDark ? 0.28 : 0.22)}`
        : isDark
          ? "0 8px 24px rgba(0,0,0,0.35)"
          : "0 8px 22px rgba(0,0,0,0.10)",
    };
    bodyColor = `#${colors.text}`;
    headingColor = isDark ? accentBright : accentDeep;
  }

  const fontFamily = isNeon
    ? "var(--font-geist-mono, 'Courier New', monospace)"
    : undefined;

  return (
    <WidgetShell params={params}>
      <div className="relative" style={{ paddingTop: params.variant === "pin" ? 12 : 0 }}>
        {/* ── Pin decoration ── */}
        {params.variant === "pin" && (
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ top: 0 }}
            aria-hidden
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: isNeon
                  ? "transparent"
                  : `radial-gradient(circle at 35% 30%, ${accentBright}, ${accentDeep})`,
                border: isNeon ? `2px solid ${accent}` : `1px solid ${hexToRgba(colors.accentDeep, 0.5)}`,
                boxShadow: isNeon
                  ? `0 0 12px ${hexToRgba(accent, 0.7)}`
                  : `0 3px 6px rgba(0,0,0,0.30)`,
              }}
            >
              {!isNeon && (
                <span
                  className="block"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.55)",
                    marginLeft: 5,
                    marginTop: 4,
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* ── Note paper ── */}
        <div
          className="relative overflow-hidden"
          style={{
            ...paperStyle,
            minWidth: 200,
            maxWidth: 360,
            padding: params.variant === "bar" ? "22px 24px 22px 30px" : "26px 26px 24px",
            fontFamily,
          }}
        >
          {/* Tape decoration */}
          {params.variant === "tape" && (
            <div
              className="absolute left-1/2 z-10"
              style={{
                top: -10,
                width: 92,
                height: 26,
                transform: "translateX(-50%) rotate(-3deg)",
                background: isNeon
                  ? hexToRgba(accent, 0.14)
                  : "rgba(255,255,255,0.38)",
                border: isNeon ? `1px solid ${hexToRgba(accent, 0.6)}` : "none",
                boxShadow: isNeon ? `0 0 10px ${hexToRgba(accent, 0.35)}` : "0 1px 3px rgba(0,0,0,0.12)",
                backdropFilter: "blur(1px)",
                WebkitBackdropFilter: "blur(1px)",
              }}
              aria-hidden
            />
          )}

          {/* Accent side bar */}
          {params.variant === "bar" && (
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: 5,
                background: isNeon ? accent : `linear-gradient(${accentBright}, ${accentDeep})`,
                boxShadow: isNeon ? `0 0 10px ${hexToRgba(accent, 0.6)}` : "none",
              }}
              aria-hidden
            />
          )}

          <div className={`flex flex-col ${alignClass} gap-1.5`}>
            {params.title && (
              <div
                className={`${titleSizeMap[params.fontSize]} font-semibold uppercase tracking-[0.14em] mb-1`}
                style={{
                  color: headingColor,
                  textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
                  opacity: 0.9,
                }}
              >
                {params.title}
              </div>
            )}
            {lines.map((line, i) =>
              line === "" ? (
                <div key={i} style={{ height: "0.6em" }} aria-hidden />
              ) : (
                <div
                  key={i}
                  className={`${bodySizeMap[params.fontSize]} font-medium`}
                  style={{
                    color: bodyColor,
                    textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
                    fontFamily,
                  }}
                >
                  {isNeon && <span style={{ opacity: 0.5, marginRight: 4 }}>&gt;</span>}
                  {line}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
