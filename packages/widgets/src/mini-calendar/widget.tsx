"use client";

import { useState, useEffect, useMemo } from "react";
import { WidgetShell } from "../widget-shell";
import type { MiniCalendarParams } from "./schema";

function getDayNames(locale: string, firstDay: "sun" | "mon"): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const days: string[] = [];
  // Jan 4, 2026 is a Sunday
  const baseSunday = new Date(2026, 0, 4);
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseSunday);
    d.setDate(baseSunday.getDate() + i);
    days.push(formatter.format(d));
  }
  if (firstDay === "mon") {
    const sun = days.shift()!;
    days.push(sun);
  }
  return days;
}

function getMonthName(locale: string, date: Date): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function getCalendarGrid(today: Date, firstDay: "sun" | "mon"): CalendarDay[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();

  let startDow = firstOfMonth.getDay(); // 0=Sun
  if (firstDay === "mon") {
    startDow = startDow === 0 ? 6 : startDow - 1;
  }

  const prevMonthLast = new Date(year, month, 0).getDate();
  const grid: CalendarDay[] = [];

  // Previous month trailing days
  for (let i = startDow - 1; i >= 0; i--) {
    grid.push({
      day: prevMonthLast - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({
      day: d,
      isCurrentMonth: true,
      isToday: d === todayDate,
    });
  }

  // Next month leading days
  const remaining = 42 - grid.length; // 6 rows * 7
  for (let d = 1; d <= remaining; d++) {
    grid.push({
      day: d,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return grid;
}

function MinimalCalendar({
  today,
  params,
  accentColor,
  textColor,
}: {
  today: Date;
  params: MiniCalendarParams;
  accentColor: string;
  textColor: string;
}) {
  const dayNames = useMemo(() => getDayNames(params.locale, params.firstDay), [params.locale, params.firstDay]);
  const monthName = useMemo(() => getMonthName(params.locale, today), [params.locale, today]);
  const grid = useMemo(() => getCalendarGrid(today, params.firstDay), [today, params.firstDay]);

  return (
    <div className="w-full max-w-[280px] mx-auto px-4">
      <h2
        className="text-sm font-semibold text-center mb-3 capitalize"
        style={{
          color: textColor,
          textShadow: "var(--w-text-shadow)",
        }}
      >
        {monthName}
      </h2>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center text-[10px] font-medium uppercase py-1 opacity-40"
            style={{ color: textColor }}
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((cell, i) => (
          <div
            key={i}
            className={`text-center text-xs py-1.5 rounded-md ${
              cell.isToday ? "font-bold" : ""
            } ${!cell.isCurrentMonth ? "opacity-20" : ""}`}
            style={
              cell.isToday
                ? { backgroundColor: accentColor, color: "#18181b" }
                : { color: textColor }
            }
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardCalendar({
  today,
  params,
  accentColor,
  textColor,
}: {
  today: Date;
  params: MiniCalendarParams;
  accentColor: string;
  textColor: string;
}) {
  const dayNames = useMemo(() => getDayNames(params.locale, params.firstDay), [params.locale, params.firstDay]);
  const monthName = useMemo(() => getMonthName(params.locale, today), [params.locale, today]);
  const grid = useMemo(() => getCalendarGrid(today, params.firstDay), [today, params.firstDay]);

  return (
    <div className="w-full max-w-[280px] mx-auto px-4">
      <h2
        className="text-sm font-semibold text-center mb-3 capitalize"
        style={{
          color: textColor,
          textShadow: "var(--w-text-shadow)",
        }}
      >
        {monthName}
      </h2>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center text-[10px] font-medium uppercase py-1 opacity-40"
            style={{ color: textColor }}
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, i) => (
          <div
            key={i}
            className={`text-center text-xs py-1.5 rounded-md ${
              cell.isToday ? "font-bold" : ""
            } ${!cell.isCurrentMonth ? "opacity-15" : ""}`}
            style={
              cell.isToday
                ? { backgroundColor: accentColor, color: "#18181b" }
                : {
                    color: textColor,
                    backgroundColor: cell.isCurrentMonth
                      ? accentColor + "30"
                      : undefined,
                  }
            }
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}

function NeonCalendar({
  today,
  params,
  accentColor,
}: {
  today: Date;
  params: MiniCalendarParams;
  accentColor: string;
}) {
  const dayNames = useMemo(() => getDayNames(params.locale, params.firstDay), [params.locale, params.firstDay]);
  const monthName = useMemo(() => getMonthName(params.locale, today), [params.locale, today]);
  const grid = useMemo(() => getCalendarGrid(today, params.firstDay), [today, params.firstDay]);

  // Shorten day names to 2 chars for fixed-width
  const shortDays = dayNames.map(d => d.slice(0, 2).toUpperCase());
  const headerRow = shortDays.map(d => d.padStart(3)).join("");
  const titleStr = monthName.toUpperCase();

  // Build 6 rows of 7 days each
  const rows: CalendarDay[][] = [];
  for (let r = 0; r < 6; r++) {
    rows.push(grid.slice(r * 7, (r + 1) * 7));
  }

  const borderWidth = 23; // inner content width in characters

  return (
    <div className="w-full max-w-[280px] mx-auto px-4">
      <div style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: "1.5", color: accentColor }}>
        {/* Top border */}
        <div style={{ opacity: 0.4 }}>{"\u250C" + "\u2500".repeat(borderWidth) + "\u2510"}</div>

        {/* Month title centered */}
        <div>
          <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          <span style={{ letterSpacing: "1px" }}>
            {titleStr.length <= borderWidth
              ? " ".repeat(Math.floor((borderWidth - titleStr.length) / 2)) + titleStr + " ".repeat(Math.ceil((borderWidth - titleStr.length) / 2))
              : titleStr.slice(0, borderWidth)}
          </span>
          <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
        </div>

        {/* Separator */}
        <div style={{ opacity: 0.4 }}>{"\u251C" + "\u2500".repeat(borderWidth) + "\u2524"}</div>

        {/* Day name header */}
        <div>
          <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          <span style={{ opacity: 0.5 }}>{" " + headerRow + " "}</span>
          <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
        </div>

        {/* Day rows */}
        {rows.map((row, ri) => (
          <div key={ri}>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
            <span>{" "}</span>
            {row.map((cell, ci) => {
              const dayStr = String(cell.day).padStart(2);
              const trailing = ci < 6 ? " " : "";
              if (cell.isToday) {
                return (
                  <span key={ci}>
                    <span
                      style={{
                        backgroundColor: accentColor,
                        color: "#18181b",
                        fontWeight: "bold",
                        padding: "0 1px",
                      }}
                    >
                      {dayStr}
                    </span>
                    {trailing}
                  </span>
                );
              }
              return (
                <span
                  key={ci}
                  style={{
                    opacity: cell.isCurrentMonth ? 0.8 : 0.2,
                  }}
                >
                  {dayStr}{trailing}
                </span>
              );
            })}
            <span>{" "}</span>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          </div>
        ))}

        {/* Bottom border */}
        <div style={{ opacity: 0.4 }}>{"\u2514" + "\u2500".repeat(borderWidth) + "\u2518"}</div>
      </div>
    </div>
  );
}

export function MiniCalendarWidget({ params }: { params: MiniCalendarParams }) {
  const [today, setToday] = useState(new Date());
  const accentColor = "#" + params.color;

  useEffect(() => {
    // Update at midnight to keep "today" highlight correct
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setToday(new Date());
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [today]);

  return (
    <WidgetShell params={params}>
      {params.style === "neon" ? (
        <NeonCalendar
          today={today}
          params={params}
          accentColor={accentColor}
        />
      ) : params.variant === "card" ? (
        <CardCalendar
          today={today}
          params={params}
          accentColor={accentColor}
          textColor={accentColor}
        />
      ) : (
        <MinimalCalendar
          today={today}
          params={params}
          accentColor={accentColor}
          textColor={accentColor}
        />
      )}
    </WidgetShell>
  );
}
