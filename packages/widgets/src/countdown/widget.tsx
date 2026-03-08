"use client";

import { useState, useEffect } from "react";
import { WidgetShell } from "../widget-shell";
import type { CountdownParams } from "./schema";

function useCountdown(targetDate: string) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(targetDate + "T00:00:00");
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = targetStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const dDayLabel =
    diffDays > 0
      ? `D-${diffDays}`
      : diffDays === 0
        ? "D-Day"
        : `D+${Math.abs(diffDays)}`;

  // Breakdown: months, days, hours
  const totalMonths = Math.max(0, Math.floor(diffDays / 30));
  const remainingDays = Math.max(0, diffDays % 30);

  // Time remaining until end of target day
  const targetEnd = new Date(targetDate + "T23:59:59");
  const timeRemainingMs = Math.max(0, targetEnd.getTime() - now.getTime());
  const totalSeconds = Math.floor(timeRemainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  return {
    diffDays,
    dDayLabel,
    totalMonths,
    remainingDays,
    hours,
    minutes,
    seconds,
  };
}

/* ─── Card Style (default) ─── */

function CardStyle({
  countdown,
  accentColor,
  textColor,
  borderColor,
  label,
  showHours,
}: {
  countdown: ReturnType<typeof useCountdown>;
  accentColor: string;
  textColor: string;
  borderColor: string;
  label: string;
  showHours: boolean;
}) {
  const items = [
    { value: String(countdown.totalMonths), label: "mon" },
    { value: String(countdown.remainingDays), label: "day" },
    { value: countdown.hours.toString().padStart(2, "0"), label: "hr" },
  ];

  return (
    <div className="text-center px-6">
      <div
        className="text-6xl sm:text-7xl font-bold tracking-tight"
        style={{ color: accentColor, textShadow: "var(--w-text-shadow)" }}
      >
        {countdown.dDayLabel}
      </div>
      <div className="mt-2 text-base font-medium" style={{ color: textColor, opacity: 0.7 }}>
        {label}
      </div>
      {showHours && countdown.diffDays >= 0 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1 min-w-[3.5rem] py-2.5 px-3"
              style={{
                backgroundColor: `${textColor}08`,
                border: `1px solid ${borderColor}`,
                borderRadius: "var(--w-radius)",
              }}
            >
              <span className="text-2xl font-mono font-bold tabular-nums" style={{ color: textColor }}>
                {item.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: textColor, opacity: 0.5 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Simple Style ─── */

function SimpleStyle({
  countdown,
  accentColor,
  textColor,
  label,
  showHours,
}: {
  countdown: ReturnType<typeof useCountdown>;
  accentColor: string;
  textColor: string;
  label: string;
  showHours: boolean;
}) {
  return (
    <div className="text-center px-6">
      <div
        className="text-7xl font-bold tracking-tight"
        style={{ color: accentColor, textShadow: "var(--w-text-shadow)" }}
      >
        {countdown.dDayLabel}
      </div>
      <div className="mt-3 text-lg font-medium" style={{ color: textColor, opacity: 0.7 }}>
        {label}
      </div>
      {showHours && countdown.diffDays >= 0 && (
        <div className="mt-4 text-2xl font-mono tabular-nums" style={{ color: textColor, opacity: 0.5 }}>
          {countdown.hours.toString().padStart(2, "0")}:
          {countdown.minutes.toString().padStart(2, "0")}:
          {countdown.seconds.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

/* ─── Neon: T-Minus Military Launch Style ─── */

function NeonStyle({
  countdown,
  accentColor,
  label,
  showHours,
}: {
  countdown: ReturnType<typeof useCountdown>;
  accentColor: string;
  label: string;
  showHours: boolean;
}) {
  const isUrgent = countdown.diffDays >= 0 && countdown.diffDays <= 1;
  const isComplete = countdown.diffDays <= 0;

  const monoStyle: React.CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: accentColor,
    textShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}66`,
  };

  const borderLine = `\u250C${"─".repeat(24)}\u2510`;
  const bottomLine = `\u2514${"─".repeat(24)}\u2518`;

  const statusText = isComplete
    ? "STATUS: COMPLETE"
    : isUrgent
      ? "STATUS: CRITICAL"
      : "STATUS: ACTIVE";

  const tMinusText = countdown.diffDays > 0
    ? `T- ${String(countdown.diffDays).padStart(4, " ")} DAYS`
    : countdown.diffDays === 0
      ? "T-  ZERO"
      : `T+ ${String(Math.abs(countdown.diffDays)).padStart(4, " ")} DAYS`;

  return (
    <div
      style={{
        ...monoStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "16px 24px",
        letterSpacing: "0.15em",
      }}
    >
      {/* Top border */}
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre" }}>
        {borderLine}
      </div>

      {/* Header */}
      <div
        style={{
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.3em",
          opacity: 0.5,
          marginBottom: "8px",
        }}
      >
        COUNTDOWN
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          opacity: 0.6,
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      {/* T-minus display */}
      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          whiteSpace: "pre",
          animation: isUrgent ? "neon-blink 1s steps(1) infinite" : undefined,
        }}
      >
        {tMinusText}
      </div>

      {/* Detailed time */}
      {showHours && countdown.diffDays >= 0 && (
        <div
          style={{
            fontSize: "1.1rem",
            opacity: 0.7,
            marginTop: "8px",
            letterSpacing: "0.12em",
          }}
        >
          {countdown.hours.toString().padStart(2, "0")}H{" "}
          {countdown.minutes.toString().padStart(2, "0")}M{" "}
          {countdown.seconds.toString().padStart(2, "0")}S
        </div>
      )}

      {/* Status line */}
      <div
        style={{
          fontSize: "0.6rem",
          marginTop: "12px",
          letterSpacing: "0.25em",
          opacity: isUrgent ? 0.9 : 0.4,
          color: isUrgent ? "#ff4444" : accentColor,
          textShadow: isUrgent
            ? "0 0 8px #ff4444, 0 0 16px #ff444466"
            : `0 0 8px ${accentColor}66`,
        }}
      >
        {statusText}
      </div>

      {/* Bottom border */}
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre", marginTop: "4px" }}>
        {bottomLine}
      </div>

      {/* Blink animation for urgent state */}
      {isUrgent && (
        <style>{`
          @keyframes neon-blink {
            0%, 70% { opacity: 1; }
            71%, 100% { opacity: 0.3; }
          }
        `}</style>
      )}
    </div>
  );
}

/* ─── Main Widget ─── */

export function CountdownWidget({ params }: { params: CountdownParams }) {
  const countdown = useCountdown(params.targetDate);
  const accentColor = "#" + params.color;
  const textColor = "#fafafa";
  const borderColor = "#" + params.color + "33";

  return (
    <WidgetShell params={params}>
      {params.style === "neon" ? (
        <NeonStyle countdown={countdown} accentColor={accentColor} label={params.label} showHours={params.showHours} />
      ) : params.variant === "simple" ? (
        <SimpleStyle countdown={countdown} accentColor={accentColor} textColor={textColor} label={params.label} showHours={params.showHours} />
      ) : (
        <CardStyle countdown={countdown} accentColor={accentColor} textColor={textColor} borderColor={borderColor} label={params.label} showHours={params.showHours} />
      )}
    </WidgetShell>
  );
}
