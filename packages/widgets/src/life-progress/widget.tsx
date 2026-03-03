"use client";

import { useState, useEffect } from "react";
import { getProgressLabels, formatDate } from "@nw/widget-core";
import { ProgressBar } from "./progress-bar";
import type { LifeProgressParams } from "./schema";

export function LifeProgressWidget({ params }: { params: LifeProgressParams }) {
  const l = getProgressLabels(params.locale);
  const [progressData, setProgressData] = useState({
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    quarter: 0,
    target: 0,
  });

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDate = now.getDate();

      const targetDate = new Date(params.target + "T23:59:59");
      const startDate = new Date(params.start + "T00:00:00");

      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear + 1, 0, 1);
      const yearProgress =
        ((now.getTime() - yearStart.getTime()) /
          (yearEnd.getTime() - yearStart.getTime())) *
        100;

      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 1);
      const monthProgress =
        ((now.getTime() - monthStart.getTime()) /
          (monthEnd.getTime() - monthStart.getTime())) *
        100;

      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(currentDate - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const weekProgress =
        ((now.getTime() - weekStart.getTime()) /
          (weekEnd.getTime() - weekStart.getTime())) *
        100;

      const dayStart = new Date(
        currentYear,
        currentMonth,
        currentDate,
        0,
        0,
        0,
      );
      const dayEnd = new Date(
        currentYear,
        currentMonth,
        currentDate + 1,
        0,
        0,
        0,
      );
      const dayProgress =
        ((now.getTime() - dayStart.getTime()) /
          (dayEnd.getTime() - dayStart.getTime())) *
        100;

      const currentQuarter = Math.floor(currentMonth / 3);
      const quarterStart = new Date(currentYear, currentQuarter * 3, 1);
      const quarterEnd = new Date(currentYear, (currentQuarter + 1) * 3, 1);
      const quarterProgress =
        ((now.getTime() - quarterStart.getTime()) /
          (quarterEnd.getTime() - quarterStart.getTime())) *
        100;

      const targetProgress =
        ((now.getTime() - startDate.getTime()) /
          (targetDate.getTime() - startDate.getTime())) *
        100;

      setProgressData({
        year: yearProgress,
        month: monthProgress,
        week: weekProgress,
        day: dayProgress,
        quarter: quarterProgress,
        target: targetProgress,
      });
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000);

    return () => clearInterval(interval);
  }, [params.target, params.start]);

  const targetDate = new Date(params.target + "T23:59:59");
  const formattedTarget = formatDate(targetDate, params.dateFormat, params.locale);

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  const cardStyle = { backgroundColor: "#" + params.color + "e6" };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="w-full mx-auto">
        <div
          className="rounded-xl p-6 shadow-lg backdrop-blur-sm w-full"
          style={cardStyle}
        >
          <h2 className="text-white text-xl font-bold mb-4 text-center">
            {params.title}
          </h2>

          <div className="space-y-4">
            <ProgressBar label={params.label} percentage={progressData.target} />
            {params.showYear && (
              <ProgressBar label={l.year} percentage={progressData.year} />
            )}
            {params.showMonth && (
              <ProgressBar label={l.month} percentage={progressData.month} />
            )}
            {params.showQuarter && (
              <ProgressBar label={l.quarter} percentage={progressData.quarter} />
            )}
            {params.showWeek && (
              <ProgressBar label={l.week} percentage={progressData.week} />
            )}
            {params.showDay && (
              <ProgressBar label={l.day} percentage={progressData.day} />
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80 text-xs">{l.targetDate}</p>
            <p className="text-white text-sm font-bold">{formattedTarget}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
