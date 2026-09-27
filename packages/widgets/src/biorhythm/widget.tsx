"use client";

import { useEffect, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { BiorhythmParams } from "./schema";
import { CYCLES, cycleValue, daysAlive, toPercent } from "./cycles";

interface Palette {
  cycle: [string, string, string];
  text: string;
  textDim: string;
  textFaint: string;
  track: string;
  border: string;
  isNeon: boolean;
}

const RANGE = 15; // days each side of today → ~1 month window

// Per-cycle dash pattern so overlapping curves stay distinguishable even when
// the accent shades are close (and for better accessibility).
const DASH: (string | undefined)[] = [undefined, "7 6", "1.5 5"];

export function BiorhythmWidget({ params }: { params: BiorhythmParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isKo = params.locale.startsWith("ko");
  const isNeon = params.style === "neon";

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const today = now ?? new Date(2026, 0, 1);

  const birth = new Date(params.birth + "T00:00:00");
  const days = daysAlive(birth, today);

  const palette: Palette = {
    cycle: [`#${colors.accent}`, `#${colors.accentBright}`, `#${colors.accentDeep}`],
    text: `#${colors.text}`,
    textDim: `#${colors.textDim}`,
    textFaint: `#${colors.textFaint}`,
    track: `#${colors.track}`,
    border: `#${colors.border}`,
    isNeon,
  };

  const todayValues = CYCLES.map((c) => cycleValue(days, c.period));
  const todayStr = today.toLocaleDateString(params.locale, { month: "short", day: "numeric" });
  const title = isKo ? "바이오리듬" : "Biorhythm";
  const dayLabel = isKo ? `${days.toLocaleString()}일째` : `Day ${days.toLocaleString()}`;

  let body;
  if (params.variant === "rings") {
    body = <RingsView values={todayValues} p={palette} isKo={isKo} />;
  } else if (params.variant === "bars") {
    body = <BarsView values={todayValues} p={palette} isKo={isKo} />;
  } else {
    body = <ChartView days={days} values={todayValues} p={palette} isKo={isKo} />;
  }

  return (
    <WidgetShell params={params}>
      <div
        className="flex flex-col items-center gap-4 px-6 w-full"
        style={{ maxWidth: 420, fontFamily: isNeon ? "var(--font-mono, 'Courier New', monospace)" : undefined }}
      >
        <div className="flex items-center justify-between w-full">
          <span
            className={`text-sm font-semibold ${isNeon ? "tracking-[0.25em] uppercase" : "tracking-wide"}`}
            style={{ color: isNeon ? palette.cycle[0] : palette.text, textShadow: isNeon ? "var(--w-text-shadow)" : undefined }}
          >
            {title}
          </span>
          <span className="text-xs" style={{ color: palette.textFaint }}>
            {todayStr} · {dayLabel}
          </span>
        </div>
        {body}
      </div>
    </WidgetShell>
  );
}

// ------------------------------------------------------------------ CHART
function ChartView({ days, values, p, isKo }: { days: number; values: number[]; p: Palette; isKo: boolean }) {
  const W = 380;
  const H = 150;
  const midY = H / 2;
  const amp = H / 2 - 10;
  const glow = p.isNeon ? { filter: "drop-shadow(0 0 4px currentColor)" } : undefined;

  const x = (d: number) => ((d + RANGE) / (2 * RANGE)) * W;
  const y = (v: number) => midY - v * amp;

  const curves = CYCLES.map((c) => {
    const pts: string[] = [];
    for (let d = -RANGE; d <= RANGE + 0.001; d += 0.5) {
      pts.push(`${x(d).toFixed(1)},${y(cycleValue(days + d, c.period)).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
        {/* zero midline */}
        <line x1={0} y1={midY} x2={W} y2={midY} stroke={p.border} strokeWidth={1} />
        {/* today marker */}
        <line x1={x(0)} y1={4} x2={x(0)} y2={H - 4} stroke={p.textFaint} strokeWidth={1} strokeDasharray="3 4" opacity={0.7} />
        {CYCLES.map((c, i) => (
          <g key={c.key} style={{ color: p.cycle[i], ...glow }}>
            <polyline
              points={curves[i]}
              fill="none"
              stroke={p.cycle[i]}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH[i]}
              opacity={0.95}
            />
            <circle cx={x(0)} cy={y(values[i])} r={4} fill={p.cycle[i]} stroke={p.isNeon ? p.cycle[i] : "#00000000"} />
          </g>
        ))}
      </svg>
      <Legend values={values} p={p} isKo={isKo} />
    </div>
  );
}

// ------------------------------------------------------------------ RINGS
function RingsView({ values, p, isKo }: { values: number[]; p: Palette; isKo: boolean }) {
  const size = 92;
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="w-full flex items-start justify-around gap-2 py-1">
      {CYCLES.map((cy, i) => {
        const v = values[i];
        const pct = toPercent(v);
        const frac = (v + 1) / 2;
        const color = p.cycle[i];
        const label = isKo ? cy.labelKo : cy.label;
        return (
          <div key={cy.key} className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.track} strokeWidth={7} />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={color}
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - frac)}
                  style={p.isNeon ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={{ color }}>
                  {pct > 0 ? "+" : ""}
                  {pct}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color: p.textDim }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------- BARS
function BarsView({ values, p, isKo }: { values: number[]; p: Palette; isKo: boolean }) {
  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {CYCLES.map((cy, i) => {
        const v = values[i];
        const pct = toPercent(v);
        const color = p.cycle[i];
        const label = isKo ? cy.labelKo : cy.label;
        const half = Math.min(50, Math.abs(v) * 50); // percent of full width from center
        return (
          <div key={cy.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: p.textDim }}>
                {label}
              </span>
              <span className="text-sm font-bold" style={{ color }}>
                {pct > 0 ? "+" : ""}
                {pct}%
              </span>
            </div>
            <div className="relative h-2.5 rounded-full" style={{ backgroundColor: p.track }}>
              {/* center tick */}
              <div className="absolute top-[-2px] bottom-[-2px]" style={{ left: "50%", width: 1, backgroundColor: p.border }} />
              <div
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  backgroundColor: color,
                  left: v >= 0 ? "50%" : `${50 - half}%`,
                  width: `${half}%`,
                  boxShadow: p.isNeon ? `0 0 8px ${color}` : undefined,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------- LEGEND
function Legend({ values, p, isKo }: { values: number[]; p: Palette; isKo: boolean }) {
  return (
    <div className="flex items-center justify-between w-full">
      {CYCLES.map((cy, i) => {
        const pct = toPercent(values[i]);
        const color = p.cycle[i];
        const label = isKo ? cy.labelKo : cy.label;
        return (
          <div key={cy.key} className="flex items-center gap-1.5">
            <svg width={20} height={8} aria-hidden="true" style={p.isNeon ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined}>
              <line
                x1={1}
                y1={4}
                x2={19}
                y2={4}
                stroke={color}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeDasharray={DASH[i]}
              />
            </svg>
            <span className="text-xs" style={{ color: p.textDim }}>
              {label}
            </span>
            <span className="text-xs font-semibold" style={{ color }}>
              {pct > 0 ? "+" : ""}
              {pct}
            </span>
          </div>
        );
      })}
    </div>
  );
}
