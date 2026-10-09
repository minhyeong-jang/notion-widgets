"use client";

import { useEffect, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { SeasonParams } from "./schema";
import {
  getSeasonInfo,
  getSeasonName,
  getSeasonLabels,
  SEASON_ORDER,
  type SeasonInfo,
} from "./season";
import { SeasonIcon } from "./icons";

/** Polar → cartesian, 0° at 12 o'clock, clockwise. */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function SeasonWidget({ params }: { params: SeasonParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentTint = `#${colors.accentTint}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;

  const isNeon = params.style === "neon";
  const monoFont = "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

  // Gate on mount so SSR/first paint match, then compute the live date.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const mounted = now !== null;
  const info: SeasonInfo = getSeasonInfo(now ?? new Date(2000, 0, 1), params.hemisphere);

  const labels = getSeasonLabels(params.locale);
  const seasonName = getSeasonName(info.key, params.locale);
  const pct = Math.max(0, Math.min(100, info.percent));
  const pctRounded = Math.round(pct);
  const daysLeftText = info.daysLeft <= 0 ? labels.lastDay : labels.daysLeft(info.daysLeft);
  const passedText = labels.passed(info.elapsedDays);

  // Values only render once the real date is known (avoids a placeholder flash).
  const reveal = (extra?: React.CSSProperties): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transition: "opacity 0.35s ease",
    ...extra,
  });

  const textColor = isNeon ? accentBright : text;
  const nameColor = isNeon ? accentBright : accent;
  const trackColor = isNeon ? `${accent}33` : track;
  const iconGlow = isNeon ? `drop-shadow(0 0 5px ${accentBright})` : undefined;
  const numGlow = isNeon ? `0 0 14px ${accentBright}99` : "var(--w-text-shadow)";

  const gradId = `season-grad-${params.accent}-${mode}-${params.variant}`;
  const gradient = (
    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={accent} />
      <stop offset="100%" stopColor={accentBright} />
    </linearGradient>
  );

  const labelStyle: React.CSSProperties = {
    color: isNeon ? accentBright : textDim,
    fontFamily: isNeon ? monoFont : undefined,
    letterSpacing: isNeon ? "2px" : "0.12em",
    textTransform: "uppercase",
    fontWeight: 600,
    textShadow: "var(--w-text-shadow)",
  };

  const bigNumber = params.showPercent ? `${pctRounded}%` : `${info.daysLeft}`;
  // Ring sub-line: when % is the headline, show days-left; otherwise days-in.
  const ringSub = params.showPercent ? daysLeftText : passedText;
  // Bar / seasons bottom row: left is always elapsed, right complements the headline.
  const metaRight = params.showPercent ? daysLeftText : `${pctRounded}%`;

  // ─── Shared horizontal progress bar ───
  const ProgressBar = ({ width }: { width: number }) => (
    <div
      style={{
        width,
        height: isNeon ? 8 : 10,
        borderRadius: 999,
        backgroundColor: trackColor,
        overflow: "hidden",
        boxShadow: isNeon ? `inset 0 0 6px ${accent}44` : undefined,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${accent}, ${accentBright})`,
          filter: isNeon ? `drop-shadow(0 0 5px ${accentBright})` : undefined,
          transition: "width 0.7s ease",
        }}
      />
    </div>
  );

  let inner: React.ReactNode;

  // ─── Variant: ring ───
  if (params.variant === "ring") {
    const SIZE = 172;
    const STROKE = isNeon ? 10 : 14;
    const r = (SIZE - STROKE) / 2 - 2;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const circ = 2 * Math.PI * r;

    inner = (
      <div className="flex flex-col items-center" style={{ gap: 12, padding: "6px 8px" }}>
        <div className="text-[11px]" style={reveal(labelStyle)}>
          {isNeon ? `> ${seasonName}` : seasonName}
        </div>
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ overflow: "visible" }}
          >
            <defs>{gradient}</defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={STROKE} />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={mounted ? circ * (1 - pct / 100) : circ}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{
                filter: isNeon ? `drop-shadow(0 0 6px ${accentBright})` : undefined,
                transition: "stroke-dashoffset 0.8s ease",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 4 }}>
            <div style={reveal({ color: accent, lineHeight: 0 })}>
              <SeasonIcon season={info.key} size={32} color={accent} glow={iconGlow} />
            </div>
            <div
              className="font-bold tabular-nums leading-none"
              style={reveal({
                fontSize: 36,
                color: textColor,
                textShadow: numGlow,
                fontFamily: isNeon ? monoFont : undefined,
              })}
            >
              {bigNumber}
            </div>
          </div>
        </div>
        <div
          className="text-[13px] font-medium tabular-nums"
          style={reveal({
            color: isNeon ? accent : textDim,
            fontFamily: isNeon ? monoFont : undefined,
            textShadow: "var(--w-text-shadow)",
          })}
        >
          {ringSub}
        </div>
      </div>
    );
  }

  // ─── Variant: bar ───
  else if (params.variant === "bar") {
    const W = 290;
    inner = (
      <div className="flex flex-col" style={{ width: W, gap: 14, padding: "4px 6px" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 10 }}>
            <div style={reveal({ color: accent, lineHeight: 0 })}>
              <SeasonIcon season={info.key} size={26} color={accent} glow={iconGlow} />
            </div>
            <span
              className="font-semibold"
              style={reveal({
                fontSize: 18,
                color: nameColor,
                fontFamily: isNeon ? monoFont : undefined,
                letterSpacing: isNeon ? "1px" : "0.01em",
                textShadow: "var(--w-text-shadow)",
              })}
            >
              {seasonName}
            </span>
          </div>
          <span
            className="font-bold tabular-nums"
            style={reveal({
              fontSize: 22,
              color: textColor,
              fontFamily: isNeon ? monoFont : undefined,
              textShadow: numGlow,
            })}
          >
            {bigNumber}
          </span>
        </div>
        <ProgressBar width={W} />
        <div
          className="flex items-center justify-between tabular-nums"
          style={reveal({
            fontSize: 12,
            fontWeight: 500,
            color: isNeon ? accent : textFaint,
            fontFamily: isNeon ? monoFont : undefined,
            textShadow: "var(--w-text-shadow)",
          })}
        >
          <span>{passedText}</span>
          <span>{metaRight}</span>
        </div>
      </div>
    );
  }

  // ─── Variant: seasons (four-season cycle) ───
  else {
    const W = 300;
    inner = (
      <div className="flex flex-col items-center" style={{ width: W, gap: 16, padding: "4px 6px" }}>
        <div className="flex items-center justify-between" style={{ width: "100%" }}>
          {SEASON_ORDER.map((key) => {
            const active = mounted && key === info.key;
            const iconColor = active ? accent : textFaint;
            return (
              <div
                key={key}
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: active ? accentTint : "transparent",
                  border: active
                    ? `1px solid ${isNeon ? accent : accentTint}`
                    : "1px solid transparent",
                  opacity: active ? 1 : 0.38,
                  transition: "opacity 0.35s ease, background-color 0.35s ease",
                  lineHeight: 0,
                }}
              >
                <SeasonIcon
                  season={key}
                  size={26}
                  color={iconColor}
                  glow={active ? iconGlow : undefined}
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-baseline justify-between" style={{ width: "100%" }}>
          <span
            className="font-semibold"
            style={reveal({
              fontSize: 17,
              color: nameColor,
              fontFamily: isNeon ? monoFont : undefined,
              letterSpacing: isNeon ? "1px" : "0.01em",
              textShadow: "var(--w-text-shadow)",
            })}
          >
            {isNeon ? `> ${seasonName}` : seasonName}
          </span>
          <span
            className="font-bold tabular-nums"
            style={reveal({
              fontSize: 20,
              color: textColor,
              fontFamily: isNeon ? monoFont : undefined,
              textShadow: numGlow,
            })}
          >
            {bigNumber}
          </span>
        </div>
        <ProgressBar width={W} />
        <div
          className="flex items-center justify-between tabular-nums"
          style={reveal({
            width: "100%",
            fontSize: 12,
            fontWeight: 500,
            color: isNeon ? accent : textFaint,
            fontFamily: isNeon ? monoFont : undefined,
            textShadow: "var(--w-text-shadow)",
          })}
        >
          <span>{passedText}</span>
          <span>{metaRight}</span>
        </div>
      </div>
    );
  }

  return <WidgetShell params={params}>{inner}</WidgetShell>;
}
