"use client";

import { useState, useEffect } from "react";
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
  params,
  countdown,
}: {
  params: CountdownParams;
  countdown: ReturnType<typeof useCountdown>;
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
        style={{ color: "#" + params.color }}
      >
        {countdown.dDayLabel}
      </div>
      <div className="mt-2 text-white/70 text-base font-medium">
        {params.label}
      </div>
      {params.showHours && countdown.diffDays >= 0 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1 min-w-[3.5rem] py-2.5 px-3 rounded-xl bg-white/5 border border-white/10"
            >
              <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
                {item.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
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
  params,
  countdown,
}: {
  params: CountdownParams;
  countdown: ReturnType<typeof useCountdown>;
}) {
  return (
    <div className="text-center px-6">
      <div
        className="text-7xl font-bold tracking-tight"
        style={{ color: "#" + params.color }}
      >
        {countdown.dDayLabel}
      </div>
      <div className="mt-3 text-white/70 text-lg font-medium">
        {params.label}
      </div>
      {params.showHours && countdown.diffDays >= 0 && (
        <div className="mt-4 text-white/50 text-2xl font-mono tabular-nums">
          {countdown.hours.toString().padStart(2, "0")}:
          {countdown.minutes.toString().padStart(2, "0")}:
          {countdown.seconds.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

/* ─── Main Widget ─── */

export function CountdownWidget({ params }: { params: CountdownParams }) {
  const countdown = useCountdown(params.targetDate);

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      {params.style === "simple" ? (
        <SimpleStyle params={params} countdown={countdown} />
      ) : (
        <CardStyle params={params} countdown={countdown} />
      )}
    </div>
  );
}
