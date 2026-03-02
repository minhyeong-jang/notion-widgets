"use client";

import { useState, useEffect } from "react";
import type { AnalogClockParams } from "./schema";

export function AnalogClockWidget({ params }: { params: AnalogClockParams }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const accentColor = "#" + params.color;
  const isVintage = params.style === "vintage";
  const isClassic = params.style === "classic";

  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  const frameColor = isVintage
    ? "#8b7355"
    : isClassic
      ? "white"
      : accentColor;

  const handColor = isVintage ? "#4a3728" : "white";
  const secondHandColor = isVintage ? "#8b4513" : accentColor;
  const tickColor = isVintage ? "#4a3728" : "white";
  const numberFont = isVintage ? "serif" : "sans-serif";
  const hourHandWidth = isClassic ? 4 : 2.5;
  const minuteHandWidth = isClassic ? 3 : 2;

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <svg viewBox="0 0 200 200" className="w-full max-w-[280px]">
        {/* Clock face */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={frameColor}
          strokeWidth={isClassic ? 3 : 1.5}
          strokeOpacity={isVintage ? 0.6 : 0.3}
        />

        {/* Hour markers */}
        {hourNumbers.map(n => {
          const angle = (n * 30 - 90) * (Math.PI / 180);
          const outerR = 88;
          const innerR = params.showNumbers ? 78 : 82;
          const x1 = 100 + outerR * Math.cos(angle);
          const y1 = 100 + outerR * Math.sin(angle);
          const x2 = 100 + innerR * Math.cos(angle);
          const y2 = 100 + innerR * Math.sin(angle);
          const textR = 72;
          const tx = 100 + textR * Math.cos(angle);
          const ty = 100 + textR * Math.sin(angle);

          return (
            <g key={n}>
              {!params.showNumbers && (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tickColor}
                  strokeWidth={n % 3 === 0 ? 2 : 1}
                  strokeOpacity={0.6}
                />
              )}
              {params.showNumbers && (
                <>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={100 + 84 * Math.cos(angle)}
                    y2={100 + 84 * Math.sin(angle)}
                    stroke={tickColor}
                    strokeWidth={1}
                    strokeOpacity={0.3}
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={tickColor}
                    fillOpacity={0.8}
                    fontSize={isClassic ? 14 : 11}
                    fontFamily={numberFont}
                    fontWeight={isClassic ? "bold" : "normal"}
                  >
                    {n}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Minute ticks */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 100 + 88 * Math.cos(angle);
          const y1 = 100 + 88 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={tickColor}
              strokeWidth={0.5}
              strokeOpacity={0.3}
            />
          );
        })}

        {/* Hour hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="42"
          stroke={handColor}
          strokeWidth={hourHandWidth}
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 100 100)`}
          style={{ transition: "transform 0.3s ease" }}
        />

        {/* Minute hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="25"
          stroke={handColor}
          strokeWidth={minuteHandWidth}
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 100 100)`}
          style={{ transition: "transform 0.3s ease" }}
        />

        {/* Second hand */}
        {params.showSeconds && (
          <line
            x1="100"
            y1="115"
            x2="100"
            y2="22"
            stroke={secondHandColor}
            strokeWidth={1}
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 100 100)`}
          />
        )}

        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r={isClassic ? 4 : 3}
          fill={isVintage ? "#8b7355" : accentColor}
        />
        {isVintage && (
          <circle
            cx="100"
            cy="100"
            r={5}
            fill="none"
            stroke="#8b7355"
            strokeWidth={1}
            strokeOpacity={0.5}
          />
        )}
      </svg>
    </div>
  );
}
