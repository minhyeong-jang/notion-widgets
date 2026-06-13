"use client";

import { useState, useEffect } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { FlipCard } from "./flip-clock";
import { MinimalCard } from "./minimal-clock";
import type { FlipClockParams } from "./schema";

export function FlipClockWidget({ params }: { params: FlipClockParams }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rawHours = time.getHours();
  const is24h = params.format === "24h";
  const hours = is24h
    ? rawHours.toString().padStart(2, "0")
    : (rawHours % 12 || 12).toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const isAM = rawHours < 12;
  const dayOfWeek = time
    .toLocaleDateString(params.locale, { weekday: "long" })
    .toUpperCase();
  const shortDate = time.toLocaleDateString(params.locale, {
    month: "short",
    day: "numeric",
  });

  const isKo = params.locale.startsWith("ko");
  const ampmLabel = isAM ? (isKo ? "오전" : "AM") : (isKo ? "오후" : "PM");
  const hoursLabel = params.showLabel
    ? is24h ? dayOfWeek : ampmLabel
    : "";
  const minutesLabel = params.showLabel
    ? is24h ? "" : dayOfWeek
    : "";
  const secondsLabel = params.showLabel ? shortDate : "";

  const colors = resolveColors(params.accent);
  const textColor = `#${colors.text}`;
  const accentColor = `#${colors.accent}`;
  const bgColor = `#${colors.bg}`;
  /* ─── Flip ─── */
  if (params.variant === "flip") {
    return (
      <WidgetShell params={params}>
        <div className={`flex items-center justify-center gap-2 ${params.showSeconds ? "max-w-[320px]" : "max-w-[220px]"} mx-auto`}>
          <div className="w-24 shrink-0">
            <FlipCard value={hours} label={hoursLabel} color={textColor} bg={bgColor} />
          </div>
          <div className="w-24 shrink-0">
            <FlipCard value={minutes} label={minutesLabel} color={textColor} bg={bgColor} />
          </div>
          {params.showSeconds && (
            <div className="w-24 shrink-0">
              <FlipCard value={seconds} label={secondsLabel} color={textColor} bg={bgColor} />
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  /* ─── Minimal (default) ─── */
  return (
    <WidgetShell params={params}>
      <div className="flex items-center gap-3">
        <MinimalCard value={hours} label={hoursLabel} color={textColor} />
        <div className="flex flex-col gap-2 mb-4">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
        </div>
        <MinimalCard value={minutes} label={minutesLabel} color={textColor} />
        {params.showSeconds && (
          <>
            <div className="flex flex-col gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
            </div>
            <MinimalCard value={seconds} label={secondsLabel} color={textColor} />
          </>
        )}
      </div>
    </WidgetShell>
  );
}
