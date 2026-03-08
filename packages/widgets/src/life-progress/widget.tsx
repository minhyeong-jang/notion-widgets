"use client";

import { useState, useEffect } from "react";
import { getProgressLabels, formatDate } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { ProgressBar } from "./progress-bar";
import type { LifeProgressParams } from "./schema";

interface ProgressData {
  year: number;
  month: number;
  week: number;
  day: number;
  quarter: number;
  target: number;
}

function useProgress(params: LifeProgressParams): ProgressData {
  const [data, setData] = useState<ProgressData>({
    year: 0, month: 0, week: 0, day: 0, quarter: 0, target: 0,
  });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const d = now.getDate();

      const targetDate = new Date(params.target + "T23:59:59");
      const startDate = new Date(params.start + "T00:00:00");

      const yearStart = new Date(y, 0, 1);
      const yearEnd = new Date(y + 1, 0, 1);
      const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;

      const monthStart = new Date(y, m, 1);
      const monthEnd = new Date(y, m + 1, 1);
      const monthProgress = ((now.getTime() - monthStart.getTime()) / (monthEnd.getTime() - monthStart.getTime())) * 100;

      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(d - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const weekProgress = ((now.getTime() - weekStart.getTime()) / (weekEnd.getTime() - weekStart.getTime())) * 100;

      const dayStart = new Date(y, m, d, 0, 0, 0);
      const dayEnd = new Date(y, m, d + 1, 0, 0, 0);
      const dayProgress = ((now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * 100;

      const q = Math.floor(m / 3);
      const quarterStart = new Date(y, q * 3, 1);
      const quarterEnd = new Date(y, (q + 1) * 3, 1);
      const quarterProgress = ((now.getTime() - quarterStart.getTime()) / (quarterEnd.getTime() - quarterStart.getTime())) * 100;

      const targetProgress = ((now.getTime() - startDate.getTime()) / (targetDate.getTime() - startDate.getTime())) * 100;

      setData({ year: yearProgress, month: monthProgress, week: weekProgress, day: dayProgress, quarter: quarterProgress, target: targetProgress });
    };

    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [params.target, params.start]);

  return data;
}

/* ─── Gradient colors per bar type ─── */
const gradients: Record<string, string> = {
  target: "from-emerald-500 to-emerald-400",
  year: "from-emerald-500 to-emerald-400",
  month: "from-sky-500 to-sky-400",
  quarter: "from-violet-500 to-violet-400",
  week: "from-amber-500 to-amber-400",
  day: "from-rose-500 to-rose-400",
};

/* ─── Minimal Style (default) ─── */

function ThinBar({ label, percentage, gradient, textColor, borderColor }: { label: string; percentage: number; gradient: string; textColor?: string; borderColor?: string }) {
  const clamped = Math.max(0, Math.min(percentage, 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: textColor || undefined }}>
        <span>{label}</span>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: borderColor || undefined }}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.max(clamped, clamped > 0 ? 2 : 0)}%` }}
        />
      </div>
    </div>
  );
}

function MinimalStyle({ params, data, textColor, borderColor }: { params: LifeProgressParams; data: ProgressData; textColor: string; borderColor: string }) {
  const l = getProgressLabels(params.locale);

  const bars: { key: string; label: string; pct: number; show: boolean }[] = [
    { key: "target", label: params.label, pct: data.target, show: true },
    { key: "year", label: l.year, pct: data.year, show: params.showYear },
    { key: "month", label: l.month, pct: data.month, show: params.showMonth },
    { key: "quarter", label: l.quarter, pct: data.quarter, show: params.showQuarter },
    { key: "week", label: l.week, pct: data.week, show: params.showWeek },
    { key: "day", label: l.day, pct: data.day, show: params.showDay },
  ];

  return (
    <div className="w-full max-w-sm mx-auto px-6">
      {params.title && (
        <h2
          className="text-sm font-medium mb-5 text-center"
          style={{ color: textColor, textShadow: "var(--w-text-shadow)" }}
        >
          {params.title}
        </h2>
      )}
      <div className="space-y-3">
        {bars.filter(b => b.show).map(b => (
          <ThinBar
            key={b.key}
            label={b.label}
            percentage={b.pct}
            gradient={gradients[b.key]}
            textColor={textColor}
            borderColor={borderColor}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Card Style ─── */

function CardStyle({ params, data, accentColor, textColor }: { params: LifeProgressParams; data: ProgressData; accentColor: string; textColor: string }) {
  const l = getProgressLabels(params.locale);
  const targetDate = new Date(params.target + "T23:59:59");
  const formattedTarget = formatDate(targetDate, params.dateFormat, params.locale);
  const cardStyle = { backgroundColor: accentColor + "e6" };

  return (
    <div className="w-full mx-auto">
      <div
        className="rounded-xl p-6 shadow-lg backdrop-blur-sm w-full"
        style={{
          ...cardStyle,
          borderRadius: "var(--w-radius)",
          boxShadow: "var(--w-box-shadow)",
        }}
      >
        <h2
          className="text-xl font-bold mb-4 text-center"
          style={{ color: textColor, textShadow: "var(--w-text-shadow)" }}
        >
          {params.title}
        </h2>
        <div className="space-y-4">
          <ProgressBar label={params.label} percentage={data.target} />
          {params.showYear && <ProgressBar label={l.year} percentage={data.year} />}
          {params.showMonth && <ProgressBar label={l.month} percentage={data.month} />}
          {params.showQuarter && <ProgressBar label={l.quarter} percentage={data.quarter} />}
          {params.showWeek && <ProgressBar label={l.week} percentage={data.week} />}
          {params.showDay && <ProgressBar label={l.day} percentage={data.day} />}
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: textColor, opacity: 0.8 }}>{l.targetDate}</p>
          <p className="text-sm font-bold" style={{ color: textColor }}>{formattedTarget}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Neon Style (Terminal Progress Bar) ─── */

function NeonBar({ label, percentage, accentColor }: { label: string; percentage: number; accentColor: string }) {
  const clamped = Math.max(0, Math.min(Math.round(percentage), 100));
  const barWidth = 16;
  const filled = Math.round((clamped / 100) * barWidth);
  const empty = barWidth - filled;
  const filledStr = "\u2588".repeat(filled);
  const emptyStr = "\u2591".repeat(empty);
  const pctStr = `${clamped}%`.padStart(4);

  return (
    <div style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: "1.6", whiteSpace: "pre" }}>
      <span style={{ color: accentColor, opacity: 0.6 }}>{label.toUpperCase().padEnd(8)}</span>
      <span style={{ color: "#555" }}>[</span>
      <span style={{ color: accentColor }}>{filledStr}</span>
      <span style={{ color: "#333" }}>{emptyStr}</span>
      <span style={{ color: "#555" }}>]</span>
      <span style={{ color: accentColor }}> {pctStr}</span>
    </div>
  );
}

function NeonStyle({ params, data, accentColor }: { params: LifeProgressParams; data: ProgressData; accentColor: string }) {
  const l = getProgressLabels(params.locale);

  const bars: { key: string; label: string; pct: number; show: boolean }[] = [
    { key: "target", label: params.label, pct: data.target, show: true },
    { key: "year", label: l.year, pct: data.year, show: params.showYear },
    { key: "month", label: l.month, pct: data.month, show: params.showMonth },
    { key: "quarter", label: l.quarter, pct: data.quarter, show: params.showQuarter },
    { key: "week", label: l.week, pct: data.week, show: params.showWeek },
    { key: "day", label: l.day, pct: data.day, show: params.showDay },
  ];

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      {params.title && (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: accentColor,
            opacity: 0.5,
            marginBottom: "12px",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          {">"} {params.title.toUpperCase()} {"<"}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {bars.filter(b => b.show).map(b => (
          <NeonBar key={b.key} label={b.label} percentage={b.pct} accentColor={accentColor} />
        ))}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: accentColor,
          opacity: 0.3,
          marginTop: "12px",
          textAlign: "center",
        }}
      >
        {"─".repeat(32)}
      </div>
    </div>
  );
}

/* ─── Main Widget ─── */

export function LifeProgressWidget({ params }: { params: LifeProgressParams }) {
  const data = useProgress(params);
  const accentColor = "#" + params.color;

  return (
    <WidgetShell params={params}>
      {params.style === "neon" ? (
        <NeonStyle params={params} data={data} accentColor={accentColor} />
      ) : params.variant === "card" ? (
        <CardStyle params={params} data={data} accentColor={accentColor} textColor="#fafafa" />
      ) : (
        <MinimalStyle params={params} data={data} textColor="#fafafa" borderColor="#27272a" />
      )}
    </WidgetShell>
  );
}
