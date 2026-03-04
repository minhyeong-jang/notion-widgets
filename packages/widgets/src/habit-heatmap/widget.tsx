"use client";

import { useMemo } from "react";
import { WidgetShell } from "../widget-shell";
import type { HabitHeatmapParams } from "./schema";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function getIntensityColor(accent: string, level: number): string {
  if (level === 0) return "transparent";
  const { r, g, b } = hexToRgb(accent);
  // Levels 1-4 with increasing opacity
  const opacities = [0, 0.2, 0.4, 0.65, 1.0];
  const opacity = opacities[level] ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

interface DayCell {
  date: Date;
  intensity: number; // 0-4
  isFuture: boolean;
}

function buildGrid(weeksCount: number): DayCell[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = now.getFullYear();
  const janFirst = new Date(year, 0, 1);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDaysInYear = isLeapYear ? 366 : 365;

  // Day of year for today (1-indexed)
  const todayDOY = Math.floor((today.getTime() - janFirst.getTime()) / 86400000) + 1;

  // We want to display `weeksCount` weeks ending at the current week
  // Calculate the start date: go back weeksCount weeks from the end of the current week
  const todayDow = today.getDay(); // 0=Sun, 6=Sat
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - todayDow)); // Saturday

  const startDate = new Date(endOfWeek);
  startDate.setDate(endOfWeek.getDate() - weeksCount * 7 + 1);

  const cells: DayCell[] = [];
  const totalCells = weeksCount * 7;

  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const isFuture = cellDate > today;
    const cellYear = cellDate.getFullYear();
    const cellJan1 = new Date(cellYear, 0, 1);
    const cellDOY = Math.floor((cellDate.getTime() - cellJan1.getTime()) / 86400000) + 1;

    let intensity = 0;
    if (!isFuture && cellYear === year) {
      // Create a pattern with some variety using a simple hash
      const seed = cellDOY * 7 + cellYear;
      const hash = ((seed * 2654435761) >>> 0) % 100;
      const baseIntensity = Math.ceil((cellDOY / totalDaysInYear) * 4);

      // Add variety: some days are lighter, some darker
      if (hash < 15) {
        intensity = Math.max(1, baseIntensity - 2);
      } else if (hash < 35) {
        intensity = Math.max(1, baseIntensity - 1);
      } else if (hash < 80) {
        intensity = Math.min(4, baseIntensity);
      } else {
        intensity = Math.min(4, baseIntensity + 1);
      }
    } else if (!isFuture && cellYear < year) {
      // Previous year days that appear in the grid
      const seed = cellDOY * 7 + cellYear;
      const hash = ((seed * 2654435761) >>> 0) % 100;
      intensity = hash < 30 ? 1 : hash < 60 ? 2 : hash < 85 ? 3 : 4;
    }

    cells.push({ date: cellDate, intensity, isFuture });
  }

  return cells;
}

export function HabitHeatmapWidget({ params }: { params: HabitHeatmapParams }) {
  const accentColor = "#" + params.color;
  const bgHex = params.bg;
  const isTransparentBg = bgHex === "transparent";
  const weeksCount = Math.max(12, Math.min(52, parseInt(params.weeks, 10) || 20));

  const cells = useMemo(() => buildGrid(weeksCount), [weeksCount]);

  // Organize cells into columns (weeks) x rows (days Sun-Sat)
  const weeks: DayCell[][] = [];
  for (let w = 0; w < weeksCount; w++) {
    weeks.push(cells.slice(w * 7, (w + 1) * 7));
  }

  const cellSize = Math.max(6, Math.min(14, Math.floor(340 / weeksCount)));
  const gap = Math.max(1, Math.floor(cellSize * 0.2));
  const emptyBg = isTransparentBg ? "rgba(255,255,255,0.05)" : accentColor + "15";

  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-3 px-4">
        {params.label && (
          <div
            className="text-xs font-medium opacity-70"
            style={{
              color: accentColor,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {params.label}
          </div>
        )}
        <div className="flex" style={{ gap: `${gap}px` }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: `${gap}px` }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    borderRadius: `${Math.max(1, cellSize * 0.2)}px`,
                    backgroundColor: day.isFuture || day.intensity === 0
                      ? emptyBg
                      : getIntensityColor(accentColor, day.intensity),
                    opacity: day.isFuture ? 0.3 : 1,
                  }}
                  title={day.date.toLocaleDateString()}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] opacity-50" style={{ color: accentColor }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderRadius: `${Math.max(1, cellSize * 0.2)}px`,
                backgroundColor: level === 0 ? emptyBg : getIntensityColor(accentColor, level),
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </WidgetShell>
  );
}
