"use client";

import { useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { SpinnerParams } from "./schema";

const CENTER = 100;
const RADIUS = 92;
const LABEL_RADIUS = RADIUS * 0.6;

/** Convert an angle (measured clockwise from the top, 12 o'clock) into an SVG point. */
function polar(angleDeg: number, r: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)];
}

function segmentPath(startAngle: number, endAngle: number): string {
  const [x1, y1] = polar(startAngle, RADIUS);
  const [x2, y2] = polar(endAngle, RADIUS);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/** Pick a readable label color for a solid hex fill via relative luminance. */
function textOn(fill: string): string {
  if (!fill.startsWith("#")) return "#ffffff";
  const hex = fill.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#1a1712" : "#ffffff";
}

function truncate(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export function SpinnerWidget({ params }: { params: SpinnerParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isDark = colorMode === "dark";
  const isNeon = params.style === "neon";
  const isKo = params.locale.startsWith("ko");

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;

  const options = params.options
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);
  const segments = options.length >= 2 ? options : ["A", "B"];
  const n = segments.length;
  const seg = 360 / n;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Separator + rim color adapts to the surrounding surface so slices read crisp.
  const sepColor = isNeon
    ? `#${colors.bg}`
    : isDark
      ? `#${colors.surface2}`
      : "#ffffff";
  const hubFill = isNeon || isDark ? `#${colors.surface2}` : "#ffffff";
  const wheelGlow = isNeon ? `drop-shadow(0 0 8px ${accent})` : undefined;

  function segFill(i: number): string {
    if (params.variant === "accent") {
      const tones = [accent, accentDeep, accentBright];
      return tones[i % tones.length];
    }
    const hue = Math.round((i * 360) / n);
    const l = isDark ? 50 : 48;
    return `hsl(${hue} 62% ${l}%)`;
  }

  function labelColor(fill: string): string {
    return fill.startsWith("#") ? textOn(fill) : "#ffffff";
  }

  function spin() {
    if (spinning) return;
    const target = Math.floor(Math.random() * n);
    // Land the chosen slice's center directly under the top pointer.
    const landing = (360 - (target + 0.5) * seg) % 360;
    const base = rotation - (rotation % 360);
    let next = base + 360 * 5 + landing;
    if (next <= rotation) next += 360;
    setResult(null);
    setSpinning(true);
    setRotation(next);
    window.setTimeout(() => {
      setResult(segments[target]);
      setSpinning(false);
    }, 4200);
  }

  const spinLabel = spinning
    ? isKo
      ? "돌리는 중…"
      : "Spinning…"
    : isKo
      ? "돌리기"
      : "Spin";

  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center" style={{ gap: 16 }}>
        {params.title && (
          <div
            className="text-xs font-semibold uppercase"
            style={{
              color: accent,
              letterSpacing: "0.14em",
              textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
            }}
          >
            {params.title}
          </div>
        )}

        <div style={{ position: "relative", width: 236, height: 236 }}>
          <svg
            viewBox="0 0 200 200"
            width={236}
            height={236}
            style={{ filter: wheelGlow, display: "block" }}
          >
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "100px 100px",
                transition: spinning
                  ? "transform 4.2s cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
              }}
            >
              {segments.map((label, i) => {
                const start = i * seg;
                const end = start + seg;
                const fill = segFill(i);
                const mid = start + seg / 2;
                const [lx, ly] = polar(mid, LABEL_RADIUS);
                const fontSize = n > 7 ? 8 : n > 5 ? 9 : 10;
                const maxChars = n >= 8 ? 7 : n >= 6 ? 8 : 10;
                return (
                  <g key={i}>
                    <path
                      d={segmentPath(start, end)}
                      fill={fill}
                      stroke={sepColor}
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                    <text
                      x={lx}
                      y={ly}
                      fill={labelColor(fill)}
                      fontSize={fontSize}
                      fontWeight={600}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ pointerEvents: "none" }}
                    >
                      {truncate(label, maxChars)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Outer rim */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={accent}
              strokeWidth={3}
            />

            {/* Center hub */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={19}
              fill={hubFill}
              stroke={accent}
              strokeWidth={3}
            />
            <circle cx={CENTER} cy={CENTER} r={6} fill={accent} />
          </svg>

          {/* Pointer at the top, pointing into the wheel */}
          <svg
            viewBox="0 0 40 40"
            width={30}
            height={30}
            style={{
              position: "absolute",
              top: -6,
              left: "50%",
              transform: "translateX(-50%)",
              filter: isNeon
                ? `drop-shadow(0 0 6px ${accentBright})`
                : "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
            }}
          >
            <path
              d="M20 32 L8 8 L32 8 Z"
              fill={accentBright}
              stroke={sepColor}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          style={{
            background: accent,
            color: `#${colors.btnText}`,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.02em",
            padding: "9px 26px",
            borderRadius: 999,
            border: "none",
            cursor: spinning ? "default" : "pointer",
            opacity: spinning ? 0.7 : 1,
            boxShadow: isNeon
              ? `0 0 14px ${accent}`
              : `0 3px 12px ${colors.accentTint}`,
            transition: "opacity 0.2s ease",
          }}
        >
          {spinLabel}
        </button>

        <div
          style={{
            minHeight: 22,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {result && (
            <>
              <span style={{ color: `#${colors.textDim}`, fontSize: 13 }}>
                {isKo ? "결과" : "Result"}
              </span>
              <span
                style={{
                  color: accent,
                  fontSize: 16,
                  fontWeight: 700,
                  textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
                }}
              >
                {result}
              </span>
            </>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
