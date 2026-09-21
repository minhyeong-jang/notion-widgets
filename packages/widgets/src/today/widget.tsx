"use client";

import { useState, useEffect } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { TodayParams } from "./schema";

/* ─── Date helpers ─── */

function fmt(date: Date, locale: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ISO 8601 week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getSubInfoText(date: Date, subInfo: TodayParams["subInfo"], locale: string): string | null {
  const isKo = locale.slice(0, 2) === "ko";
  const isJa = locale.slice(0, 2) === "ja";
  const isZh = locale.slice(0, 2) === "zh";
  if (subInfo === "dayOfYear") {
    const n = getDayOfYear(date);
    if (isKo) return `올해 ${n}일째`;
    if (isJa) return `今年 ${n} 日目`;
    if (isZh) return `今年第 ${n} 天`;
    return `Day ${n} of ${date.getFullYear()}`;
  }
  if (subInfo === "weekNumber") {
    const n = getWeekNumber(date);
    if (isKo) return `${n}번째 주`;
    if (isJa) return `第 ${n} 週`;
    if (isZh) return `第 ${n} 周`;
    return `Week ${n}`;
  }
  return null;
}

/* ─── Stack: number-forward vertical layout ─── */

function StackVariant({
  date,
  params,
  c,
}: {
  date: Date;
  params: TodayParams;
  c: ReturnType<typeof resolveColors>;
}) {
  const accentColor = `#${c.accent}`;
  const textColor = `#${c.text}`;
  const dimColor = `#${c.textDim}`;
  const weekday = fmt(date, params.locale, { weekday: "long" });
  const monthYear = fmt(date, params.locale, { month: "long", year: "numeric" });
  const sub = getSubInfoText(date, params.subInfo, params.locale);

  return (
    <div className="flex flex-col items-center px-8">
      <span
        className="text-sm font-semibold uppercase tracking-[0.22em]"
        style={{ color: accentColor, textShadow: "var(--w-text-shadow)" }}
      >
        {weekday}
      </span>
      <span
        className="font-bold leading-none tabular-nums"
        style={{
          color: textColor,
          fontSize: "6.5rem",
          marginTop: "0.35rem",
          marginBottom: "0.35rem",
          textShadow: "var(--w-text-shadow)",
        }}
      >
        {date.getDate()}
      </span>
      <span className="text-lg font-medium capitalize" style={{ color: dimColor }}>
        {monthYear}
      </span>
      {sub && (
        <span
          className="mt-2 text-xs font-medium tracking-wide"
          style={{ color: accentColor, opacity: 0.75 }}
        >
          {sub}
        </span>
      )}
      {params.note && (
        <span
          className="mt-1.5 text-sm font-medium text-center"
          style={{ color: dimColor, opacity: 0.9 }}
        >
          {params.note}
        </span>
      )}
    </div>
  );
}

/* ─── Page: tear-off calendar page ─── */

function PageVariant({
  date,
  params,
  c,
  isCardStyle,
}: {
  date: Date;
  params: TodayParams;
  c: ReturnType<typeof resolveColors>;
  isCardStyle: boolean;
}) {
  const accentColor = `#${c.accent}`;
  const textColor = `#${c.text}`;
  const dimColor = `#${c.textDim}`;
  const btnText = `#${c.btnText}`;
  const surfaceBg = `#${c.surface}`;
  const borderColor = `#${c.border}`;
  const month = fmt(date, params.locale, { month: "long" }).toUpperCase();
  const weekday = fmt(date, params.locale, { weekday: "long" });
  const sub = getSubInfoText(date, params.subInfo, params.locale);

  return (
    <div
      className="relative"
      style={{
        width: 208,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: isCardStyle ? "transparent" : surfaceBg,
        border: isCardStyle ? "none" : `1px solid ${borderColor}`,
        boxShadow: isCardStyle ? "none" : "0 6px 22px rgba(0,0,0,0.10)",
      }}
    >
      {/* Binder holes */}
      <div
        className="absolute left-0 right-0 flex justify-center gap-8 pointer-events-none z-10"
        style={{ top: 6 }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: isCardStyle ? borderColor : surfaceBg,
            border: `1.5px solid ${btnText}`,
            opacity: 0.55,
          }}
        />
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: isCardStyle ? borderColor : surfaceBg,
            border: `1.5px solid ${btnText}`,
            opacity: 0.55,
          }}
        />
      </div>

      {/* Header band */}
      <div
        className="text-center font-bold tracking-[0.18em]"
        style={{
          backgroundColor: accentColor,
          color: btnText,
          paddingTop: 14,
          paddingBottom: 8,
          fontSize: "0.8rem",
        }}
      >
        {month}
      </div>

      {/* Body */}
      <div
        className="flex flex-col items-center"
        style={{ paddingTop: 14, paddingBottom: 18 }}
      >
        <span
          className="font-bold leading-none tabular-nums"
          style={{ color: textColor, fontSize: "4.75rem", textShadow: "var(--w-text-shadow)" }}
        >
          {date.getDate()}
        </span>
        <span
          className="mt-2 text-sm font-medium uppercase tracking-[0.14em]"
          style={{ color: dimColor }}
        >
          {weekday}
        </span>
        {sub && (
          <span
            className="mt-1.5 text-[11px] font-medium tracking-wide"
            style={{ color: accentColor, opacity: 0.8 }}
          >
            {sub}
          </span>
        )}
        {params.note && (
          <span
            className="mt-1.5 text-xs font-medium text-center px-3"
            style={{ color: dimColor, opacity: 0.9 }}
          >
            {params.note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Banner: horizontal date badge ─── */

function BannerVariant({
  date,
  params,
  c,
}: {
  date: Date;
  params: TodayParams;
  c: ReturnType<typeof resolveColors>;
}) {
  const accentColor = `#${c.accent}`;
  const textColor = `#${c.text}`;
  const dimColor = `#${c.textDim}`;
  const btnText = `#${c.btnText}`;
  const weekdayShort = fmt(date, params.locale, { weekday: "short" }).toUpperCase();
  const weekdayLong = fmt(date, params.locale, { weekday: "long" });
  const monthYear = fmt(date, params.locale, { month: "long", year: "numeric" });
  const sub = getSubInfoText(date, params.subInfo, params.locale);

  return (
    <div className="flex items-center gap-4 px-6">
      {/* Accent date tile */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          backgroundColor: accentColor,
          borderRadius: 16,
          width: 82,
          height: 82,
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: btnText, opacity: 0.85 }}
        >
          {weekdayShort}
        </span>
        <span
          className="font-bold leading-none tabular-nums"
          style={{ color: btnText, fontSize: "2.5rem", marginTop: 2 }}
        >
          {date.getDate()}
        </span>
      </div>

      {/* Text block */}
      <div className="flex flex-col">
        <span className="text-xl font-semibold" style={{ color: textColor, textShadow: "var(--w-text-shadow)" }}>
          {weekdayLong}
        </span>
        <span className="text-base font-medium capitalize" style={{ color: dimColor }}>
          {monthYear}
        </span>
        {sub && (
          <span className="mt-1 text-xs font-medium tracking-wide" style={{ color: accentColor, opacity: 0.8 }}>
            {sub}
          </span>
        )}
        {params.note && (
          <span className="mt-1 text-sm font-medium" style={{ color: dimColor, opacity: 0.9 }}>
            {params.note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Neon: terminal / retro-display treatment ─── */

function NeonVariant({
  date,
  params,
  accentColor,
}: {
  date: Date;
  params: TodayParams;
  accentColor: string;
}) {
  const weekday = fmt(date, params.locale, { weekday: "long" }).toUpperCase();
  const monthShort = fmt(date, params.locale, { month: "short" }).toUpperCase();
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  const sub = getSubInfoText(date, params.subInfo, params.locale);

  const mono: React.CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: accentColor,
    textShadow: `0 0 8px ${accentColor}, 0 0 18px ${accentColor}66`,
  };

  const cursor = (
    <span style={{ animation: "today-neon-blink 1s step-end infinite", marginLeft: 2 }}>_</span>
  );

  return (
    <div className="px-8" style={mono}>
      <style>{`@keyframes today-neon-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }`}</style>

      {params.variant === "banner" ? (
        <div className="text-left">
          <div style={{ fontSize: "0.75rem", opacity: 0.55 }}>&gt; date --today</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", letterSpacing: "0.04em", marginTop: 6 }}>
            {yyyy}.{String(date.getMonth() + 1).padStart(2, "0")}.{dd}
            {cursor}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.7, letterSpacing: "0.2em", marginTop: 4 }}>{weekday}</div>
          {sub && (
            <div style={{ fontSize: "0.7rem", opacity: 0.5, marginTop: 6 }}>[ {sub} ]</div>
          )}
          {params.note && (
            <div style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: 6 }}>&gt; {params.note}</div>
          )}
        </div>
      ) : params.variant === "page" ? (
        <div className="text-center" style={{ letterSpacing: "0.02em" }}>
          <div style={{ opacity: 0.45, fontSize: "0.85rem" }}>{"┌" + "─".repeat(11) + "┐"}</div>
          <div style={{ fontSize: "0.85rem" }}>
            <span style={{ opacity: 0.45 }}>{"│ "}</span>
            <span style={{ letterSpacing: "0.28em" }}>{monthShort.padStart(6).padEnd(9)}</span>
            <span style={{ opacity: 0.45 }}>{" │"}</span>
          </div>
          <div style={{ opacity: 0.45, fontSize: "0.85rem" }}>{"├" + "─".repeat(11) + "┤"}</div>
          <div style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: 1.1, margin: "2px 0" }}>{dd}</div>
          <div style={{ opacity: 0.45, fontSize: "0.85rem" }}>{"└" + "─".repeat(11) + "┘"}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7, letterSpacing: "0.18em", marginTop: 8 }}>{weekday}</div>
          {sub && <div style={{ fontSize: "0.7rem", opacity: 0.5, marginTop: 4 }}>[ {sub} ]</div>}
          {params.note && <div style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: 4 }}>&gt; {params.note}</div>}
        </div>
      ) : (
        <div className="text-center">
          <div style={{ fontSize: "0.8rem", opacity: 0.6, letterSpacing: "0.22em" }}>{weekday}</div>
          <div style={{ fontSize: "5.5rem", fontWeight: "bold", lineHeight: 1, margin: "6px 0" }}>
            {dd}
          </div>
          <div style={{ fontSize: "0.95rem", opacity: 0.75, letterSpacing: "0.14em" }}>
            {monthShort} {yyyy}
            {cursor}
          </div>
          {sub && <div style={{ fontSize: "0.72rem", opacity: 0.5, marginTop: 8 }}>[ {sub} ]</div>}
          {params.note && <div style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: 8 }}>&gt; {params.note}</div>}
        </div>
      )}
    </div>
  );
}

/* ─── Main ─── */

export function TodayWidget({ params }: { params: TodayParams }) {
  const [date, setDate] = useState(() => new Date());
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  useEffect(() => {
    // Re-render at midnight so the date stays current.
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timeout = setTimeout(() => setDate(new Date()), msUntilMidnight + 500);
    return () => clearTimeout(timeout);
  }, [date]);

  const isCardStyle = params.style === "soft" || params.style === "glass";

  return (
    <WidgetShell params={params}>
      {params.style === "neon" ? (
        <NeonVariant date={date} params={params} accentColor={`#${colors.accent}`} />
      ) : params.variant === "page" ? (
        <PageVariant date={date} params={params} c={colors} isCardStyle={isCardStyle} />
      ) : params.variant === "banner" ? (
        <BannerVariant date={date} params={params} c={colors} />
      ) : (
        <StackVariant date={date} params={params} c={colors} />
      )}
    </WidgetShell>
  );
}
