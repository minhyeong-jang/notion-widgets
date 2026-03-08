"use client";

import { useState, useEffect } from "react";
import { WidgetShell } from "../widget-shell";
import type { WorldClockParams } from "./schema";

function getCityName(timezone: string): string {
  const parts = timezone.split("/");
  const city = parts[parts.length - 1];
  return city.replace(/_/g, " ");
}

function formatTime(
  date: Date,
  timezone: string,
  format: "12h" | "24h",
): { time: string; period?: string } {
  try {
    if (format === "12h") {
      const timeStr = date.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const [time, period] = timeStr.split(" ");
      return { time: time ?? timeStr, period };
    }
    const timeStr = date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return { time: timeStr };
  } catch {
    return { time: "--:--:--" };
  }
}

function MinimalStyle({
  timezones,
  now,
  format,
  accentColor,
  textColor,
}: {
  timezones: string[];
  now: Date;
  format: "12h" | "24h";
  accentColor: string;
  textColor: string;
}) {
  return (
    <div className="flex items-center justify-center gap-6 px-4">
      {timezones.map((tz, i) => {
        const { time, period } = formatTime(now, tz, format);
        return (
          <div key={tz} className="flex items-center gap-6">
            <div className="text-center">
              <div
                className="text-xs font-medium uppercase tracking-wider mb-1 opacity-60"
                style={{ color: textColor }}
              >
                {getCityName(tz)}
              </div>
              <div
                className="text-2xl font-mono font-semibold tabular-nums"
                style={{
                  color: textColor,
                  textShadow: "var(--w-text-shadow)",
                }}
              >
                {time}
              </div>
              {period && (
                <div
                  className="text-xs font-medium mt-0.5"
                  style={{ color: accentColor }}
                >
                  {period}
                </div>
              )}
            </div>
            {i < timezones.length - 1 && (
              <div
                className="w-px h-10 opacity-20"
                style={{ backgroundColor: textColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ListStyle({
  timezones,
  now,
  format,
  accentColor,
  textColor,
}: {
  timezones: string[];
  now: Date;
  format: "12h" | "24h";
  accentColor: string;
  textColor: string;
}) {
  return (
    <div className="w-full max-w-xs mx-auto px-6 space-y-3">
      {timezones.map((tz, i) => {
        const { time, period } = formatTime(now, tz, format);
        return (
          <div key={tz}>
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: textColor, opacity: 0.7 }}
              >
                {getCityName(tz)}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-lg font-mono font-semibold tabular-nums"
                  style={{
                    color: textColor,
                    textShadow: "var(--w-text-shadow)",
                  }}
                >
                  {time}
                </span>
                {period && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: accentColor }}
                  >
                    {period}
                  </span>
                )}
              </div>
            </div>
            {i < timezones.length - 1 && (
              <div
                className="w-full h-px mt-3 opacity-10"
                style={{ backgroundColor: textColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Neon: Split-Flap / Departure Board ─── */

function NeonFlapChar({
  char,
  accentColor,
}: {
  char: string;
  accentColor: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        fontSize: "1.15rem",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        color: accentColor,
        backgroundColor: `${accentColor}12`,
        border: `1px solid ${accentColor}22`,
        borderRadius: "2px",
        padding: "2px 4px",
        minWidth: "1.1em",
        textAlign: "center" as const,
        lineHeight: 1.2,
        textShadow: `0 0 6px ${accentColor}88`,
      }}
    >
      {char}
    </span>
  );
}

function NeonStyle({
  timezones,
  now,
  format,
  accentColor,
}: {
  timezones: string[];
  now: Date;
  format: "12h" | "24h";
  accentColor: string;
}) {
  const monoStyle: React.CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: accentColor,
    textShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}66`,
  };

  const dividerLine = "\u2500".repeat(32);

  return (
    <div
      style={{
        ...monoStyle,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "320px",
        margin: "0 auto",
        padding: "12px 20px",
        gap: "0px",
      }}
    >
      {timezones.map((tz, i) => {
        const { time, period } = formatTime(now, tz, format);
        const cityName = getCityName(tz).toUpperCase();

        return (
          <div key={tz}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              {/* City name */}
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  minWidth: "100px",
                }}
              >
                {cityName}
              </div>

              {/* Time in flap characters */}
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {time.split("").map((char, ci) => (
                  <NeonFlapChar key={ci} char={char} accentColor={accentColor} />
                ))}
                {period && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      opacity: 0.5,
                      marginLeft: "6px",
                    }}
                  >
                    {period}
                  </span>
                )}
              </div>
            </div>

            {/* Horizontal divider */}
            {i < timezones.length - 1 && (
              <div
                style={{
                  fontSize: "0.55rem",
                  opacity: 0.15,
                  textAlign: "center",
                  lineHeight: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {dividerLine}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WorldClockWidget({ params }: { params: WorldClockParams }) {
  const [now, setNow] = useState(new Date());
  const accentColor = "#" + params.color;

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timezones = params.timezones
    .split(",")
    .map(tz => tz.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <WidgetShell params={params}>
      {params.style === "neon" ? (
        <NeonStyle
          timezones={timezones}
          now={now}
          format={params.format}
          accentColor={accentColor}
        />
      ) : params.variant === "list" ? (
        <ListStyle
          timezones={timezones}
          now={now}
          format={params.format}
          accentColor={accentColor}
          textColor={accentColor}
        />
      ) : (
        <MinimalStyle
          timezones={timezones}
          now={now}
          format={params.format}
          accentColor={accentColor}
          textColor={accentColor}
        />
      )}
    </WidgetShell>
  );
}
