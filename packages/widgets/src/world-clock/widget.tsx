"use client";

import { useState, useEffect } from "react";
import { resolveColors } from "@nw/widget-core";
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
  borderColor,
}: {
  timezones: string[];
  now: Date;
  format: "12h" | "24h";
  accentColor: string;
  textColor: string;
  borderColor: string;
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
                style={{ color: textColor }}
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
                style={{ backgroundColor: borderColor }}
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
  borderColor,
}: {
  timezones: string[];
  now: Date;
  format: "12h" | "24h";
  accentColor: string;
  textColor: string;
  borderColor: string;
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
                  style={{ color: textColor }}
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
                style={{ backgroundColor: borderColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WorldClockWidget({ params }: { params: WorldClockParams }) {
  const [now, setNow] = useState(new Date());
  const c = resolveColors(params);
  const bgStyle = c.bg === "transparent" ? undefined : { backgroundColor: c.bg };

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
    <div
      className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      {params.style === "list" ? (
        <ListStyle
          timezones={timezones}
          now={now}
          format={params.format}
          accentColor={c.accent}
          textColor={c.text}
          borderColor={c.border}
        />
      ) : (
        <MinimalStyle
          timezones={timezones}
          now={now}
          format={params.format}
          accentColor={c.accent}
          textColor={c.text}
          borderColor={c.border}
        />
      )}
    </div>
  );
}
