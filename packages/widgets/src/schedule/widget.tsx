"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ScheduleParams } from "./schema";

type Status = "past" | "current" | "upcoming";

interface EventItem {
  label: string;
  start: number; // minutes from midnight
  end: number | null;
  status: Status;
}

function parseTime(raw: string): number | null {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function parseEvents(raw: string, nowMin: number): EventItem[] {
  const items: EventItem[] = [];
  for (const chunk of raw.split(",")) {
    const parts = chunk.split("~").map((p) => p.trim());
    const label = parts[0];
    if (!label) continue;
    const start = parseTime(parts[1] ?? "");
    if (start === null) continue;
    const end = parts[2] ? parseTime(parts[2]) : null;
    let status: Status;
    if (end !== null) {
      if (nowMin >= end) status = "past";
      else if (nowMin >= start) status = "current";
      else status = "upcoming";
    } else {
      status = nowMin >= start ? "past" : "upcoming";
    }
    items.push({ label: label.slice(0, 48), start, end, status });
  }
  return items.sort((a, b) => a.start - b.start);
}

function minutesToLabel(min: number, locale: string): string {
  const d = new Date();
  d.setHours(Math.floor(min / 60), min % 60, 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function nowLabel(locale: string): string {
  return locale.startsWith("ko") ? "지금" : "NOW";
}

export function ScheduleWidget({ params }: { params: ScheduleParams }) {
  const colorMode = useWidgetColorMode();
  const c = resolveColors(params.accent, colorMode);
  const isDark = colorMode === "dark";

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const events = parseEvents(params.events, nowMin);

  const accent = `#${c.accent}`;
  const accentTintBg = isDark
    ? `rgba(${hx(c.accent)},0.14)`
    : `rgba(${hx(c.accent)},0.1)`;
  const text = `#${c.text}`;
  const textDim = `#${c.textDim}`;
  const textFaint = `#${c.textFaint}`;
  const track = `#${c.track}`;
  const glow = params.style === "neon";

  const title = params.showTitle && params.title.trim() ? params.title.trim() : null;

  const header =
    (title || params.showNow) ? (
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          width: "100%",
        }}
      >
        {title ? (
          <span
            style={{
              color: text,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </span>
        ) : (
          <span />
        )}
        {params.showNow && (
          <span
            style={{
              color: accent,
              fontSize: 13,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {minutesToLabel(nowMin, params.locale)}
          </span>
        )}
      </div>
    ) : null;

  const emptyMsg = events.length === 0 && (
    <div style={{ color: textFaint, fontSize: 14, padding: "8px 0" }}>
      {params.locale.startsWith("ko") ? "일정이 없습니다" : "No events"}
    </div>
  );

  function colorFor(status: Status): string {
    if (status === "current") return accent;
    if (status === "upcoming") return text;
    return textFaint;
  }

  // ---------------- List variant ----------------
  if (params.variant === "list") {
    return (
      <WidgetShell params={params}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          {header}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {emptyMsg}
            {events.map((ev, i) => {
              const isCurrent = ev.status === "current";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 10,
                    backgroundColor: isCurrent ? accentTintBg : "transparent",
                  }}
                >
                  <span
                    style={{
                      color: isCurrent ? accent : textDim,
                      fontSize: 12,
                      fontWeight: isCurrent ? 700 : 500,
                      width: 68,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {minutesToLabel(ev.start, params.locale)}
                  </span>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      backgroundColor:
                        ev.status === "upcoming" ? "transparent" : colorFor(ev.status),
                      border:
                        ev.status === "upcoming"
                          ? `2px solid ${track}`
                          : `2px solid ${colorFor(ev.status)}`,
                      boxShadow: isCurrent && glow ? `0 0 8px ${accent}` : undefined,
                    }}
                  />
                  <span
                    style={{
                      color: colorFor(ev.status),
                      fontSize: 14,
                      fontWeight: isCurrent ? 700 : 500,
                      textDecoration: ev.status === "past" ? "line-through" : "none",
                      opacity: ev.status === "past" ? 0.7 : 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.label}
                  </span>
                  {isCurrent && <NowPill accent={accent} glow={glow} locale={params.locale} />}
                </div>
              );
            })}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---------------- Cards variant ----------------
  if (params.variant === "cards") {
    return (
      <WidgetShell params={params} bare>
        <div style={{ width: "100%", maxWidth: 340 }}>
          {header}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {emptyMsg}
            {events.map((ev, i) => {
              const isCurrent = ev.status === "current";
              const barColor = colorFor(ev.status);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    backgroundColor: isCurrent
                      ? accentTintBg
                      : isDark
                        ? `#${c.surface}`
                        : "#ffffff",
                    border: `1px solid ${isCurrent ? accent : `#${isDark ? c.border : c.borderSoft}`}`,
                    boxShadow:
                      isCurrent && glow
                        ? `0 0 14px ${accentTintBg}`
                        : isDark
                          ? "none"
                          : "0 1px 3px rgba(0,0,0,0.04)",
                    opacity: ev.status === "past" ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      alignSelf: "stretch",
                      borderRadius: 4,
                      backgroundColor: barColor,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        color: text,
                        fontSize: 14,
                        fontWeight: isCurrent ? 700 : 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.label}
                    </span>
                    <span
                      style={{
                        color: isCurrent ? accent : textDim,
                        fontSize: 12,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {minutesToLabel(ev.start, params.locale)}
                      {ev.end !== null && ` – ${minutesToLabel(ev.end, params.locale)}`}
                    </span>
                  </div>
                  {isCurrent && <NowPill accent={accent} glow={glow} locale={params.locale} />}
                </div>
              );
            })}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---------------- Timeline variant (default) ----------------
  return (
    <WidgetShell params={params}>
      <div style={{ width: "100%", maxWidth: 340 }}>
        {header}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {emptyMsg}
          {events.map((ev, i) => {
            const isFirst = i === 0;
            const isLast = i === events.length - 1;
            const isCurrent = ev.status === "current";
            const dotColor = colorFor(ev.status);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: 12,
                  minHeight: 46,
                }}
              >
                <span
                  style={{
                    color: isCurrent ? accent : textDim,
                    fontSize: 12,
                    fontWeight: isCurrent ? 700 : 500,
                    width: 68,
                    flexShrink: 0,
                    paddingTop: 13,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {minutesToLabel(ev.start, params.locale)}
                </span>
                {/* rail */}
                <div style={{ position: "relative", width: 16, flexShrink: 0 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 7,
                      width: 2,
                      top: isFirst ? "50%" : 0,
                      bottom: isLast ? "50%" : 0,
                      backgroundColor: track,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                      width: isCurrent ? 14 : 10,
                      height: isCurrent ? 14 : 10,
                      borderRadius: "50%",
                      backgroundColor:
                        ev.status === "upcoming"
                          ? isDark
                            ? `#${c.bg}`
                            : "#ffffff"
                          : dotColor,
                      border: `2px solid ${ev.status === "upcoming" ? track : dotColor}`,
                      boxShadow: isCurrent
                        ? glow
                          ? `0 0 10px ${accent}, 0 0 0 4px ${accentTintBg}`
                          : `0 0 0 4px ${accentTintBg}`
                        : undefined,
                    }}
                  />
                </div>
                {/* content */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 11,
                    paddingBottom: 11,
                  }}
                >
                  <span
                    style={{
                      color: colorFor(ev.status),
                      fontSize: 14,
                      fontWeight: isCurrent ? 700 : 500,
                      textDecoration: ev.status === "past" ? "line-through" : "none",
                      opacity: ev.status === "past" ? 0.65 : 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.label}
                  </span>
                  {isCurrent && <NowPill accent={accent} glow={glow} locale={params.locale} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}

function NowPill({
  accent,
  glow,
  locale,
}: {
  accent: string;
  glow: boolean;
  locale: string;
}) {
  return (
    <span
      style={{
        color: accent,
        border: `1px solid ${accent}`,
        borderRadius: 999,
        padding: "1px 7px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        flexShrink: 0,
        textShadow: glow ? `0 0 6px ${accent}` : undefined,
      }}
    >
      {nowLabel(locale)}
    </span>
  );
}

function hx(hex: string): string {
  const h = hex.slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
