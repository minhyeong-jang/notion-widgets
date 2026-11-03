"use client";

import type { CSSProperties, ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { BannerParams } from "./schema";

/* ─────────────────────────── helpers ─────────────────────────── */

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const SIZE_BANNER = { sm: 28, md: 40, lg: 56 } as const;
const SIZE_MARQUEE = { sm: 20, md: 28, lg: 38 } as const;
const SIZE_SIGN = { sm: 24, md: 34, lg: 46 } as const;

const SPEED_SECONDS = { slow: 26, normal: 16, fast: 9 } as const;

/* ─────────────────────────── component ─────────────────────────── */

export function BannerWidget({ params }: { params: BannerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";
  const isGlass = params.style === "glass";
  const isSoft = params.style === "soft";
  const isDark = mode === "dark";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const surface2 = `#${colors.surface2}`;
  const border = `#${colors.border}`;
  const borderStrong = `#${colors.borderStrong}`;

  const displayText = (params.text || "").trim() || " ";
  const subtitle = (params.subtitle || "").trim();
  const transform: CSSProperties["textTransform"] = params.caps ? "uppercase" : "none";
  const headingFont = isNeon
    ? "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)"
    : undefined;

  // Soft glow for neon text — tight enough to stay crisp, matching house style.
  const neonTextGlow = `0 0 7px ${hexToRgba(colors.accentBright, 0.8)}, 0 0 18px ${hexToRgba(colors.accent, 0.4)}`;

  /* ─────────────── marquee ─────────────── */
  if (params.variant === "marquee") {
    const fs = SIZE_MARQUEE[params.size];
    const dur = SPEED_SECONDS[params.speed];
    const itemColor = isNeon ? accentBright : text;
    const dotColor = isNeon ? accentBright : accent;

    // One repeating unit; the track holds two identical copies for a seamless loop.
    const unit = (keyPrefix: string) =>
      Array.from({ length: 4 }).map((_, i) => (
        <span key={`${keyPrefix}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
          <span
            style={{
              color: itemColor,
              fontWeight: isNeon ? 600 : 700,
              letterSpacing: isNeon ? "0.12em" : "0.01em",
              textTransform: transform,
              fontFamily: headingFont,
              textShadow: isNeon ? neonTextGlow : "var(--w-text-shadow)",
            }}
          >
            {displayText}
          </span>
          <span
            aria-hidden
            style={{
              color: dotColor,
              margin: "0 0.75em",
              opacity: isNeon ? 0.9 : 0.55,
              textShadow: isNeon ? `0 0 8px ${accentBright}` : undefined,
            }}
          >
            ●
          </span>
        </span>
      ));

    const edgeFade =
      "linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)";

    return (
      <WidgetShell params={params}>
        <style>{`
          @keyframes nw-banner-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .nw-mq { width: 100%; overflow: hidden; -webkit-mask-image: ${edgeFade}; mask-image: ${edgeFade}; }
          .nw-mq-track { display: inline-flex; width: max-content; white-space: nowrap; will-change: transform;
            animation: nw-banner-scroll ${dur}s linear infinite; }
        `}</style>
        <div className="nw-mq" style={{ fontSize: fs, lineHeight: 1.3, padding: "10px 0" }}>
          <div className="nw-mq-track">
            {unit("a")}
            {unit("b")}
          </div>
        </div>
      </WidgetShell>
    );
  }

  /* ─────────────── sign (framed plate) ─────────────── */
  if (params.variant === "sign") {
    const fs = SIZE_SIGN[params.size];
    const signText = isNeon ? accentBright : isSoft || isGlass ? text : accent;

    let frame: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "22px 34px",
      borderRadius: 16,
      maxWidth: 440,
    };
    if (isNeon) {
      frame = {
        ...frame,
        borderRadius: 10,
        border: `2px solid ${accent}`,
        boxShadow: `0 0 14px ${hexToRgba(colors.accent, 0.45)}, inset 0 0 16px ${hexToRgba(colors.accent, 0.12)}`,
        background: hexToRgba(colors.accent, 0.04),
      };
    } else if (isGlass) {
      frame = {
        ...frame,
        border: `1.5px solid ${hexToRgba(colors.accent, isDark ? 0.3 : 0.28)}`,
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
      };
    } else if (isSoft) {
      frame = {
        ...frame,
        border: `1px solid ${isDark ? border : "#ececec"}`,
        background: isDark ? surface2 : "#ffffff",
        boxShadow: isDark ? "0 2px 16px rgba(0,0,0,0.25)" : "0 4px 24px rgba(0,0,0,0.07)",
      };
    } else {
      // minimal — a clean double-rule plate in the accent color.
      frame = {
        ...frame,
        border: `2px solid ${accent}`,
        outline: `1px solid ${hexToRgba(colors.accent, 0.25)}`,
        outlineOffset: 4,
        background: "transparent",
      };
    }

    return (
      <WidgetShell params={params} bare>
        <div style={frame}>
          <span
            style={{
              fontSize: fs,
              fontWeight: isNeon ? 600 : 800,
              lineHeight: 1.1,
              color: signText,
              letterSpacing: isNeon ? "0.14em" : "0.02em",
              textTransform: transform,
              fontFamily: headingFont,
              textShadow: isNeon ? neonTextGlow : "var(--w-text-shadow)",
            }}
          >
            {displayText}
          </span>
        </div>
      </WidgetShell>
    );
  }

  /* ─────────────── banner (default, static headline) ─────────────── */
  const fs = SIZE_BANNER[params.size];
  const headColor = isNeon ? accentBright : text;

  const content: ReactNode = (
    <div
      className="flex flex-col items-center text-center"
      style={{ gap: 14, padding: "8px 20px", maxWidth: 480 }}
    >
      <span
        style={{
          fontSize: fs,
          fontWeight: isNeon ? 600 : 800,
          lineHeight: 1.08,
          color: headColor,
          letterSpacing: isNeon ? "0.1em" : "-0.01em",
          textTransform: transform,
          fontFamily: headingFont,
          textShadow: isNeon ? neonTextGlow : "var(--w-text-shadow)",
        }}
      >
        {displayText}
      </span>
      {/* Accent rule under the headline for a finished, banner-like feel. */}
      <span
        aria-hidden
        style={{
          display: "block",
          width: subtitle ? 56 : 40,
          height: isNeon ? 2 : 3,
          borderRadius: 999,
          background: isNeon ? accentBright : accent,
          boxShadow: isNeon ? `0 0 8px ${accentBright}` : undefined,
        }}
      />
      {subtitle && (
        <span
          style={{
            fontSize: Math.max(12, Math.round(fs * 0.36)),
            fontWeight: 500,
            lineHeight: 1.4,
            color: isNeon ? accent : textDim,
            letterSpacing: isNeon ? "0.08em" : "0.01em",
            textTransform: transform,
            fontFamily: headingFont,
            opacity: isNeon ? 0.85 : 1,
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  return <WidgetShell params={params}>{content}</WidgetShell>;
}
