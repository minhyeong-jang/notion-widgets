"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ActivityRingsParams } from "./schema";

interface RingSpec {
  value: number; // raw value (may exceed 100)
  label: string;
  color: string; // hex with leading #
}

function clampPct(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/**
 * A single circular progress ring drawn with SVG.
 * Track + progress arc, rounded caps, starts at 12 o'clock going clockwise.
 */
function Ring({
  cx,
  cy,
  r,
  stroke,
  value,
  color,
  track,
  glow,
}: {
  cx: number;
  cy: number;
  r: number;
  stroke: number;
  value: number;
  color: string;
  track: string;
  glow?: string;
}) {
  const circ = 2 * Math.PI * r;
  const pct = clampPct(value);
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct / 100)}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: glow, transition: "stroke-dashoffset 0.6s ease" }}
      />
    </>
  );
}

export function ActivityRingsWidget({ params }: { params: ActivityRingsParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";

  // All ring colors are derived from the chosen accent — never hardcoded.
  const rings: RingSpec[] = [
    { value: params.r1, label: params.l1, color: `#${colors.accentBright}` },
    { value: params.r2, label: params.l2, color: `#${colors.accent}` },
    { value: params.r3, label: params.l3, color: `#${colors.accentDeep}` },
  ];

  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = isNeon ? `#${colors.accent}26` : `#${colors.track}`;

  const glow = (c: string) => (isNeon ? `drop-shadow(0 0 5px ${c})` : undefined);

  const monoFamily = isNeon ? "monospace" : undefined;

  const renderLegend = () => {
    if (!params.showLegend) return null;
    return (
      <div className="flex flex-col" style={{ gap: 7 }}>
        {rings.map((ring, i) => (
          <div key={i} className="flex items-center" style={{ gap: 8 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: ring.color,
                boxShadow: isNeon ? `0 0 6px ${ring.color}` : undefined,
                flexShrink: 0,
              }}
            />
            <span
              className="text-[13px] font-medium"
              style={{
                color: isNeon ? ring.color : textDim,
                fontFamily: monoFamily,
                textShadow: "var(--w-text-shadow)",
                minWidth: 50,
                whiteSpace: "nowrap",
              }}
            >
              {isNeon ? ring.label.toUpperCase() : ring.label}
            </span>
            <span
              className="text-[13px] font-bold tabular-nums"
              style={{
                color: isNeon ? ring.color : text,
                fontFamily: monoFamily,
                textShadow: "var(--w-text-shadow)",
                marginLeft: "auto",
                paddingLeft: 8,
              }}
            >
              {Math.round(ring.value)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  // ─── Row variant: three separate mini rings side by side ───
  if (params.variant === "row") {
    const MINI = 84;
    const MSTROKE = isNeon ? 8 : 10;
    const mr = (MINI - MSTROKE) / 2 - 2;
    const mc = MINI / 2;

    return (
      <WidgetShell params={params}>
        <div className="flex items-start justify-center flex-wrap" style={{ gap: 18, padding: "8px 10px" }}>
          {rings.map((ring, i) => (
            <div key={i} className="flex flex-col items-center" style={{ gap: 8 }}>
              <div className="relative" style={{ width: MINI, height: MINI }}>
                <svg width={MINI} height={MINI} viewBox={`0 0 ${MINI} ${MINI}`} style={{ overflow: "visible" }}>
                  <Ring
                    cx={mc}
                    cy={mc}
                    r={mr}
                    stroke={MSTROKE}
                    value={ring.value}
                    color={ring.color}
                    track={track}
                    glow={glow(ring.color)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-bold tabular-nums leading-none"
                    style={{
                      fontSize: 22,
                      color: isNeon ? ring.color : text,
                      fontFamily: monoFamily,
                      textShadow: "var(--w-text-shadow)",
                    }}
                  >
                    {Math.round(ring.value)}
                    <span style={{ fontSize: 12, opacity: 0.7 }}>%</span>
                  </span>
                </div>
              </div>
              <span
                className="text-xs font-medium text-center"
                style={{
                  color: isNeon ? ring.color : textFaint,
                  fontFamily: monoFamily,
                  textShadow: "var(--w-text-shadow)",
                  letterSpacing: isNeon ? "1px" : undefined,
                }}
              >
                {isNeon ? ring.label.toUpperCase() : ring.label}
              </span>
            </div>
          ))}
        </div>
      </WidgetShell>
    );
  }

  // ─── Rings variant: concentric Apple-Watch-style rings + legend ───
  const SIZE = 140;
  const STROKE = isNeon ? 11 : 14;
  const GAP = isNeon ? 5 : 4;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rOuter = (SIZE - STROKE) / 2 - 2;
  const rMid = rOuter - STROKE - GAP;
  const rInner = rMid - STROKE - GAP;
  const radii = [rOuter, rMid, rInner];

  return (
    <WidgetShell params={params}>
      <div className="flex items-center justify-center flex-wrap" style={{ gap: 18, padding: "8px 12px" }}>
        <div className="relative" style={{ width: SIZE, height: SIZE, flexShrink: 0 }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: "visible" }}>
            {rings.map((ring, i) => (
              <Ring
                key={i}
                cx={cx}
                cy={cy}
                r={radii[i]}
                stroke={STROKE}
                value={ring.value}
                color={ring.color}
                track={track}
                glow={glow(ring.color)}
              />
            ))}
          </svg>
        </div>
        {renderLegend()}
      </div>
    </WidgetShell>
  );
}
