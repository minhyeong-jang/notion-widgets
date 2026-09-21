"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { LinkCardParams } from "./schema";

/** Force a colour-emoji-capable font so the icon glyph never falls back to a
 *  monochrome emoji font on platforms that ship one. */
const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/** Clean display host: strip protocol, "www.", and any path. */
function domainOf(url: string): string {
  const raw = (url || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

/** Guarantee an absolute href so the link resolves outside the iframe. */
function hrefOf(url: string): string {
  const raw = (url || "").trim();
  if (!raw) return "#";
  return raw.includes("://") ? raw : `https://${raw}`;
}

function Arrow({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg
      className="nw-lc-arrow"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkCardWidget({ params }: { params: LinkCardParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const isNeon = params.style === "neon";
  const isCardStyle = params.style === "soft" || params.style === "glass";
  const isDark = mode === "dark";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const surface = `#${colors.surface}`;
  const border = `#${colors.border}`;

  const mono = isNeon ? "monospace" : undefined;
  // On soft/glass the WidgetShell already draws a card; the "card" variant would
  // otherwise nest a second card inside it, so it sits flush and fills the shell.
  const flush = params.variant === "card" && isCardStyle;
  const domain = params.showDomain ? domainOf(params.url) : "";
  const href = hrefOf(params.url);

  const titleColor = isNeon ? accentBright : text;
  const arrowColor = isNeon ? accentBright : accent;

  // The clickable element's frame. On soft/glass the WidgetShell already draws a
  // card, so the link sits as a subtle inset panel; on minimal/neon it *is* the card.
  const frameBg = isNeon
    ? "transparent"
    : isCardStyle
      ? isDark
        ? hexToRgba(accent, 0.06)
        : hexToRgba(accent, 0.05)
      : surface;
  const frameBorder = isNeon
    ? `1px solid ${hexToRgba(accentBright, 0.4)}`
    : isCardStyle
      ? `1px solid ${hexToRgba(accent, isDark ? 0.18 : 0.14)}`
      : `1px solid ${border}`;

  const baseFrame: CSSProperties = {
    display: "flex",
    textDecoration: "none",
    background: flush ? "transparent" : frameBg,
    border: flush ? "1px solid transparent" : frameBorder,
    borderRadius: isNeon ? 6 : 16,
    fontFamily: mono,
    boxShadow: flush
      ? "none"
      : isNeon
        ? `0 0 12px ${hexToRgba(accentBright, 0.18)}, inset 0 0 12px ${hexToRgba(accentBright, 0.05)}`
        : isCardStyle
          ? "none"
          : isDark
            ? "0 1px 3px rgba(0,0,0,0.3)"
            : "0 1px 3px rgba(0,0,0,0.05)",
    transition: "transform .15s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease",
  };

  const iconBadge = (size: number, fontSize: number) => (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: isNeon ? 6 : 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        lineHeight: 1,
        fontFamily: EMOJI_FONT,
        background: isNeon ? hexToRgba(accentBright, 0.12) : hexToRgba(accent, isDark ? 0.16 : 0.12),
        border: `1px solid ${hexToRgba(isNeon ? accentBright : accent, isDark ? 0.28 : 0.2)}`,
      }}
    >
      {params.icon || "🔗"}
    </span>
  );

  const domainChip = domain ? (
    <span
      className="inline-flex items-center"
      style={{
        gap: 5,
        fontSize: 11,
        color: isNeon ? hexToRgba(accentBright, 0.75) : textFaint,
        fontFamily: mono,
        letterSpacing: isNeon ? "0.5px" : undefined,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          background: accent,
          flexShrink: 0,
          boxShadow: isNeon ? `0 0 6px ${accentBright}` : "none",
        }}
      />
      {isNeon ? domain.toUpperCase() : domain}
    </span>
  ) : null;

  const titleStyle: CSSProperties = {
    color: titleColor,
    fontWeight: 600,
    letterSpacing: isNeon ? "0.5px" : "-0.01em",
    textShadow: isNeon ? `0 0 8px ${hexToRgba(accentBright, 0.6)}` : "none",
  };

  /* ---- variants ---------------------------------------------------------- */

  let inner: React.ReactNode;
  if (params.variant === "button") {
    inner = (
      <a href={href} target="_blank" rel="noopener noreferrer" className="nw-lc" style={{ ...baseFrame, alignItems: "center", gap: 10, padding: "12px 16px", maxWidth: 320 }}>
        {iconBadge(28, 15)}
        <span style={{ ...titleStyle, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {isNeon ? params.title.toUpperCase() : params.title}
        </span>
        <span style={{ flex: 1 }} />
        <Arrow color={arrowColor} size={15} />
      </a>
    );
  } else if (params.variant === "banner") {
    inner = (
      <a href={href} target="_blank" rel="noopener noreferrer" className="nw-lc" style={{ ...baseFrame, alignItems: "center", gap: 14, padding: "16px 18px", width: 360, maxWidth: "100%" }}>
        {iconBadge(44, 22)}
        <span className="flex flex-col" style={{ gap: 3, minWidth: 0, flex: 1 }}>
          <span style={{ ...titleStyle, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {isNeon ? params.title.toUpperCase() : params.title}
          </span>
          {params.subtitle ? (
            <span style={{ fontSize: 12.5, color: isNeon ? hexToRgba(accentBright, 0.6) : textDim, fontFamily: mono, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {params.subtitle}
            </span>
          ) : (
            domainChip
          )}
        </span>
        <Arrow color={arrowColor} size={18} />
      </a>
    );
  } else {
    // card
    inner = (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`nw-lc${flush ? " nw-lc-flush" : ""}`} style={{ ...baseFrame, flexDirection: "column", gap: 12, padding: flush ? 0 : "20px 20px 16px", width: flush ? "100%" : 300, maxWidth: "100%" }}>
        <div className="flex items-start justify-between" style={{ gap: 10 }}>
          {iconBadge(46, 23)}
          <Arrow color={arrowColor} size={18} />
        </div>
        <div className="flex flex-col" style={{ gap: 5 }}>
          <span style={{ ...titleStyle, fontSize: 18, lineHeight: 1.25 }}>
            {isNeon ? params.title.toUpperCase() : params.title}
          </span>
          {params.subtitle ? (
            <span style={{ fontSize: 13.5, lineHeight: 1.4, color: isNeon ? hexToRgba(accentBright, 0.6) : textDim, fontFamily: mono }}>
              {params.subtitle}
            </span>
          ) : null}
        </div>
        {domainChip ? (
          <div
            style={{
              marginTop: 2,
              paddingTop: 12,
              borderTop: `1px solid ${isNeon ? hexToRgba(accentBright, 0.15) : hexToRgba(isCardStyle ? accent : textFaint, isDark ? 0.14 : 0.12)}`,
            }}
          >
            {domainChip}
          </div>
        ) : null}
      </a>
    );
  }

  const hoverGlow = isNeon
    ? `0 0 20px ${hexToRgba(accentBright, 0.35)}, inset 0 0 12px ${hexToRgba(accentBright, 0.08)}`
    : `0 8px 24px ${hexToRgba(accent, isDark ? 0.28 : 0.22)}`;

  return (
    <WidgetShell params={params}>
      <style>{`
        .nw-lc { cursor: pointer; }
        .nw-lc:hover { transform: translateY(-3px); border-color: ${accent} !important; box-shadow: ${hoverGlow} !important; }
        .nw-lc:active { transform: translateY(-1px); }
        .nw-lc .nw-lc-arrow { transition: transform .18s ease; }
        .nw-lc:hover .nw-lc-arrow { transform: translate(2px, -2px); }
        /* Flush card fills the shell card, so highlight in place rather than lift. */
        .nw-lc-flush:hover { transform: none; box-shadow: none !important; border-color: transparent !important; }
      `}</style>
      {inner}
    </WidgetShell>
  );
}
