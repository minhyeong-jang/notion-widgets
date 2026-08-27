"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { DateCardParams } from "./schema";

interface DateParts {
  weekdayLong: string;
  weekdayShort: string;
  monthLong: string;
  monthShort: string;
  day: number;
  year: number;
  dayOfYear: number;
  week: number;
  isWeekend: boolean;
}

function getDateParts(date: Date, locale: string): DateParts {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // ISO week number
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  const dow = date.getDay();

  return {
    weekdayLong: date.toLocaleDateString(locale, { weekday: "long" }),
    weekdayShort: date.toLocaleDateString(locale, { weekday: "short" }),
    monthLong: date.toLocaleDateString(locale, { month: "long" }),
    monthShort: date.toLocaleDateString(locale, { month: "short" }),
    day: date.getDate(),
    year: date.getFullYear(),
    dayOfYear,
    week,
    isWeekend: dow === 0 || dow === 6,
  };
}

function infoLabel(parts: DateParts, info: DateCardParams["info"], isKo: boolean): string | null {
  if (info === "dayOfYear") {
    return isKo ? `올해 ${parts.dayOfYear}일째` : `Day ${parts.dayOfYear}`;
  }
  if (info === "week") {
    return isKo ? `${parts.week}주차` : `Week ${parts.week}`;
  }
  return null;
}

export function DateCardWidget({ params }: { params: DateCardParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const accentColor = `#${colors.accent}`;
  const textColor = `#${colors.text}`;
  const dimColor = `#${colors.textDim}`;
  const faintColor = `#${colors.textFaint}`;

  const now = new Date();
  const parts = getDateParts(now, params.locale);
  const sub = infoLabel(parts, params.info, params.locale.startsWith("ko"));
  const note = params.note.trim();

  // ---------------------------------------------------------------- NEON
  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <div
          className="flex flex-col items-center"
          style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)" }}
        >
          <div
            className="text-sm tracking-[0.35em] uppercase mb-2"
            style={{ color: accentColor, opacity: 0.7 }}
          >
            {parts.weekdayLong}
          </div>
          <div
            className="leading-none font-bold"
            style={{
              color: accentColor,
              fontSize: "6rem",
              textShadow: `0 0 20px ${accentColor}, 0 0 45px ${accentColor}70`,
            }}
          >
            {String(parts.day).padStart(2, "0")}
          </div>
          <div
            className="text-sm tracking-[0.3em] uppercase mt-2"
            style={{ color: accentColor, opacity: 0.85 }}
          >
            {parts.monthLong} {parts.year}
          </div>
          {(sub || note) && (
            <div
              className="text-xs mt-4 px-3 py-1"
              style={{
                color: accentColor,
                border: `1px solid ${accentColor}30`,
                opacity: 0.8,
              }}
            >
              {note || sub}
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ------------------------------------------------------------- TEAROFF
  if (params.variant === "tearoff") {
    return (
      <WidgetShell params={params} bare>
        <div
          className="flex flex-col items-stretch overflow-hidden"
          style={{
            width: 240,
            borderRadius: "var(--w-radius)",
            border: `1px solid #${mode === "dark" ? colors.borderStrong : colors.border}`,
            backgroundColor: mode === "dark" ? `#${colors.surface2}` : "#ffffff",
            boxShadow:
              mode === "dark"
                ? "0 6px 24px rgba(0,0,0,0.35)"
                : "0 6px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header bar with binding holes */}
          <div
            className="relative flex items-center justify-center py-2"
            style={{ backgroundColor: accentColor }}
          >
            <div className="absolute left-0 right-0 top-1 flex justify-center gap-6">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: `${colors.btnText === "ffffff" ? "#ffffff" : "#000000"}`, opacity: 0.3 }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: `${colors.btnText === "ffffff" ? "#ffffff" : "#000000"}`, opacity: 0.3 }}
              />
            </div>
            <span
              className="text-sm font-semibold tracking-wide mt-1"
              style={{ color: `#${colors.btnText}` }}
            >
              {parts.monthLong} {parts.year}
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center px-4 pt-3 pb-5">
            <div
              className="text-xs tracking-[0.3em] uppercase mb-1"
              style={{ color: parts.isWeekend ? accentColor : dimColor }}
            >
              {parts.weekdayLong}
            </div>
            <div
              className="font-bold leading-none"
              style={{ color: textColor, fontSize: "5.25rem", letterSpacing: "-0.03em" }}
            >
              {parts.day}
            </div>
            {(sub || note) && (
              <div
                className="text-xs mt-3 pt-3 w-full text-center"
                style={{
                  color: faintColor,
                  borderTop: `1px dashed #${mode === "dark" ? colors.border : colors.borderStrong}`,
                }}
              >
                {note || sub}
              </div>
            )}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // --------------------------------------------------------------- BANNER
  if (params.variant === "banner") {
    return (
      <WidgetShell params={params}>
        <div className="flex items-center gap-5 px-4">
          <div
            className="font-bold leading-none"
            style={{ color: accentColor, fontSize: "5.5rem", letterSpacing: "-0.04em" }}
          >
            {parts.day}
          </div>
          <div className="flex flex-col items-start gap-1">
            <div
              className="text-sm tracking-[0.25em] uppercase font-medium"
              style={{ color: dimColor }}
            >
              {parts.weekdayLong}
            </div>
            <div className="text-2xl font-semibold" style={{ color: textColor }}>
              {parts.monthLong}
            </div>
            <div className="text-base" style={{ color: faintColor }}>
              {parts.year}
            </div>
            {(sub || note) && (
              <div
                className="text-xs mt-1 px-2 py-0.5 rounded-full"
                style={{
                  color: accentColor,
                  backgroundColor: `#${colors.accentTint}`,
                }}
              >
                {note || sub}
              </div>
            )}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---------------------------------------------------------------- STACK
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center">
        <div
          className="text-sm tracking-[0.35em] uppercase mb-1"
          style={{ color: accentColor, fontWeight: 600 }}
        >
          {parts.weekdayLong}
        </div>
        <div
          className="font-bold leading-none"
          style={{ color: textColor, fontSize: "6.5rem", letterSpacing: "-0.04em" }}
        >
          {parts.day}
        </div>
        <div className="text-lg mt-1" style={{ color: dimColor }}>
          {parts.monthLong} {parts.year}
        </div>
        {(sub || note) && (
          <div className="text-xs mt-3" style={{ color: faintColor }}>
            {note || sub}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
