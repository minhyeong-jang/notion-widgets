"use client";

import { useState, useEffect, useMemo } from "react";
import { resolveColors, type ResolvedColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { WeekProgressParams } from "./schema";

interface WeekDay {
  label: string;
  date: number;
  dow: number; // 0=Sun .. 6=Sat
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isWeekend: boolean;
}

interface WeekInfo {
  days: WeekDay[];
  dayNumber: number; // 1..7 — position of today within the week
  percent: number; // 0..100 — fraction of the week elapsed (time-based)
  rangeLabel: string; // e.g. "Aug 18 – 24"
  weekNumber: number; // ISO-8601 week number
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** ISO-8601 week number (weeks start Monday, week 1 contains the first Thursday). */
function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  return (
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / DAY_MS -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7,
    )
  );
}

function buildWeek(now: Date, locale: string, firstDay: "sun" | "mon"): WeekInfo {
  const today = startOfDay(now);
  const todayDow = today.getDay(); // 0=Sun
  const startDow = firstDay === "mon" ? 1 : 0;
  const daysFromStart = (todayDow - startDow + 7) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - daysFromStart);

  const shortFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const days: WeekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const diff = Math.round((d.getTime() - today.getTime()) / DAY_MS);
    days.push({
      label: shortFmt.format(d),
      date: d.getDate(),
      dow: d.getDay(),
      isToday: diff === 0,
      isPast: diff < 0,
      isFuture: diff > 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }

  // Time-based elapsed fraction across the 7-day span.
  const elapsed = now.getTime() - weekStart.getTime();
  const percent = Math.min(100, Math.max(0, Math.round((elapsed / (7 * DAY_MS)) * 100)));

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "short" });
  const startMonth = monthFmt.format(weekStart);
  const endMonth = monthFmt.format(weekEnd);
  const rangeLabel =
    startMonth === endMonth
      ? `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}`
      : `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}`;

  return {
    days,
    dayNumber: daysFromStart + 1,
    percent,
    rangeLabel,
    weekNumber: isoWeekNumber(today),
  };
}

function ProgressMeter({
  info,
  params,
  colors,
  neon,
}: {
  info: WeekInfo;
  params: WeekProgressParams;
  colors: ResolvedColors;
  neon?: boolean;
}) {
  if (!params.showProgress) return null;
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const track = `#${colors.track}`;
  const textDim = `#${colors.textDim}`;
  const isKo = params.locale.startsWith("ko");
  const dayLabel = isKo
    ? `${info.dayNumber}일째 · 7일`
    : `Day ${info.dayNumber} of 7`;

  if (neon) {
    const filled = Math.round((info.percent / 100) * 12);
    const bar = "█".repeat(filled) + "░".repeat(12 - filled);
    return (
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: accentBright,
          marginTop: 12,
          opacity: 0.9,
          letterSpacing: "1px",
        }}
      >
        [{bar}] {info.percent}%
      </div>
    );
  }

  return (
    <div className="w-full" style={{ marginTop: 16 }}>
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 6 }}
      >
        <span className="text-[11px] font-medium" style={{ color: textDim }}>
          {dayLabel}
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: accent, textShadow: "var(--w-text-shadow)" }}
        >
          {info.percent}%
        </span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{ height: 6, borderRadius: 999, backgroundColor: track }}
      >
        <div
          style={{
            height: "100%",
            width: `${info.percent}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${accent}, ${accentBright})`,
            transition: "width .6s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function Header({
  info,
  params,
  colors,
}: {
  info: WeekInfo;
  params: WeekProgressParams;
  colors: ResolvedColors;
}) {
  const text = `#${colors.text}`;
  const textFaint = `#${colors.textFaint}`;
  const isKo = params.locale.startsWith("ko");
  const title = isKo ? "이번 주" : "This Week";
  const weekTag = isKo
    ? `${info.weekNumber}주차`
    : `Week ${info.weekNumber}`;

  return (
    <div
      className="flex items-baseline justify-between w-full"
      style={{ marginBottom: 14 }}
    >
      <h2
        className="text-sm font-semibold"
        style={{ color: text, textShadow: "var(--w-text-shadow)" }}
      >
        {title}
        <span className="ml-2 text-[11px] font-normal" style={{ color: textFaint }}>
          {info.rangeLabel}
        </span>
      </h2>
      {params.showWeekNumber && (
        <span className="text-[11px] font-medium" style={{ color: textFaint }}>
          {weekTag}
        </span>
      )}
    </div>
  );
}

