"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { YearProgressParams } from "./schema";

type DotState = "past" | "today" | "future";

interface Strings {
  yearProgress: string;
  daysLeft: (n: number) => string;
  dayOf: (d: number, t: number) => string;
}

function getStrings(locale: string): Strings {
  const lang = locale.slice(0, 2);
  switch (lang) {
    case "ko":
      return {
        yearProgress: "올해 진행률",
        daysLeft: (n) => `${n}일 남음`,
        dayOf: (d, t) => `${t}일 중 ${d}일째`,
      };
    case "ja":
      return {
        yearProgress: "今年の進捗",
        daysLeft: (n) => `残り${n}日`,
        dayOf: (d, t) => `${t}日中${d}日目`,
      };
    case "zh":
      return {
        yearProgress: "今年进度",
        daysLeft: (n) => `剩余 ${n} 天`,
        dayOf: (d, t) => `第 ${d} / ${t} 天`,
      };
    case "de":
      return {
        yearProgress: "Jahresfortschritt",
        daysLeft: (n) => `noch ${n} Tage`,
        dayOf: (d, t) => `Tag ${d} von ${t}`,
      };
    case "fr":
      return {
        yearProgress: "Progression de l'année",
        daysLeft: (n) => `${n} jours restants`,
        dayOf: (d, t) => `Jour ${d} sur ${t}`,
      };
    case "es":
      return {
        yearProgress: "Progreso del año",
        daysLeft: (n) => `${n} días restantes`,
        dayOf: (d, t) => `Día ${d} de ${t}`,
      };
    default:
      return {
        yearProgress: "Year Progress",
        daysLeft: (n) => `${n} days left`,
        dayOf: (d, t) => `Day ${d} of ${t}`,
      };
  }
}

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

const monoFont =
  "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

