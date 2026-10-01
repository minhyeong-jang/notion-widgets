"use client";

import type { CSSProperties, ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ProfileCardParams } from "./schema";
import { SOCIALS } from "./socials";

/** Colour-emoji-capable font so an emoji avatar never falls back to mono. */
const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function ProfileCardWidget({ params }: { params: ProfileCardParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const isNeon = params.style === "neon";
  const isDark = mode === "dark";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const mono = isNeon ? "var(--font-geist-mono, 'Courier New', monospace)" : undefined;

  const isBanner = params.variant === "banner";

  // Avatar glyph: custom emoji/char, else the name's first character.
  const customAvatar = params.avatar.trim();
  const avatarGlyph = customAvatar || (Array.from(params.name.trim())[0] || "?").toUpperCase();
  const avatarFont = customAvatar ? EMOJI_FONT : mono;

  const nameColor = isNeon ? accentBright : text;
  const taglineColor = isNeon ? hexToRgba(accentBright, 0.6) : textDim;

  const active = SOCIALS.filter((s) => {
    const v = params[s.key];
    return typeof v === "string" && v.trim().length > 0;
  });

  /* ---- avatar ------------------------------------------------------------ */
  const avatarSize = isBanner ? 60 : 76;
  const avatar = (
    <div
      style={{
        width: avatarSize,
        height: avatarSize,
        flexShrink: 0,
        borderRadius: isNeon ? 10 : "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: customAvatar ? avatarSize * 0.5 : avatarSize * 0.42,
        fontWeight: 700,
        lineHeight: 1,
        color: isNeon ? accentBright : accent,
        fontFamily: avatarFont,
        background: isNeon ? hexToRgba(accentBright, 0.1) : hexToRgba(accent, isDark ? 0.18 : 0.12),
        border: `1.5px solid ${hexToRgba(isNeon ? accentBright : accent, isDark ? 0.4 : 0.26)}`,
        boxShadow: isNeon ? `0 0 16px ${hexToRgba(accentBright, 0.35)}` : "none",
        textShadow: isNeon ? `0 0 10px ${hexToRgba(accentBright, 0.7)}` : "none",
      }}
    >
      {avatarGlyph}
    </div>
  );

  /* ---- name + tagline ---------------------------------------------------- */
  const nameBlock = (align: "center" | "flex-start") => (
    <div
      className="flex flex-col"
      style={{ gap: 4, alignItems: align, textAlign: align === "center" ? "center" : "left", minWidth: 0 }}
    >
      <span
        style={{
          color: nameColor,
          fontWeight: 700,
          fontSize: isBanner ? 19 : 21,
          letterSpacing: isNeon ? "0.5px" : "-0.01em",
          fontFamily: mono,
          textShadow: isNeon ? `0 0 10px ${hexToRgba(accentBright, 0.6)}` : "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {isNeon ? params.name.toUpperCase() : params.name}
      </span>
      {params.tagline.trim() ? (
        <span
          style={{
            color: taglineColor,
            fontSize: 13.5,
            lineHeight: 1.4,
            fontFamily: mono,
            maxWidth: 280,
          }}
        >
          {params.tagline}
        </span>
      ) : null}
    </div>
  );

  /* ---- social row -------------------------------------------------------- */
  const badgeSize = 38;
  const socialRow =
    active.length > 0 ? (
      <div
        className="flex flex-wrap"
        style={{ gap: 9, justifyContent: isBanner ? "flex-start" : "center" }}
      >
        {active.map((s) => {
          const value = String(params[s.key]);
          const href = s.href(value);
          const isWeb = /^https?:\/\//i.test(href);
          const linkProps = isWeb
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <a
              key={s.key as string}
              href={href}
              aria-label={s.label}
              title={s.label}
              className="nw-pc-social"
              {...linkProps}
              style={{
                width: badgeSize,
                height: badgeSize,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: isNeon ? 8 : 12,
                color: isNeon ? accentBright : accent,
                textDecoration: "none",
                background: isNeon ? hexToRgba(accentBright, 0.08) : hexToRgba(accent, isDark ? 0.14 : 0.1),
                border: `1px solid ${hexToRgba(isNeon ? accentBright : accent, isDark ? 0.3 : 0.2)}`,
                boxShadow: isNeon ? `0 0 10px ${hexToRgba(accentBright, 0.18)}` : "none",
                transition: "transform .15s ease, background .2s ease, box-shadow .2s ease, border-color .2s ease",
              }}
            >
              {s.icon(19)}
            </a>
          );
        })}
      </div>
    ) : null;

  /* ---- compose ----------------------------------------------------------- */
  let content: ReactNode;
  if (isBanner) {
    content = (
      <div className="flex items-center" style={{ gap: 18, maxWidth: "100%" }}>
        {avatar}
        <div className="flex flex-col" style={{ gap: 12, minWidth: 0 }}>
          {nameBlock("flex-start")}
          {socialRow}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center" style={{ gap: 16, maxWidth: 340, padding: "4px 8px" }}>
        {avatar}
        {nameBlock("center")}
        {socialRow}
      </div>
    );
  }

  const hoverGlow = isNeon
    ? `0 0 18px ${hexToRgba(accentBright, 0.4)}`
    : `0 6px 18px ${hexToRgba(accent, isDark ? 0.3 : 0.24)}`;
  const hoverBg = isNeon ? hexToRgba(accentBright, 0.18) : hexToRgba(accent, isDark ? 0.26 : 0.2);

  return (
    <WidgetShell params={params}>
      <style>{`
        .nw-pc-social { cursor: pointer; }
        .nw-pc-social:hover {
          transform: translateY(-2px);
          background: ${hoverBg} !important;
          border-color: ${isNeon ? accentBright : accent} !important;
          box-shadow: ${hoverGlow} !important;
        }
        .nw-pc-social:active { transform: translateY(0); }
      `}</style>
      {content}
    </WidgetShell>
  );
}
