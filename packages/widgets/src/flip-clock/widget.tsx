"use client";

import { useState, useEffect } from "react";
import { WidgetShell } from "../widget-shell";
import { FlipCard } from "./flip-clock";
import { MinimalCard } from "./minimal-clock";
import type { FlipClockParams } from "./schema";

/* ─── Neon: 7-Segment LED Display ─── */

function NeonDigitGroup({
  value,
  label,
  accentColor,
}: {
  value: string;
  label: string;
  accentColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', 'Lucida Console', monospace",
            fontSize: "3.5rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.08em",
            color: accentColor,
            textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}88, 0 0 40px ${accentColor}44`,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
      {label && (
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accentColor,
            opacity: 0.5,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function NeonColon({
  accentColor,
  blinking,
}: {
  accentColor: string;
  blinking: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingBottom: "20px",
        opacity: blinking ? 1 : 0.3,
        transition: "opacity 0.3s ease",
      }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "1px",
            backgroundColor: accentColor,
            boxShadow: `0 0 6px ${accentColor}, 0 0 12px ${accentColor}66`,
          }}
        />
      ))}
    </div>
  );
}

function NeonStyle({
  hours,
  minutes,
  seconds,
  hoursLabel,
  minutesLabel,
  secondsLabel,
  showSeconds,
  accentColor,
  colonBlink,
}: {
  hours: string;
  minutes: string;
  seconds: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
  showSeconds: boolean;
  accentColor: string;
  colonBlink: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <NeonDigitGroup value={hours} label={hoursLabel} accentColor={accentColor} />
      <NeonColon accentColor={accentColor} blinking={colonBlink} />
      <NeonDigitGroup value={minutes} label={minutesLabel} accentColor={accentColor} />
      {showSeconds && (
        <>
          <NeonColon accentColor={accentColor} blinking={colonBlink} />
          <NeonDigitGroup value={seconds} label={secondsLabel} accentColor={accentColor} />
        </>
      )}
    </div>
  );
}

/* ─── Main Widget ─── */

/** Map variant to WidgetShell style */
function getShellStyle(variant: string): string {
  if (variant === "neon") return "neon";
  return "minimal";
}

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

  const accentColor = "#" + params.color;
  const bgColor = "#" + params.bg;
  const shellParams = { ...params, style: getShellStyle(params.variant) };

  /* ─── Neon ─── */
  if (params.variant === "neon") {
    return (
      <WidgetShell params={shellParams}>
        <NeonStyle
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          hoursLabel={hoursLabel}
          minutesLabel={minutesLabel}
          secondsLabel={secondsLabel}
          showSeconds={params.showSeconds}
          accentColor={accentColor}
          colonBlink={time.getSeconds() % 2 === 0}
        />
      </WidgetShell>
    );
  }

  /* ─── Flip ─── */
  if (params.variant === "flip") {
    return (
      <WidgetShell params={shellParams}>
        <div className={`flex items-center justify-center gap-2 ${params.showSeconds ? "max-w-[320px]" : "max-w-[220px]"} mx-auto`}>
          <div className="w-24 shrink-0">
            <FlipCard value={hours} label={hoursLabel} color={accentColor} bg={bgColor} />
          </div>
          <div className="w-24 shrink-0">
            <FlipCard value={minutes} label={minutesLabel} color={accentColor} bg={bgColor} />
          </div>
          {params.showSeconds && (
            <div className="w-24 shrink-0">
              <FlipCard value={seconds} label={secondsLabel} color={accentColor} bg={bgColor} />
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  /* ─── Minimal (default) ─── */
  return (
    <WidgetShell params={shellParams}>
      <div className="flex items-center gap-3">
        <MinimalCard value={hours} label={hoursLabel} color={accentColor} />
        <div className="flex flex-col gap-2 mb-4">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
        </div>
        <MinimalCard value={minutes} label={minutesLabel} color={accentColor} />
        {params.showSeconds && (
          <>
            <div className="flex flex-col gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
            </div>
            <MinimalCard value={seconds} label={secondsLabel} color={accentColor} />
          </>
        )}
      </div>
    </WidgetShell>
  );
}
