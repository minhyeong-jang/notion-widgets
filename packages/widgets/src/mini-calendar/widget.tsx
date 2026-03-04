"use client";

import { useState, useEffect, useMemo } from "react";
import { resolveColors } from "@nw/widget-core";
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
        style={{ color: textColor }}
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
  borderColor,
}: {
  today: Date;
  params: MiniCalendarParams;
  accentColor: string;
  textColor: string;
  borderColor: string;
}) {
  const dayNames = useMemo(() => getDayNames(params.locale, params.firstDay), [params.locale, params.firstDay]);
  const monthName = useMemo(() => getMonthName(params.locale, today), [params.locale, today]);
  const grid = useMemo(() => getCalendarGrid(today, params.firstDay), [today, params.firstDay]);

  return (
    <div className="w-full max-w-[280px] mx-auto px-4">
      <h2
        className="text-sm font-semibold text-center mb-3 capitalize"
        style={{ color: textColor }}
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
                      ? borderColor + "30"
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

export function MiniCalendarWidget({ params }: { params: MiniCalendarParams }) {
  const [today, setToday] = useState(new Date());
  const c = resolveColors(params);
  const bgStyle = c.bg === "transparent" ? undefined : { backgroundColor: c.bg };

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
    <div
      className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      {params.style === "card" ? (
        <CardCalendar
          today={today}
          params={params}
          accentColor={c.accent}
          textColor={c.text}
          borderColor={c.border}
        />
      ) : (
        <MinimalCalendar
          today={today}
          params={params}
          accentColor={c.accent}
          textColor={c.text}
        />
      )}
    </div>
  );
}
