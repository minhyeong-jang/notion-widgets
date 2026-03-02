"use client";

import { useState, useEffect } from "react";
import type { CountdownParams } from "./schema";

export function CountdownWidget({ params }: { params: CountdownParams }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(params.targetDate + "T00:00:00");
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = targetStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // D-Day convention: targetDate 당일 = D-0
  const dDayLabel = diffDays > 0
    ? `D-${diffDays}`
    : diffDays === 0
      ? "D-Day"
      : `D+${Math.abs(diffDays)}`;

  // Time remaining until end of target day
  const targetEnd = new Date(params.targetDate + "T23:59:59");
  const timeRemainingMs = Math.max(0, targetEnd.getTime() - now.getTime());
  const totalSeconds = Math.floor(timeRemainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="text-center px-6">
        <div
          className="text-7xl font-bold tracking-tight"
          style={{ color: "#" + params.color }}
        >
          {dDayLabel}
        </div>
        <div className="mt-3 text-white/70 text-lg font-medium">
          {params.label}
        </div>
        {params.showHours && diffDays >= 0 && (
          <div className="mt-4 text-white/50 text-2xl font-mono tabular-nums">
            {hours.toString().padStart(2, "0")}:
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  );
}
