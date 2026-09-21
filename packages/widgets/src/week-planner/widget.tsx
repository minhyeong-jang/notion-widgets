"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { parseTasks, dayKeyFromDate, type WeekPlannerParams } from "./schema";

interface DayCell {
  date: Date;
  key: string;
  weekday: string;
  dayNum: number;
  isToday: boolean;
  isWeekend: boolean;
  task?: string;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildWeek(
  weekStart: "mon" | "sun",
  locale: string,
  tasks: Record<string, string>,
): DayCell[] {
  const today = startOfDay(new Date());
  const dow = today.getDay(); // 0=Sun
  const offset = weekStart === "mon" ? (dow + 6) % 7 : dow;
  const first = new Date(today);
  first.setDate(today.getDate() - offset);

  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const cells: DayCell[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(first);
    date.setDate(first.getDate() + i);
    const key = dayKeyFromDate(date);
    cells.push({
      date,
      key,
      weekday: fmt.format(date),
      dayNum: date.getDate(),
      isToday: date.getTime() === today.getTime(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      task: tasks[key],
    });
  }
  return cells;
}

export function WeekPlannerWidget({ params }: { params: WeekPlannerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  const tasks = parseTasks(params.tasks);
  const week = buildWeek(params.weekStart, params.locale, tasks);
  const todayCell = week.find((c) => c.isToday);

  // ── Derived colors ──
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const btnText = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const surface = isDark ? `#${colors.surface2}` : "#ffffff";
  const inset = isDark ? `#${colors.inset}` : `#${colors.bgSoft}`;
  const borderColor = isDark ? `#${colors.borderStrong}` : `#${colors.border}`;
  const accentTint = `#${colors.accentTint}`;

  const monoFont = isNeon ? "monospace" : undefined;
  const titleColor = isNeon ? accentBright : text;

  const title = (
    <div
      className="w-full flex items-baseline justify-between"
      style={{ marginBottom: 14, gap: 10 }}
    >
      <div
        className="font-semibold leading-tight"
        style={{
          fontSize: 15,
          color: titleColor,
          textShadow: "var(--w-text-shadow)",
          fontFamily: monoFont,
          letterSpacing: isNeon ? "1.5px" : "-0.01em",
          textTransform: isNeon ? "uppercase" : undefined,
        }}
      >
        {isNeon ? `> ${params.title}` : params.title}
      </div>
      {todayCell && (
        <div
          className="font-medium tabular-nums shrink-0"
          style={{
            fontSize: 12,
            color: isNeon ? accent : textFaint,
            fontFamily: monoFont,
            opacity: isNeon ? 0.85 : 1,
          }}
        >
          {new Intl.DateTimeFormat(params.locale, {
            month: "short",
            day: "numeric",
          }).format(todayCell.date)}
        </div>
      )}
    </div>
  );

  // ────────────────────────── STRIP ──────────────────────────
  if (params.variant === "strip") {
    return (
      <WidgetShell params={params}>
        <div
          className="flex flex-col"
          style={{ width: "100%", maxWidth: 360, padding: "2px 2px" }}
        >
          {params.showTitle && title}
          <div className="flex" style={{ gap: 6 }}>
            {week.map((c) => {
              const weekdayColor = c.isToday
                ? isNeon
                  ? accentBright
                  : accent
                : c.isWeekend
                  ? textFaint
                  : textDim;
              return (
                <div
                  key={c.key}
                  className="flex flex-col items-center"
                  style={{ flex: 1, gap: 6, minWidth: 0 }}
                >
                  <span
                    className="font-medium uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      color: weekdayColor,
                      fontFamily: monoFont,
                      textShadow: c.isToday ? "var(--w-text-shadow)" : undefined,
                    }}
                  >
                    {c.weekday}
                  </span>
                  <span
                    className="flex items-center justify-center font-semibold tabular-nums"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: isNeon ? 6 : 10,
                      fontSize: 15,
                      fontFamily: monoFont,
                      color: c.isToday
                        ? isNeon
                          ? accentBright
                          : btnText
                        : c.isWeekend
                          ? textFaint
                          : text,
                      background: c.isToday
                        ? isNeon
                          ? "transparent"
                          : accent
                        : "transparent",
                      border: c.isToday && isNeon ? `1.5px solid ${accent}` : "none",
                      boxShadow: c.isToday
                        ? isNeon
                          ? `0 0 10px ${accent}99, inset 0 0 8px ${accent}44`
                          : `0 2px 8px ${accentTint}`
                        : undefined,
                      textShadow: c.isToday && isNeon ? "var(--w-text-shadow)" : undefined,
                    }}
                  >
                    {c.dayNum}
                  </span>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: c.task ? (isNeon ? accentBright : accent) : "transparent",
                      boxShadow: c.task && isNeon ? `0 0 6px ${accent}` : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
          {todayCell?.task && (
            <div
              className="flex items-center"
              style={{
                marginTop: 14,
                gap: 8,
                padding: "9px 12px",
                borderRadius: isNeon ? 6 : 10,
                background: isNeon ? `${accent}14` : accentTint,
                border: `1px solid ${isNeon ? `${accent}55` : "transparent"}`,
              }}
            >
              <span
                className="font-semibold uppercase shrink-0"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: isNeon ? accentBright : accent,
                  fontFamily: monoFont,
                  textShadow: "var(--w-text-shadow)",
                }}
              >
                {isNeon ? "TODAY" : "Today"}
              </span>
              <span
                className="truncate"
                style={{
                  fontSize: 13,
                  color: isNeon ? accentBright : text,
                  fontFamily: monoFont,
                  textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
                }}
              >
                {todayCell.task}
              </span>
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ────────────────────────── LIST (agenda) ──────────────────────────
  if (params.variant === "list") {
    return (
      <WidgetShell params={params}>
        <div
          className="flex flex-col"
          style={{ width: "100%", maxWidth: 320, padding: "2px 2px" }}
        >
          {params.showTitle && title}
          <div className="flex flex-col" style={{ gap: 4 }}>
            {week.map((c) => (
              <div
                key={c.key}
                className="flex items-center"
                style={{
                  gap: 12,
                  padding: "9px 11px",
                  borderRadius: isNeon ? 6 : 10,
                  background: c.isToday ? (isNeon ? `${accent}14` : accentTint) : "transparent",
                  borderLeft: `3px solid ${
                    c.isToday ? (isNeon ? accentBright : accent) : "transparent"
                  }`,
                }}
              >
                <span
                  className="font-medium uppercase shrink-0 text-center"
                  style={{
                    width: 34,
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    color: c.isToday
                      ? isNeon
                        ? accentBright
                        : accent
                      : c.isWeekend
                        ? textFaint
                        : textDim,
                    fontFamily: monoFont,
                    textShadow: c.isToday ? "var(--w-text-shadow)" : undefined,
                  }}
                >
                  {c.weekday}
                </span>
                <span
                  className="font-semibold tabular-nums shrink-0 text-center"
                  style={{
                    width: 22,
                    fontSize: 15,
                    color: c.isToday ? (isNeon ? accentBright : text) : c.isWeekend ? textFaint : text,
                    fontFamily: monoFont,
                    textShadow: c.isToday && isNeon ? "var(--w-text-shadow)" : undefined,
                  }}
                >
                  {c.dayNum}
                </span>
                <span
                  className="truncate"
                  style={{
                    flex: 1,
                    fontSize: 13.5,
                    color: c.task ? (isNeon ? accentBright : text) : textFaint,
                    fontFamily: monoFont,
                    textShadow: isNeon && c.task ? "var(--w-text-shadow)" : undefined,
                    opacity: c.task ? 1 : 0.7,
                  }}
                >
                  {c.task ?? (isNeon ? "—" : "·")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ────────────────────────── CARDS ──────────────────────────
  return (
    <WidgetShell params={params}>
      <div
        className="flex flex-col"
        style={{ width: "100%", maxWidth: 360, padding: "2px 2px" }}
      >
        {params.showTitle && title}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 7,
          }}
        >
          {week.map((c) => {
            const cardBg = c.isToday
              ? isNeon
                ? `${accent}12`
                : accentTint
              : isNeon
                ? "transparent"
                : inset;
            const cardBorder = c.isToday
              ? isNeon
                ? `1.5px solid ${accent}`
                : `1.5px solid ${accent}`
              : `1px solid ${borderColor}`;
            return (
              <div
                key={c.key}
                className="flex flex-col"
                style={{
                  padding: "9px 8px 10px",
                  borderRadius: isNeon ? 6 : 12,
                  background: cardBg,
                  border: cardBorder,
                  boxShadow:
                    c.isToday && isNeon
                      ? `0 0 12px ${accent}55, inset 0 0 8px ${accent}22`
                      : c.isToday && !isNeon && !isDark
                        ? `0 2px 10px ${accentTint}`
                        : undefined,
                  minHeight: 62,
                  gap: 3,
                }}
              >
                <span
                  className="font-medium uppercase"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.05em",
                    color: c.isToday
                      ? isNeon
                        ? accentBright
                        : accent
                      : c.isWeekend
                        ? textFaint
                        : textDim,
                    fontFamily: monoFont,
                    textShadow: c.isToday ? "var(--w-text-shadow)" : undefined,
                  }}
                >
                  {c.weekday}
                </span>
                <span
                  className="font-bold tabular-nums leading-none"
                  style={{
                    fontSize: 18,
                    color: c.isToday
                      ? isNeon
                        ? accentBright
                        : accent
                      : c.isWeekend
                        ? textFaint
                        : text,
                    fontFamily: monoFont,
                    textShadow: c.isToday && isNeon ? "var(--w-text-shadow)" : undefined,
                  }}
                >
                  {c.dayNum}
                </span>
                {c.task ? (
                  <span
                    style={{
                      marginTop: 1,
                      fontSize: 10.5,
                      lineHeight: 1.25,
                      color: isNeon ? accentBright : textDim,
                      fontFamily: monoFont,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.task}
                  </span>
                ) : (
                  <span
                    style={{
                      marginTop: 4,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: track,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}
