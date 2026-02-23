"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "./progress-bar";

export function LifeProgressWidget() {
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

      const targetDate = new Date(2030, 11, 31, 23, 59, 59);
      const startDate = new Date(2025, 7, 1);

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
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen flex items-center justify-center w-full">
      <div className="w-full mx-auto">
        <div className="bg-[#7fb686]/90 rounded-xl p-6 shadow-lg backdrop-blur-sm w-full">
          <h2 className="text-white text-xl font-bold mb-4 text-center">
            Life Progress
          </h2>

          <div className="space-y-4">
            <ProgressBar label="Ocean View" percentage={progressData.target} />
            <ProgressBar label="Year" percentage={progressData.year} />
            <ProgressBar label="Month" percentage={progressData.month} />
            <ProgressBar label="Quarter" percentage={progressData.quarter} />
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80 text-xs">Target Date</p>
            <p className="text-white text-sm font-bold">December 31, 2030</p>
          </div>
        </div>
      </div>
    </div>
  );
}
