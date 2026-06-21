"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { GoalRingParams } from "./schema";

function clampPct(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, (current / target) * 100));
}

/** Polar → cartesian, angle in degrees, 0° at 12 o'clock, clockwise. */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function GoalRingWidget({ params }: { params: GoalRingParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;

  const isNeon = params.style === "neon";
  const isGlass = params.style === "glass";
  const isSoft = params.style === "soft";

  const pct = clampPct(params.current, params.target);
  const pctRounded = Math.round(pct);

  // In neon, the track is a dim version of the accent for a "circuit" look.
  const trackColor = isNeon ? `${accent}26` : track;
  const arcGlow = isNeon ? `drop-shadow(0 0 6px ${accentBright})` : undefined;

  const bigText = params.showPercent ? `${pctRounded}%` : `${params.current}`;
  const subText = params.showPercent
    ? `${params.current} / ${params.target}${params.unit ? ` ${params.unit}` : ""}`
    : `/ ${params.target}${params.unit ? ` ${params.unit}` : ""}`;

  const labelStyle: React.CSSProperties = {
    color: isNeon ? accentBright : textDim,
    textShadow: "var(--w-text-shadow)",
    fontFamily: isNeon ? "monospace" : undefined,
    letterSpacing: isNeon ? "2px" : "0.04em",
    textTransform: "uppercase",
  };

  const renderLabel = () =>
    params.label ? (
      <div className="text-[11px] font-semibold" style={labelStyle}>
        {isNeon ? `> ${params.label}` : params.label}
      </div>
    ) : null;

  const renderSub = () => (
    <div
      className="text-xs font-medium tabular-nums"
      style={{
        color: isNeon ? accent : textFaint,
        opacity: isNeon ? 0.7 : 1,
        fontFamily: isNeon ? "monospace" : undefined,
      }}
    >
      {subText}
    </div>
  );

  // ─── Shared SVG geometry ───
  const SIZE = 180;
  const STROKE = isNeon ? 9 : 13;
  const r = (SIZE - STROKE) / 2 - 2;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const gradId = `goalring-grad-${params.accent}-${mode}`;
  const gradient = (
    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={accent} />
      <stop offset="100%" stopColor={accentBright} />
    </linearGradient>
  );

  let inner: React.ReactNode;

  if (params.variant === "gauge") {
    // 270° gauge: open at the bottom, sweeping clockwise from bottom-left.
    const startDeg = 225; // bottom-left
    const sweep = 270;
    const a0 = polar(cx, cy, r, startDeg);
    const a1 = polar(cx, cy, r, startDeg + sweep);
    const trackPath = `M ${a0.x} ${a0.y} A ${r} ${r} 0 1 1 ${a1.x} ${a1.y}`;
    const arcLen = (sweep / 360) * 2 * Math.PI * r;

    inner = (
      <div className="flex flex-col items-center" style={{ gap: 2 }}>
        {renderLabel()}
        <div className="relative" style={{ width: SIZE, height: SIZE * 0.86 }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: "visible" }}>
            <defs>{gradient}</defs>
            <path d={trackPath} fill="none" stroke={trackColor} strokeWidth={STROKE} strokeLinecap="round" />
            <path
              d={trackPath}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={arcLen}
              strokeDashoffset={arcLen * (1 - pct / 100)}
              style={{ filter: arcGlow, transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: SIZE * 0.06 }}>
            <div
              className="font-bold tabular-nums leading-none"
              style={{ fontSize: 40, color: isNeon ? accentBright : text, textShadow: "var(--w-text-shadow)", fontFamily: isNeon ? "monospace" : undefined }}
            >
              {bigText}
            </div>
            <div className="mt-1.5">{renderSub()}</div>
          </div>
        </div>
      </div>
    );
  } else if (params.variant === "segments") {
    // Ticked ring — N radial ticks, filled up to the current progress.
    const N = 44;
    const filled = Math.round((pct / 100) * N);
    const rOuter = r + STROKE / 2;
    const rInner = r - STROKE / 2;
    const tickW = isNeon ? 2.5 : 3.5;

    inner = (
      <div className="flex flex-col items-center" style={{ gap: 10 }}>
        {renderLabel()}
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: "visible" }}>
            <defs>{gradient}</defs>
            {Array.from({ length: N }).map((_, i) => {
              const deg = (i / N) * 360;
              const p1 = polar(cx, cy, rOuter, deg);
              const p2 = polar(cx, cy, rInner, deg);
              const isOn = i < filled;
              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isOn ? `url(#${gradId})` : trackColor}
                  strokeWidth={tickW}
                  strokeLinecap="round"
                  style={{ filter: isOn ? arcGlow : undefined }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-bold tabular-nums leading-none"
              style={{ fontSize: 40, color: isNeon ? accentBright : text, textShadow: "var(--w-text-shadow)", fontFamily: isNeon ? "monospace" : undefined }}
            >
              {bigText}
            </div>
            <div className="mt-1.5">{renderSub()}</div>
          </div>
        </div>
      </div>
    );
  } else {
    // Default: full circular ring.
    const circ = 2 * Math.PI * r;
    inner = (
      <div className="flex flex-col items-center" style={{ gap: 10 }}>
        {renderLabel()}
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: "visible" }}>
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
              strokeDashoffset={circ * (1 - pct / 100)}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: arcGlow, transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-bold tabular-nums leading-none"
              style={{ fontSize: 44, color: isNeon ? accentBright : text, textShadow: "var(--w-text-shadow)", fontFamily: isNeon ? "monospace" : undefined }}
            >
              {bigText}
            </div>
            <div className="mt-1.5">{renderSub()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Soft & glass get a subtle inner card so they read distinctly from minimal.
  const cardStyle: React.CSSProperties =
    isSoft
      ? {
          background: mode === "dark" ? `#${colors.surface}` : `#${colors.surface}`,
          borderRadius: "var(--w-radius)",
          boxShadow: "var(--w-box-shadow)",
          border: `1px solid #${colors.border}`,
          padding: "22px 30px",
        }
      : isGlass
        ? {
            background: colors.accentTint.startsWith("#") ? colors.accentTint : `#${colors.accentTint}`,
            borderRadius: "var(--w-radius)",
            boxShadow: "var(--w-box-shadow)",
            border: `1px solid ${accent}33`,
            padding: "22px 30px",
          }
        : { padding: "8px 16px" };

  return (
    <WidgetShell params={params}>
      <div style={cardStyle}>{inner}</div>
    </WidgetShell>
  );
}
