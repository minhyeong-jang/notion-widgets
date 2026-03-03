"use client";

import { useState, useEffect } from "react";
import { FlipCard } from "./flip-clock";
import { MinimalCard } from "./minimal-clock";
import type { FlipClockParams } from "./schema";

export function FlipClockWidget({ params }: { params: FlipClockParams }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

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

  const hoursLabel = params.showLabel
    ? is24h ? dayOfWeek : isAM ? "AM" : "PM"
    : "";
  const minutesLabel = params.showLabel
    ? is24h ? "" : dayOfWeek
    : "";
  const secondsLabel = params.showLabel ? shortDate : "";

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  const isMinimal = params.style === "minimal";
  const Card = isMinimal ? MinimalCard : FlipCard;

  if (isMinimal) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
        style={bgStyle}
      >
        <div className="flex items-center gap-3">
          <Card value={hours} label={hoursLabel} color={params.color} />
          <div className="flex flex-col gap-2 mb-4">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: `#${params.color}` }}
            />
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: `#${params.color}` }}
            />
          </div>
          <Card value={minutes} label={minutesLabel} color={params.color} />
          {params.showSeconds && (
            <>
              <div className="flex flex-col gap-2 mb-4">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: `#${params.color}`, opacity: 0.5 }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: `#${params.color}`, opacity: 0.5 }}
                />
              </div>
              <Card value={seconds} label={secondsLabel} color={params.color} />
            </>
          )}
        </div>
      </div>
    );
  }

  // Flip style
  const cardWidth = params.showSeconds ? "w-1/3" : "w-1/2";

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="flex w-full">
        <div className={`${cardWidth} pr-2`}>
          <Card value={hours} label={hoursLabel} color={params.color} />
        </div>
        <div className={`${cardWidth} ${params.showSeconds ? "px-1" : "pl-2"}`}>
          <Card value={minutes} label={minutesLabel} color={params.color} />
        </div>
        {params.showSeconds && (
          <div className={`${cardWidth} pl-2`}>
            <Card value={seconds} label={secondsLabel} color={params.color} />
          </div>
        )}
      </div>
    </div>
  );
}
