"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { CoinFlipParams } from "./schema";

const monoFont =
  "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Deterministic "flip" for daily mode: stable per calendar day.
function dailySide(): 0 | 1 {
  const d = new Date();
  const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  // simple xorshift-ish hash → 0/1
  let x = key ^ 0x9e3779b9;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return (Math.abs(x) % 2) as 0 | 1;
}

function faceGlyph(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "?";
  // Use up to first 2 chars for very short labels, else the first letter.
  const first = Array.from(trimmed)[0];
  return first.toUpperCase();
}

const HINTS: Record<string, string> = {
  en: "tap to flip",
  ko: "눌러서 뒤집기",
};

function hintText(locale?: string): string {
  const lang = (locale || "en").slice(0, 2);
  return HINTS[lang] ?? HINTS.en;
}

export function CoinFlipWidget({ params }: { params: CoinFlipParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";
  const isDark = mode === "dark";

  const sides = [params.sideA || "Heads", params.sideB || "Tails"] as const;

  // Deterministic initial (side A) so SSR and first client paint match.
  const [side, setSide] = useState<0 | 1>(0);
  const [hydrated, setHydrated] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount, pick the real starting face (daily = deterministic, random = random).
  useEffect(() => {
    const initial: 0 | 1 =
      params.mode === "daily" ? dailySide() : ((Math.random() < 0.5 ? 0 : 1) as 0 | 1);
    setSide(initial);
    setHydrated(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode]);

  const flip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setFlipCount((c) => c + 1);
    // Land on a fresh random face (interactive flip is always random).
    setSide((Math.random() < 0.5 ? 0 : 1) as 0 | 1);
    timeoutRef.current = setTimeout(() => setFlipping(false), 720);
  }, [flipping]);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const btnText = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textFaint = `#${colors.textFaint}`;

  const coinSize = 128;

  // Coin face styling per style.
  const coinStyle: CSSProperties = {
    width: coinSize,
    height: coinSize,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    transition: "transform 120ms ease",
  };

  let glyphColor: string;
  if (isNeon) {
    coinStyle.background = isDark ? `#${colors.inset}` : `#${colors.surface}`;
    coinStyle.border = `3px solid ${accentBright}`;
    coinStyle.boxShadow = `0 0 18px ${hexToRgba(accentBright, 0.55)}, inset 0 0 14px ${hexToRgba(
      accentBright,
      0.25,
    )}`;
    glyphColor = accentBright;
  } else {
    coinStyle.background = `radial-gradient(circle at 35% 30%, ${accentBright} 0%, ${accent} 48%, ${accentDeep} 100%)`;
    coinStyle.border = `2px solid ${hexToRgba(accentDeep, 0.9)}`;
    coinStyle.boxShadow = isDark
      ? `0 10px 24px rgba(0,0,0,0.38), inset 0 2px 6px ${hexToRgba("#ffffff", 0.22)}, inset 0 -6px 12px ${hexToRgba(accentDeep, 0.5)}`
      : `0 10px 22px ${hexToRgba(accentDeep, 0.32)}, inset 0 2px 6px ${hexToRgba("#ffffff", 0.45)}, inset 0 -6px 12px ${hexToRgba(accentDeep, 0.4)}`;
    glyphColor = btnText;
  }

  const label = sides[side];
  const glyph = faceGlyph(label);
  const placeholder = !hydrated;

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes nw-coin-flip {
          0%   { transform: rotateY(0deg) translateY(0) scale(1); }
          25%  { transform: rotateY(450deg) translateY(-14px) scale(1.06); }
          50%  { transform: rotateY(900deg) translateY(0) scale(1); }
          75%  { transform: rotateY(1350deg) translateY(-6px) scale(1.03); }
          100% { transform: rotateY(1800deg) translateY(0) scale(1); }
        }
        .nw-coin-wrap { perspective: 700px; }
        .nw-coin-active { animation: nw-coin-flip 0.72s cubic-bezier(.3,.7,.4,1); }
      `}</style>
      <div
        className="flex flex-col items-center"
        style={{ gap: 16, padding: "8px 18px", fontFamily: isNeon ? monoFont : "inherit" }}
      >
        <div className="nw-coin-wrap" style={{ width: coinSize, height: coinSize }}>
          <div
            role="button"
            tabIndex={0}
            aria-label={`Flip coin, currently ${label}`}
            onClick={flip}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flip();
              }
            }}
            key={flipCount}
            className={flipping ? "nw-coin-active" : undefined}
            style={{ ...coinStyle, transformStyle: "preserve-3d" }}
          >
            <span
              style={{
                fontSize: 58,
                fontWeight: 800,
                lineHeight: 1,
                color: glyphColor,
                letterSpacing: "0.02em",
                textShadow: isNeon ? `0 0 16px ${hexToRgba(accentBright, 0.7)}` : undefined,
                // Hide the glyph mid-spin so it never reads mirrored.
                opacity: flipping ? 0 : placeholder ? 0.35 : 1,
                transition: "opacity 120ms ease",
                fontFamily: isNeon ? monoFont : "inherit",
              }}
            >
              {glyph}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center" style={{ gap: 4, minHeight: 44 }}>
          <div
            className="font-bold"
            style={{
              fontSize: 22,
              letterSpacing: isNeon ? "0.14em" : "0.06em",
              color: isNeon ? accentBright : text,
              textTransform: "uppercase",
              textShadow: isNeon ? `0 0 12px ${hexToRgba(accentBright, 0.6)}` : "var(--w-text-shadow)",
              opacity: flipping || placeholder ? 0 : 1,
              transition: "opacity 120ms ease",
            }}
          >
            {isNeon ? `> ${label}` : label}
          </div>
          {params.showHint && (
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.04em",
                color: isNeon ? accent : textFaint,
                opacity: 0.85,
                fontFamily: isNeon ? monoFont : "inherit",
              }}
            >
              {hintText(undefined)}
            </div>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
