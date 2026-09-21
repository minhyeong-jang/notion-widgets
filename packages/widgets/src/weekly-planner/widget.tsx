"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { WeeklyPlannerParams } from "./schema";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const ORDER_MON: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const ORDER_SUN: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const WEEKEND: Set<DayKey> = new Set(["sat", "sun"]);

interface DayInfo {
  key: DayKey;
  date: Date;
  weekday: string;
  dayNum: number;
  task: string;
  isToday: boolean;
  isWeekend: boolean;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildWeek(params: WeeklyPlannerParams): {
  days: DayInfo[];
  rangeLabel: string;
} {
  const today = new Date();
  const dow = today.getDay(); // 0 = Sun … 6 = Sat
  const startDow = params.weekStart === "mon" ? 1 : 0;
  let diff = dow - startDow;
  if (diff < 0) diff += 7;
  const start = new Date(today);
  start.setDate(today.getDate() - diff);
  start.setHours(0, 0, 0, 0);

  const order = params.weekStart === "mon" ? ORDER_MON : ORDER_SUN;
  const days: DayInfo[] = order.map((key, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      key,
      date,
      weekday: date.toLocaleDateString(params.locale, { weekday: "short" }),
      dayNum: date.getDate(),
      task: params[key],
      isToday: isSameDay(date, today),
      isWeekend: WEEKEND.has(key),
    };
  });

  const end = days[6].date;
  const fmt = (d: Date) =>
    d.toLocaleDateString(params.locale, { month: "short", day: "numeric" });
  const rangeLabel = `${fmt(start)} – ${fmt(end)}`;

  return { days, rangeLabel };
}

export function WeeklyPlannerWidget({
  params,
}: {
  params: WeeklyPlannerParams;
}) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const { days, rangeLabel } = buildWeek(params);

  const text = `#${colors.text}`;
  const dim = `#${colors.textDim}`;
  const faint = `#${colors.textFaint}`;
  const accent = `#${colors.accent}`;
  const borderSoft = `#${colors.borderSoft}`;
  const tint = `#${colors.accentTint}`;
  const emptyMark = "·";

  // ---- Neon style: terminal-flavoured ----
  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <div
          className="text-left px-6 w-full"
          style={{
            maxWidth: 420,
            fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
            color: accent,
            textShadow: "var(--w-text-shadow)",
          }}
        >
          <div className="mb-3">
            <div className="text-lg font-bold tracking-tight">
              <span style={{ opacity: 0.5 }}>## </span>
              {params.title}
            </div>
            {params.showDate && (
              <div className="text-xs mt-0.5" style={{ opacity: 0.5 }}>
                {rangeLabel}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {days.map((d) => (
              <div
                key={d.key}
                className="flex items-baseline gap-2 text-sm leading-relaxed"
                style={{ opacity: d.isToday ? 1 : 0.68 }}
              >
                <span style={{ opacity: 0.5, width: 12 }}>
                  {d.isToday ? ">" : " "}
                </span>
                <span className="uppercase shrink-0" style={{ width: 62 }}>
                  {d.weekday} {String(d.dayNum).padStart(2, "0")}
                </span>
                <span
                  className="flex-1 truncate"
                  style={{ opacity: d.task ? 0.95 : 0.35 }}
                >
                  {d.task || "_"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    );
  }

  const header = (
    <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
      <span
        className="text-base font-semibold tracking-tight truncate"
        style={{ color: text }}
      >
        {params.title}
      </span>
      {params.showDate && (
        <span
          className="text-xs font-medium shrink-0"
          style={{ color: faint }}
        >
          {rangeLabel}
        </span>
      )}
    </div>
  );

  // ---- Strip: 7 horizontal columns ----
  if (params.variant === "strip") {
    return (
      <WidgetShell params={params}>
        <div className="w-full px-4" style={{ maxWidth: 560 }}>
          {header}
          <div className="flex gap-1.5">
            {days.map((d) => (
              <div
                key={d.key}
                className="flex-1 flex flex-col items-center rounded-xl px-1 pt-2 pb-2.5 min-w-0"
                style={{
                  backgroundColor: d.isToday ? tint : "transparent",
                  border: `1px solid ${d.isToday ? accent : borderSoft}`,
                }}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: d.isToday ? accent : d.isWeekend ? faint : dim,
                  }}
                >
                  {d.weekday}
                </span>
                <span
                  className="text-lg font-bold leading-tight mt-0.5"
                  style={{ color: d.isToday ? accent : text }}
                >
                  {d.dayNum}
                </span>
                <span
                  className="text-[11px] leading-snug text-center mt-1.5 w-full"
                  style={{
                    color: d.task ? dim : faint,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                  }}
                >
                  {d.task || emptyMark}
                </span>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---- Stack: minimal typographic rows ----
  if (params.variant === "stack") {
    return (
      <WidgetShell params={params}>
        <div className="w-full px-5" style={{ maxWidth: 380 }}>
          {header}
          <div className="flex flex-col">
            {days.map((d, i) => (
              <div
                key={d.key}
                className="flex items-baseline gap-3 py-2"
                style={{
                  borderBottom:
                    i === days.length - 1 ? "none" : `1px solid ${borderSoft}`,
                }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-wide shrink-0 flex items-center gap-1.5"
                  style={{ width: 58, color: d.isToday ? accent : dim }}
                >
                  {d.isToday && (
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 5,
                        height: 5,
                        backgroundColor: accent,
                      }}
                    />
                  )}
                  {d.weekday} {d.dayNum}
                </span>
                <span
                  className="text-sm flex-1 truncate"
                  style={{ color: d.task ? text : faint }}
                >
                  {d.task || emptyMark}
                </span>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---- List (default): date badge rows ----
  return (
    <WidgetShell params={params}>
      <div className="w-full px-4" style={{ maxWidth: 380 }}>
        {header}
        <div className="flex flex-col gap-1">
          {days.map((d) => (
            <div
              key={d.key}
              className="flex items-center gap-3 rounded-lg px-2.5 py-1.5"
              style={{
                backgroundColor: d.isToday ? tint : "transparent",
                borderLeft: `3px solid ${d.isToday ? accent : "transparent"}`,
              }}
            >
              <div className="flex flex-col items-center shrink-0" style={{ width: 34 }}>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider leading-none"
                  style={{
                    color: d.isToday ? accent : d.isWeekend ? faint : dim,
                  }}
                >
                  {d.weekday}
                </span>
                <span
                  className="text-lg font-bold leading-tight mt-0.5"
                  style={{ color: d.isToday ? accent : text }}
                >
                  {d.dayNum}
                </span>
              </div>
              <span
                className="text-sm flex-1 truncate"
                style={{ color: d.task ? text : faint }}
              >
                {d.task || emptyMark}
              </span>
            </div>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
}
