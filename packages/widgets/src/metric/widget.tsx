"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { MetricParams } from "./schema";

/** Strip grouping separators / currency glyphs and parse to a number. */
function parseNumeric(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.+-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "+" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseSeries(raw: string): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
}

function formatPercent(pct: number, locale: string): string {
  const abs = Math.abs(pct);
  const digits = abs >= 100 ? 0 : 1;
  return abs.toLocaleString(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

interface Delta {
  direction: "up" | "down" | "flat";
  pct: number;
  good: boolean;
}

function computeDelta(
  current: number | null,
  previous: number | null,
  invert: boolean,
): Delta | null {
  if (current === null || previous === null) return null;
  const diff = current - previous;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const pct = previous !== 0 ? (diff / Math.abs(previous)) * 100 : 0;
  const good =
    direction === "flat"
      ? true
      : invert
        ? direction === "down"
        : direction === "up";
  return { direction, pct, good };
}

/** Build an SVG area + line path from a numeric series in a 100 x 32 viewBox. */
function buildSparkline(values: number[]) {
  const W = 100;
  const H = 32;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? (W - pad * 2) / (values.length - 1) : 0;
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (H - pad * 2) * (1 - (v - min) / span);
    return [x, y] as const;
  });
  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L${last[0].toFixed(2)},${H} L${first[0].toFixed(2)},${H} Z`;
  return { line, area, last, W, H };
}

export function MetricWidget({ params }: { params: MetricParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const accent = `#${colors.accent}`;
  const textColor = `#${colors.text}`;
  const dimColor = `#${colors.textDim}`;
  const faintColor = `#${colors.textFaint}`;

  const isNeon = params.style === "neon";
  const valueColor = isNeon ? accent : textColor;
  const glow: CSSProperties = { textShadow: "var(--w-text-shadow)" };

  const current = parseNumeric(params.value);
  const previous = parseNumeric(params.previous);
  const delta = computeDelta(current, previous, params.invertTrend);

  const deltaColor = (d: Delta) =>
    d.direction === "flat" ? faintColor : d.good ? accent : dimColor;
  const deltaArrow = (d: Delta) =>
    d.direction === "up" ? "▲" : d.direction === "down" ? "▼" : "—";

  const displayValue = (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {params.prefix && (
        <span style={{ opacity: 0.6, fontSize: "0.62em", marginRight: "0.08em" }}>
          {params.prefix}
        </span>
      )}
      {params.value}
      {params.suffix && (
        <span style={{ opacity: 0.6, fontSize: "0.62em", marginLeft: "0.1em" }}>
          {params.suffix}
        </span>
      )}
    </span>
  );

  const DeltaBadge = ({ d, size = "md" }: { d: Delta; size?: "sm" | "md" }) => {
    const c = deltaColor(d);
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold whitespace-nowrap ${
          size === "sm" ? "text-xs" : "text-sm"
        }`}
        style={{
          color: c,
          backgroundColor: isNeon ? "transparent" : `${c}1f`,
          border: isNeon ? `1px solid ${c}55` : "none",
          borderRadius: 999,
          padding: size === "sm" ? "1px 7px" : "3px 9px",
          ...(isNeon ? glow : {}),
        }}
      >
        <span style={{ fontSize: "0.82em", lineHeight: 1 }}>{deltaArrow(d)}</span>
        {formatPercent(d.pct, params.locale)}%
      </span>
    );
  };

  const Eyebrow = ({ center }: { center?: boolean }) =>
    params.label ? (
      <div
        className={`text-xs font-semibold uppercase ${center ? "text-center" : ""}`}
        style={{
          color: accent,
          letterSpacing: "0.12em",
          ...(isNeon ? glow : {}),
        }}
      >
        {isNeon ? `> ${params.label}` : params.label}
      </div>
    ) : null;

  // ---- Sparkline (trend variant) ----
  const seriesVals = parseSeries(params.series);
  const spark = seriesVals.length >= 2 ? buildSparkline(seriesVals) : null;
  const gradId = `metric-spark-${params.accent}-${colorMode}`;

  const Sparkline = () =>
    spark ? (
      <svg
        viewBox={`0 0 ${spark.W} ${spark.H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: 48, overflow: "visible", display: "block" }}
        role="img"
        aria-label="trend sparkline"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={isNeon ? 0.35 : 0.28} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={spark.area} fill={`url(#${gradId})`} />
        <path
          d={spark.line}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={isNeon ? { filter: `drop-shadow(0 0 4px ${accent})` } : undefined}
        />
        <circle
          cx={spark.last[0]}
          cy={spark.last[1]}
          r={2.6}
          fill={accent}
          vectorEffect="non-scaling-stroke"
          style={isNeon ? { filter: `drop-shadow(0 0 4px ${accent})` } : undefined}
        />
      </svg>
    ) : null;

  const caption = params.caption ? (
    <div className="text-sm" style={{ color: dimColor }}>
      {params.caption}
    </div>
  ) : null;

  // ---------------- COMPACT ----------------
  if (params.variant === "compact") {
    return (
      <WidgetShell params={params}>
        <div className="w-full max-w-md mx-auto px-6 flex items-center justify-between gap-6">
          <div className="min-w-0 flex items-center gap-3">
            <span
              className="shrink-0 rounded-full"
              style={{
                width: 10,
                height: 10,
                backgroundColor: accent,
                ...(isNeon ? { boxShadow: `0 0 8px ${accent}` } : {}),
              }}
            />
            <div className="min-w-0">
              <div
                className="text-sm font-medium truncate"
                style={{ color: isNeon ? accent : textColor, ...(isNeon ? glow : {}) }}
              >
                {params.label}
              </div>
              {params.caption && (
                <div className="text-xs truncate" style={{ color: faintColor }}>
                  {params.caption}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div
              className="text-2xl font-bold leading-none"
              style={{ color: valueColor, ...(isNeon ? glow : {}) }}
            >
              {displayValue}
            </div>
            {delta && <DeltaBadge d={delta} size="sm" />}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---------------- STAT / TREND ----------------
  return (
    <WidgetShell params={params}>
      <div className="w-full max-w-sm mx-auto px-6 flex flex-col items-center text-center gap-3">
        <Eyebrow center />

        <div
          className="font-bold leading-none"
          style={{
            color: valueColor,
            fontSize: "clamp(2.25rem, 10vw, 3.5rem)",
            ...(isNeon ? glow : {}),
          }}
        >
          {displayValue}
        </div>

        {params.variant === "trend" && delta && <DeltaBadge d={delta} />}

        {params.variant === "trend" && spark && (
          <div className="w-full mt-1">
            <Sparkline />
          </div>
        )}

        {caption}
      </div>
    </WidgetShell>
  );
}