export function YearProgressWidget({ params }: { params: YearProgressParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  const s = getStrings(params.locale);

  // Gate on mount so build-time SSR and first client render match (every dot
  // renders as "future"), avoiding a hydration mismatch on date-derived state.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    // Re-check each minute so the highlight rolls over at midnight.
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const placeholder = now === null;
  const ref = now ?? new Date();
  const year = ref.getFullYear();
  const total = isLeap(year) ? 366 : 365;
  const doy = dayOfYear(ref); // 1-based day index of today
  const curIndex = placeholder ? -1 : doy; // -1 → all dots render as future
  const curMonth = placeholder ? -1 : ref.getMonth();
  const curDay = ref.getDate();

  const percent = Math.min(100, Math.floor((doy / total) * 100));
  const daysLeft = Math.max(0, total - doy);

  const mainTitle = params.label || String(year);
  const subtitle = params.label ? String(year) : s.yearProgress;

  // ---- dot styling -------------------------------------------------------
  const futureColor = hexToRgba(textFaint, isDark ? 0.3 : 0.24);

  function dotStyle(state: DotState, size: number, radius: number): CSSProperties {
    const base: CSSProperties = {
      width: size,
      height: size,
      borderRadius: radius,
      display: "inline-block",
      transition: "background-color 0.3s ease",
    };
    if (state === "future") {
      return { ...base, backgroundColor: futureColor };
    }
    if (state === "today") {
      return {
        ...base,
        backgroundColor: accentBright,
        boxShadow: isNeon
          ? `0 0 ${size}px ${accentBright}, 0 0 0 3px ${hexToRgba(accentBright, 0.4)}`
          : `0 0 0 3px ${hexToRgba(accentBright, 0.35)}`,
        animation: "nw-yp-pulse 1.8s ease-in-out infinite",
      };
    }
    // past
    return {
      ...base,
      backgroundColor: accent,
      boxShadow: isNeon ? `0 0 ${Math.round(size * 0.7)}px ${hexToRgba(colors.accent, 0.7)}` : undefined,
    };
  }

  function stateFor(index1: number): DotState {
    if (curIndex < 0 || index1 > curIndex) return "future";
    if (index1 === curIndex) return "today";
    return "past";
  }

  // ---- variants ----------------------------------------------------------
  let contentWidth = 332;
  let dots: React.ReactNode;

  if (params.variant === "grid") {
    const COLS = 24;
    const SIZE = 10;
    const GAP = 4;
    contentWidth = COLS * SIZE + (COLS - 1) * GAP;
    dots = (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`,
          gap: GAP,
          width: contentWidth,
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} style={dotStyle(stateFor(i + 1), SIZE, 2.5)} />
        ))}
      </div>
    );
  } else if (params.variant === "weeks") {
    const totalWeeks = Math.ceil(total / 7);
    const curWeek = placeholder ? -1 : Math.ceil(doy / 7);
    const COLS = 13;
    const SIZE = 14;
    const GAP = 8;
    contentWidth = COLS * SIZE + (COLS - 1) * GAP;
    dots = (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`,
          gap: GAP,
          width: contentWidth,
        }}
      >
        {Array.from({ length: totalWeeks }, (_, i) => {
          const w = i + 1;
          const state: DotState =
            curWeek < 0 || w > curWeek ? "future" : w === curWeek ? "today" : "past";
          return <span key={i} style={dotStyle(state, SIZE, SIZE / 2)} />;
        })}
      </div>
    );
  } else {
    // months
    const SIZE = 7;
    const GAP = 3;
    const labelW = 30;
    contentWidth = labelW + 8 + 31 * SIZE + 30 * GAP;
    dots = (
      <div style={{ display: "flex", flexDirection: "column", gap: 5, width: contentWidth }}>
        {Array.from({ length: 12 }, (_, m) => {
          const daysInMonth = new Date(year, m + 1, 0).getDate();
          const label = new Date(year, m, 1).toLocaleDateString(params.locale, {
            month: "short",
          });
          return (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: labelW,
                  flexShrink: 0,
                  fontSize: 10,
                  color: textFaint,
                  textAlign: "right",
                  fontFamily: isNeon ? monoFont : undefined,
                  textTransform: isNeon ? "uppercase" : undefined,
                  letterSpacing: isNeon ? "0.5px" : undefined,
                }}
              >
                {label}
              </span>
              <div style={{ display: "flex", gap: GAP, flexWrap: "nowrap" }}>
                {Array.from({ length: daysInMonth }, (_, di) => {
                  const day = di + 1;
                  let state: DotState = "future";
                  if (curMonth >= 0) {
                    if (m < curMonth) state = "past";
                    else if (m === curMonth) {
                      if (day < curDay) state = "past";
                      else if (day === curDay) state = "today";
                    }
                  }
                  return <span key={di} style={dotStyle(state, SIZE, 2)} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---- header + footer ---------------------------------------------------
  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: contentWidth,
        marginBottom: 14,
        gap: 12,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: isNeon ? accent : text,
            fontFamily: isNeon ? monoFont : undefined,
            letterSpacing: isNeon ? "1px" : "-0.01em",
            lineHeight: 1.1,
            textShadow: isNeon ? `0 0 10px ${hexToRgba(colors.accent, 0.5)}` : undefined,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isNeon && params.label ? `> ${mainTitle}` : mainTitle}
        </span>
        <span
          style={{
            fontSize: 11,
            color: textFaint,
            fontFamily: isNeon ? monoFont : undefined,
            letterSpacing: isNeon ? "0.5px" : undefined,
            textTransform: isNeon ? "uppercase" : undefined,
          }}
        >
          {subtitle}
        </span>
      </div>
      {params.showPercent && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            flexShrink: 0,
            opacity: placeholder ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: isNeon ? accentBright : accent,
              fontFamily: isNeon ? monoFont : undefined,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: isNeon ? `0 0 16px ${hexToRgba(colors.accentBright, 0.6)}` : undefined,
            }}
          >
            {percent}
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: isNeon ? accentBright : accent,
              opacity: 0.7,
            }}
          >
            %
          </span>
        </div>
      )}
    </div>
  );

  const footer = params.showRemaining ? (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: contentWidth,
        marginTop: 14,
        fontSize: 11.5,
        color: textDim,
        fontFamily: isNeon ? monoFont : undefined,
        letterSpacing: isNeon ? "0.5px" : undefined,
        opacity: placeholder ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <span>{s.dayOf(doy, total)}</span>
      <span style={{ color: isNeon ? accent : textDim, fontWeight: 600 }}>
        {s.daysLeft(daysLeft)}
      </span>
    </div>
  ) : null;

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes nw-yp-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.35); }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "6px 8px",
        }}
      >
        {header}
        {dots}
        {footer}
      </div>
    </WidgetShell>
  );
}
