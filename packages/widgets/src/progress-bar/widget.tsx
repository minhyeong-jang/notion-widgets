"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ProgressBarParams } from "./schema";

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

const sizeMap = {
  sm: { bar: 8, percent: "text-2xl", label: "text-xs", sub: "text-[10px]", gap: "mb-2" },
  md: { bar: 12, percent: "text-4xl", label: "text-sm", sub: "text-xs", gap: "mb-3" },
  lg: { bar: 16, percent: "text-5xl", label: "text-base", sub: "text-sm", gap: "mb-4" },
} as const;

const SEGMENT_COUNT = 24;
const STEP_COUNT = 10;

export function ProgressBarWidget({ params }: { params: ProgressBarParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isNeon = params.style === "neon";
  const isDark = colorMode === "dark";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const textColor = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const trackColor = isDark ? hexToRgba(colors.text, 0.08) : hexToRgba(colors.text, 0.07);

  const size = sizeMap[params.size];
  const ratio = Math.max(0, Math.min(1, params.value / params.target));
  const percent = Math.round(ratio * 100);

  const fillGradient = `linear-gradient(90deg, ${accentDeep} 0%, ${accent} 55%, ${accentBright} 100%)`;
  const fillGlow = isNeon
    ? `0 0 8px ${hexToRgba(colors.accent, 0.9)}, 0 0 18px ${hexToRgba(colors.accent, 0.5)}`
    : "none";

  const trackStyle: CSSProperties = {
    height: size.bar,
    borderRadius: 999,
    backgroundColor: trackColor,
    boxShadow: isNeon ? `inset 0 0 4px ${hexToRgba(colors.accent, 0.25)}` : undefined,
  };

  // --- Bar variant (also base for striped) ---
  const renderBar = (striped: boolean) => (
    <div className="relative w-full overflow-hidden" style={trackStyle}>
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: `${ratio * 100}%`,
          minWidth: ratio > 0 ? size.bar : 0,
          borderRadius: 999,
          background: fillGradient,
          boxShadow: fillGlow,
        }}
      >
        {striped && (
          <div
            className="absolute inset-0"
            style={{
              borderRadius: 999,
              backgroundImage: `repeating-linear-gradient(-45deg, ${hexToRgba(
                "ffffff",
                isDark ? 0.22 : 0.32,
              )} 0, ${hexToRgba("ffffff", isDark ? 0.22 : 0.32)} 8px, transparent 8px, transparent 16px)`,
              backgroundSize: "22px 22px",
              animation: "pb-stripes 0.7s linear infinite",
            }}
          />
        )}
      </div>
    </div>
  );

  // --- Segmented / steps ---
  const renderCells = (count: number, gapPx: number, radius: number) => {
    const filled = Math.round(ratio * count);
    return (
      <div className="flex w-full" style={{ gap: gapPx }}>
        {Array.from({ length: count }).map((_, i) => {
          const on = i < filled;
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                height: size.bar,
                borderRadius: radius,
                background: on ? fillGradient : trackColor,
                boxShadow: on && isNeon ? fillGlow : undefined,
                opacity: on ? 1 : isNeon ? 0.4 : 1,
              }}
            />
          );
        })}
      </div>
    );
  };

  let track;
  if (params.variant === "striped") track = renderBar(true);
  else if (params.variant === "segmented") track = renderCells(SEGMENT_COUNT, 3, 2);
  else if (params.variant === "steps") track = renderCells(STEP_COUNT, 6, 4);
  else track = renderBar(false);

  const showSub = params.unit.trim().length > 0 || params.target !== 100;
  const percentPrefix = isNeon ? "> " : "";

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes pb-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 22px 0; }
        }
      `}</style>
      <div className="w-full max-w-md px-8" style={{ fontVariantNumeric: "tabular-nums" }}>
        <div className={`flex items-end justify-between ${size.gap}`}>
          <span
            className={`${size.label} font-medium tracking-tight`}
            style={{ color: textColor, opacity: 0.92, textShadow: isNeon ? "var(--w-text-shadow)" : undefined }}
          >
            {isNeon ? params.label.replace(/ /g, "_") : params.label}
          </span>
          {params.showPercent && (
            <span
              className={`${size.percent} font-bold leading-none`}
              style={{ color: accent, textShadow: "var(--w-text-shadow)" }}
            >
              {percentPrefix}
              {percent}
              <span className="text-[0.5em] font-semibold" style={{ opacity: 0.8 }}>
                %
              </span>
            </span>
          )}
        </div>
        {track}
        {showSub && (
          <div className={`mt-2 ${size.sub} font-medium flex justify-end`} style={{ color: textDim }}>
            <span>
              {params.value.toLocaleString()}
              <span style={{ opacity: 0.5 }}> / </span>
              {params.target.toLocaleString()}
              {params.unit.trim() && <span> {params.unit.trim()}</span>}
            </span>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