/* ── Variant: Dots ───────────────────────────────────────────── */
function DotsWeek({
  info,
  params,
  colors,
}: {
  info: WeekInfo;
  params: WeekProgressParams;
  colors: ResolvedColors;
}) {
  const accent = `#${colors.accent}`;
  const btnText = `#${colors.btnText}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const dim = `#${colors.accentDim}`;
  const borderStrong = `#${colors.borderStrong}`;

  return (
    <div className="flex justify-between w-full" style={{ gap: 6 }}>
      {info.days.map((d, i) => {
        let circle: React.CSSProperties;
        let numColor: string;
        if (d.isToday) {
          circle = {
            backgroundColor: accent,
            boxShadow: `0 4px 12px ${accent}55`,
          };
          numColor = btnText;
        } else if (d.isPast) {
          circle = { backgroundColor: dim };
          numColor = textDim;
        } else {
          circle = { border: `1.5px solid ${borderStrong}` };
          numColor = textFaint;
        }
        return (
          <div key={i} className="flex flex-col items-center" style={{ gap: 6, flex: 1 }}>
            <span
              className="text-[10px] font-medium uppercase"
              style={{
                color: d.isToday ? accent : textFaint,
                opacity: d.isWeekend && !d.isToday ? 0.55 : 1,
                textShadow: d.isToday ? "var(--w-text-shadow)" : "none",
              }}
            >
              {d.label}
            </span>
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: d.isToday ? 700 : 500,
                color: numColor,
                transition: "all .3s ease",
                ...circle,
              }}
            >
              {d.date}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Variant: Bars ───────────────────────────────────────────── */
function BarsWeek({
  info,
  params,
  colors,
}: {
  info: WeekInfo;
  params: WeekProgressParams;
  colors: ResolvedColors;
}) {
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const track = `#${colors.track}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  return (
    <div className="flex justify-between items-end w-full" style={{ gap: 8, height: 72 }}>
      {info.days.map((d, i) => {
        // Bars rise from short (start of week) to full — a growing rhythm.
        const heightPct = 42 + (i / 6) * 58; // 42% .. 100%
        let barBg: string;
        if (d.isToday) barBg = `linear-gradient(180deg, ${accentBright}, ${accent})`;
        else if (d.isPast) barBg = accent;
        else barBg = track;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end"
            style={{ gap: 6, flex: 1, height: "100%" }}
          >
            <div className="flex-1 flex items-end w-full justify-center">
              <div
                style={{
                  width: "100%",
                  maxWidth: 20,
                  height: `${heightPct}%`,
                  borderRadius: 6,
                  background: barBg,
                  opacity: d.isFuture ? 1 : 1,
                  boxShadow: d.isToday ? `0 4px 12px ${accent}55` : "none",
                  transition: "all .4s ease",
                }}
              />
            </div>
            <span
              className="text-[10px] font-medium uppercase"
              style={{
                color: d.isToday ? accent : textFaint,
                textShadow: d.isToday ? "var(--w-text-shadow)" : "none",
              }}
            >
              {d.label}
            </span>
            <span
              className="text-[11px] tabular-nums"
              style={{
                color: d.isToday ? accent : d.isPast ? textDim : textFaint,
                fontWeight: d.isToday ? 700 : 400,
              }}
            >
              {d.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Variant: Row ────────────────────────────────────────────── */
function RowWeek({
  info,
  params,
  colors,
}: {
  info: WeekInfo;
  params: WeekProgressParams;
  colors: ResolvedColors;
}) {
  const accent = `#${colors.accent}`;
  const btnText = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const tint = `#${colors.accentTint}`;
  const borderSoft = `#${colors.borderSoft}`;

  return (
    <div
      className="flex w-full overflow-hidden"
      style={{ borderRadius: 12, border: `1px solid ${borderSoft}` }}
    >
      {info.days.map((d, i) => {
        const isLast = i === info.days.length - 1;
        let cellBg: string | undefined;
        if (d.isToday) cellBg = accent;
        else if (d.isPast) cellBg = tint;
        else cellBg = undefined;
        const labelColor = d.isToday ? btnText : d.isWeekend ? accent : textFaint;
        const dateColor = d.isToday ? btnText : d.isPast ? text : textDim;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center"
            style={{
              flex: 1,
              padding: "10px 2px",
              gap: 4,
              backgroundColor: cellBg,
              borderRight: isLast ? "none" : `1px solid ${borderSoft}`,
              transition: "background-color .3s ease",
            }}
          >
            <span
              className="text-[10px] font-semibold uppercase"
              style={{
                color: labelColor,
                opacity: d.isWeekend && !d.isToday ? 0.7 : 1,
              }}
            >
              {d.label}
            </span>
            <span
              className="text-[15px] tabular-nums"
              style={{ color: dateColor, fontWeight: d.isToday ? 700 : 500 }}
            >
              {d.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Variant: Neon ───────────────────────────────────────────── */
function NeonWeek({
  info,
  params,
  colors,
}: {
  info: WeekInfo;
  params: WeekProgressParams;
  colors: ResolvedColors;
}) {
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const bg = `#${colors.bg}`;
  const isKo = params.locale.startsWith("ko");
  const title = (isKo ? "이번 주" : "THIS WEEK").toUpperCase();

  return (
    <div
      className="mx-auto px-4"
      style={{ fontFamily: "monospace", color: accent, width: "100%", maxWidth: 340 }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 10, gap: 12 }}>
        <span style={{ fontSize: 12, letterSpacing: "2px", textShadow: `0 0 8px ${accent}`, whiteSpace: "nowrap" }}>
          {title}
        </span>
        <span style={{ fontSize: 11, opacity: 0.6, whiteSpace: "nowrap" }}>
          {info.rangeLabel.toUpperCase()}
        </span>
      </div>
      <div className="flex justify-between" style={{ gap: 4 }}>
        {info.days.map((d, i) => {
          const label = d.label.slice(0, 2).toUpperCase();
          return (
            <div key={i} className="flex flex-col items-center" style={{ gap: 5, flex: 1 }}>
              <span style={{ fontSize: 10, opacity: d.isToday ? 1 : 0.45 }}>{label}</span>
              {d.isToday ? (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: bg,
                    backgroundColor: accentBright,
                    padding: "1px 4px",
                    boxShadow: `0 0 10px ${accentBright}`,
                  }}
                >
                  {String(d.date).padStart(2, "0")}
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    opacity: d.isPast ? 0.85 : 0.3,
                    textShadow: d.isPast ? `0 0 6px ${accent}` : "none",
                  }}
                >
                  {String(d.date).padStart(2, "0")}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <ProgressMeter info={info} params={params} colors={colors} neon />
      {params.showWeekNumber && (
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8, letterSpacing: "1px" }}>
          {isKo ? `${info.weekNumber}주차` : `WEEK ${info.weekNumber}`}
        </div>
      )}
    </div>
  );
}

export function WeekProgressWidget({ params }: { params: WeekProgressParams }) {
  const [now, setNow] = useState(() => new Date());
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const info = useMemo(
    () => buildWeek(now, params.locale, params.firstDay),
    [now, params.locale, params.firstDay],
  );

  useEffect(() => {
    // Refresh at the next midnight so "today" stays correct.
    const n = new Date();
    const msUntilMidnight =
      new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime() - n.getTime();
    const timeout = setTimeout(() => setNow(new Date()), msUntilMidnight + 1000);
    return () => clearTimeout(timeout);
  }, [now]);

  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <NeonWeek info={info} params={params} colors={colors} />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell params={params}>
      <div
        className="flex flex-col w-full mx-auto px-1"
        style={{ maxWidth: 340 }}
      >
        <Header info={info} params={params} colors={colors} />
        {params.variant === "bars" ? (
          <BarsWeek info={info} params={params} colors={colors} />
        ) : params.variant === "row" ? (
          <RowWeek info={info} params={params} colors={colors} />
        ) : (
          <DotsWeek info={info} params={params} colors={colors} />
        )}
        <ProgressMeter info={info} params={params} colors={colors} />
      </div>
    </WidgetShell>
  );
}
