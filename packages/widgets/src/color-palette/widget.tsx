"use client";

import { useEffect, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ColorPaletteParams } from "./schema";
import {
  dayOfYear,
  generatePalette,
  hexToHsl,
  makeRng,
  strHash,
  type Swatch,
} from "./palette";

const HARMONY_LABEL: Record<string, string> = {
  analogous: "Analogous",
  monochrome: "Monochrome",
  complementary: "Complementary",
  triad: "Triad",
};

export function ColorPaletteWidget({ params }: { params: ColorPaletteParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  const isNeon = params.style === "neon";

  // Deterministic daily seed for SSR; random mode re-seeds after mount so
  // server and client first render agree (no hydration mismatch).
  const dailySeed = dayOfYear() * 101 + strHash(params.accent + params.harmony);
  const [seed, setSeed] = useState(dailySeed);

  useEffect(() => {
    if (params.mode === "random") {
      setSeed(Math.floor(Math.random() * 1e9));
    } else {
      setSeed(dayOfYear() * 101 + strHash(params.accent + params.harmony));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode, params.accent, params.harmony]);

  const baseHsl = hexToHsl(colors.accent);
  const swatches = generatePalette(baseHsl, params.harmony, params.count, makeRng(seed));

  const headerLabel = isNeon
    ? `> ${HARMONY_LABEL[params.harmony].toUpperCase()}`
    : HARMONY_LABEL[params.harmony];

  const Header = (
    <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
      <span
        className="text-[11px] font-semibold uppercase"
        style={{
          color: isNeon ? accentBright : textDim,
          letterSpacing: isNeon ? "2px" : "0.08em",
          textShadow: "var(--w-text-shadow)",
          fontFamily: isNeon ? "monospace" : undefined,
        }}
      >
        {headerLabel}
      </span>
      <span
        className="text-[10px] font-medium tabular-nums"
        style={{
          color: isNeon ? `${accent}` : textFaint,
          opacity: isNeon ? 0.7 : 1,
          fontFamily: isNeon ? "monospace" : undefined,
        }}
      >
        {params.count}
        {isNeon ? " // " : " · "}
        {params.mode === "daily" ? "DAILY" : "RANDOM"}
      </span>
    </div>
  );

  const hexLabel = (s: Swatch, color: string) =>
    params.showHex ? (
      <span
        className="text-[10px] font-medium tabular-nums"
        style={{ color, fontFamily: "monospace", letterSpacing: "0.02em" }}
      >
        {isNeon ? s.hex.toUpperCase() : s.hex.toUpperCase()}
      </span>
    ) : null;

  const CONTENT_W = 312;

  let inner: React.ReactNode;

  if (params.variant === "cards") {
    inner = (
      <div style={{ width: CONTENT_W }}>
        {Header}
        <div className="flex items-end justify-center" style={{ gap: 10 }}>
          {swatches.map((s, i) => (
            <div key={i} className="flex flex-col items-center" style={{ gap: 7 }}>
              <div
                style={{
                  width: 48,
                  height: 64,
                  borderRadius: 12,
                  background: s.hex,
                  boxShadow: isNeon
                    ? `0 0 12px ${s.hex}aa, 0 0 2px ${s.hex}`
                    : "0 4px 12px rgba(0,0,0,0.16)",
                  border: isNeon ? `1px solid ${s.hex}` : `1px solid rgba(0,0,0,0.06)`,
                }}
              />
              {hexLabel(s, isNeon ? accentBright : textDim)}
            </div>
          ))}
        </div>
      </div>
    );
  } else if (params.variant === "gradient") {
    const stops = swatches.map((s) => s.hex);
    const gradientCss = `linear-gradient(90deg, ${swatches
      .map((s, i) => `${s.hex} ${(i / (swatches.length - 1)) * 100}%`)
      .join(", ")})`;
    inner = (
      <div style={{ width: CONTENT_W }}>
        {Header}
        <div
          style={{
            height: 72,
            borderRadius: 14,
            background: gradientCss,
            boxShadow: isNeon
              ? `0 0 18px ${accent}66`
              : "0 4px 16px rgba(0,0,0,0.16)",
            border: isNeon ? `1px solid ${accent}55` : `1px solid rgba(0,0,0,0.06)`,
          }}
        />
        {params.showHex && (
          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            {swatches.map((s, i) => (
              <div key={i} className="flex flex-col items-center" style={{ gap: 5 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 99,
                    background: s.hex,
                    boxShadow: isNeon ? `0 0 8px ${s.hex}` : "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
                <span
                  className="text-[9px] font-medium tabular-nums"
                  style={{
                    color: isNeon ? accentBright : textFaint,
                    fontFamily: "monospace",
                  }}
                >
                  {stops[i].toUpperCase().replace("#", "")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // stack — seamless vertical color columns inside a rounded frame
    inner = (
      <div style={{ width: CONTENT_W }}>
        {Header}
        <div
          className="flex overflow-hidden"
          style={{
            height: 132,
            borderRadius: 14,
            boxShadow: isNeon ? `0 0 18px ${accent}55` : "0 6px 20px rgba(0,0,0,0.18)",
            border: isNeon ? `1px solid ${accent}55` : `1px solid rgba(0,0,0,0.06)`,
          }}
        >
          {swatches.map((s, i) => (
            <div
              key={i}
              className="flex items-end justify-center"
              style={{ flex: 1, background: s.hex, paddingBottom: 10 }}
            >
              {hexLabel(s, s.textOn)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <WidgetShell params={params}>
      <div style={{ padding: "10px 14px" }}>{inner}</div>
    </WidgetShell>
  );
}
