"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { BinaryClockParams } from "./schema";

const pad = (n: number) => String(n).padStart(2, "0");

const monoFont =
  "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

// Bit weights, least-significant first (index 0 => value 1).
function bitsOf(value: number, count: number): boolean[] {
  const out: boolean[] = [];
  for (let i = 0; i < count; i++) out.push(((value >> i) & 1) === 1);
  return out;
}

type GroupKey = "h" | "m" | "s";

interface DotStyles {
  lit: CSSProperties;
  off: CSSProperties;
}

function Dot({ on, size, styles }: { on: boolean; size: number; styles: DotStyles }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        boxSizing: "border-box",
        transition: "background-color 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.35s ease",
        ...(on ? styles.lit : styles.off),
      }}
    />
  );
}

export function BinaryClockWidget({ params }: { params: BinaryClockParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";

  const litColor = isNeon ? `#${colors.accentBright}` : `#${colors.accent}`;

  // Dot appearance derived entirely from resolved colors (never hardcoded).
  const dotStyles: DotStyles = isNeon
    ? {
        lit: {
          backgroundColor: litColor,
          border: `1px solid ${litColor}`,
          boxShadow: `0 0 12px ${litColor}, 0 0 4px ${litColor}`,
        },
        off: {
          backgroundColor: "transparent",
          border: `1px solid #${colors.accentDim}`,
          opacity: 0.7,
        },
      }
    : {
        lit: {
          backgroundColor: litColor,
          border: `1px solid ${litColor}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.16)",
        },
        off: {
          backgroundColor: `#${colors.track}`,
          border: `1px solid #${colors.border}`,
        },
      };

  const labelColor = isNeon ? `#${colors.accent}` : `#${colors.textDim}`;
  const decimalColor = isNeon ? `#${colors.accentBright}` : `#${colors.text}`;

  const labelStyle: CSSProperties = {
    color: labelColor,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: isNeon ? "2px" : "0.12em",
    textTransform: "uppercase",
    fontFamily: isNeon ? monoFont : undefined,
    textShadow: "var(--w-text-shadow)",
  };

  const decimalStyle: CSSProperties = {
    color: decimalColor,
    fontSize: 15,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    fontFamily: monoFont,
    letterSpacing: "0.06em",
    textShadow: isNeon ? `0 0 10px ${litColor}88` : "var(--w-text-shadow)",
  };

  // Gate on mount so SSR and first client render match (avoids hydration
  // mismatch on the constantly changing time).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const placeholder = now === null;
  let hours = now ? now.getHours() : 0;
  const minutes = now ? now.getMinutes() : 0;
  const seconds = now ? now.getSeconds() : 0;

  let period = "";
  if (params.hour12) {
    period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const groups: { key: GroupKey; value: number; tensBits: number }[] = [
    { key: "h", value: hours, tensBits: params.hour12 ? 1 : 2 },
    { key: "m", value: minutes, tensBits: 3 },
  ];
  if (params.showSeconds) groups.push({ key: "s", value: seconds, tensBits: 3 });

  const label: Record<GroupKey, string> = { h: "HRS", m: "MIN", s: "SEC" };

  return (
    <WidgetShell params={params}>
      <div
        className="flex flex-col items-center"
        style={{ padding: "14px 22px", opacity: placeholder ? 0 : 1, transition: "opacity 0.3s ease" }}
      >
        {params.variant === "columns" ? (
          <ColumnsView
            groups={groups}
            dotStyles={dotStyles}
            labelStyle={labelStyle}
            decimalStyle={decimalStyle}
            label={label}
            period={period}
            showLabels={params.showLabels}
            showDecimal={params.showDecimal}
            hour12={params.hour12}
            separatorColor={`#${colors.borderStrong}`}
          />
        ) : (
          <RowsView
            groups={groups}
            dotStyles={dotStyles}
            labelStyle={labelStyle}
            decimalStyle={decimalStyle}
            label={label}
            period={period}
            showLabels={params.showLabels}
            showDecimal={params.showDecimal}
            hour12={params.hour12}
          />
        )}
      </div>
    </WidgetShell>
  );
}

/* ── Columns (classic BCD) ────────────────────────────────────────────── */

function ColumnsView({
  groups,
  dotStyles,
  labelStyle,
  decimalStyle,
  label,
  period,
  showLabels,
  showDecimal,
  hour12,
  separatorColor,
}: {
  groups: { key: GroupKey; value: number; tensBits: number }[];
  dotStyles: DotStyles;
  labelStyle: CSSProperties;
  decimalStyle: CSSProperties;
  label: Record<GroupKey, string>;
  period: string;
  showLabels: boolean;
  showDecimal: boolean;
  hour12: boolean;
  separatorColor: string;
}) {
  const dotSize = 18;
  const gap = 9;

  return (
    <div className="flex items-end justify-center" style={{ gap: 20 }}>
      {groups.map((g, gi) => {
        const tens = Math.floor(g.value / 10);
        const ones = g.value % 10;
        const columns = [
          bitsOf(tens, g.tensBits),
          bitsOf(ones, 4),
        ];
        return (
          <div key={g.key} className="flex items-end" style={{ gap: 20 }}>
            <div className="flex flex-col items-center" style={{ gap: 10 }}>
              {showLabels && <div style={labelStyle}>{label[g.key]}</div>}
              <div className="flex items-end" style={{ gap }}>
                {columns.map((bits, ci) => (
                  <div
                    key={ci}
                    className="flex"
                    style={{ flexDirection: "column-reverse", gap }}
                  >
                    {bits.map((on, bi) => (
                      <Dot key={bi} on={on} size={dotSize} styles={dotStyles} />
                    ))}
                  </div>
                ))}
              </div>
              {showDecimal && (
                <div style={decimalStyle}>
                  {pad(g.value)}
                  {g.key === "h" && hour12 ? (
                    <span style={{ fontSize: 10, marginLeft: 3, opacity: 0.75 }}>{period}</span>
                  ) : null}
                </div>
              )}
            </div>
            {gi < groups.length - 1 && (
              <div
                aria-hidden
                style={{
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: showDecimal ? 24 : showLabels ? 0 : 0,
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: separatorColor }} />
                <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: separatorColor }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Rows (one binary number per unit) ────────────────────────────────── */

function RowsView({
  groups,
  dotStyles,
  labelStyle,
  decimalStyle,
  label,
  period,
  showLabels,
  showDecimal,
  hour12,
}: {
  groups: { key: GroupKey; value: number; tensBits: number }[];
  dotStyles: DotStyles;
  labelStyle: CSSProperties;
  decimalStyle: CSSProperties;
  label: Record<GroupKey, string>;
  period: string;
  showLabels: boolean;
  showDecimal: boolean;
  hour12: boolean;
}) {
  const dotSize = 16;
  const gap = 9;
  const bitCount = 6; // 0-59 fits in 6 bits; hours reuse the same width

  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {groups.map((g) => {
        // MSB (left) -> LSB (right)
        const bits = bitsOf(g.value, bitCount).reverse();
        return (
          <div key={g.key} className="flex items-center" style={{ gap: 12 }}>
            {showLabels && (
              <div style={{ ...labelStyle, width: 34, textAlign: "right" }}>{label[g.key]}</div>
            )}
            <div className="flex items-center" style={{ gap }}>
              {bits.map((on, bi) => (
                <Dot key={bi} on={on} size={dotSize} styles={dotStyles} />
              ))}
            </div>
            {showDecimal && (
              <div style={{ ...decimalStyle, width: 42, textAlign: "left" }}>
                {pad(g.value)}
                {g.key === "h" && hour12 ? (
                  <span style={{ fontSize: 10, marginLeft: 3, opacity: 0.75 }}>{period}</span>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
