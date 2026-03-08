"use client";

import { useState, useEffect } from "react";
import { WidgetShell } from "../widget-shell";
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
  const textColor = "#fafafa";
  const isVintage = params.variant === "vintage";
  const isClassic = params.variant === "classic";

  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const frameColor = isVintage
    ? "#8b7355"
    : isClassic
      ? textColor
      : accentColor;

  const handColor = isVintage ? "#4a3728" : textColor;
  const secondHandColor = isVintage ? "#8b4513" : accentColor;
  const tickColor = isVintage ? "#4a3728" : textColor;
  const numberFont = isVintage ? "serif" : "sans-serif";
  const hourHandWidth = isClassic ? 4 : 2.5;
  const minuteHandWidth = isClassic ? 3 : 2;

  /* ─── Neon: Radar Screen ─── */
  if (params.style === "neon") {
    const glowFilter = `drop-shadow(0 0 3px ${accentColor}) drop-shadow(0 0 6px ${accentColor}88)`;

    // Generate trailing lines for the second hand (fading sweep trail)
    const trailCount = 8;
    const trailLines = Array.from({ length: trailCount }, (_, i) => {
      const trailAngle = secondAngle - (i + 1) * 3;
      const opacity = 0.4 - i * (0.35 / trailCount);
      return (
        <line
          key={`trail-${i}`}
          x1="100"
          y1="100"
          x2="100"
          y2="18"
          stroke={accentColor}
          strokeWidth={1}
          strokeOpacity={Math.max(0, opacity)}
          strokeLinecap="round"
          transform={`rotate(${trailAngle} 100 100)`}
        />
      );
    });

    return (
      <WidgetShell params={params}>
        <svg
          viewBox="0 0 200 200"
          className="w-full max-w-[280px]"
          style={{ filter: glowFilter }}
        >
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric grid rings */}
          {[25, 45, 65, 85].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={accentColor}
              strokeWidth={0.5}
              strokeOpacity={0.15}
            />
          ))}

          {/* Crosshair lines */}
          <line x1="100" y1="5" x2="100" y2="195" stroke={accentColor} strokeWidth={0.5} strokeOpacity={0.12} />
          <line x1="5" y1="100" x2="195" y2="100" stroke={accentColor} strokeWidth={0.5} strokeOpacity={0.12} />

          {/* Outer ring */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={accentColor}
            strokeWidth={1.5}
            strokeOpacity={0.5}
          />

          {/* Hour markers as bright blips */}
          {hourNumbers.map((n) => {
            const angle = (n * 30 - 90) * (Math.PI / 180);
            const blipR = 88;
            const cx = 100 + blipR * Math.cos(angle);
            const cy = 100 + blipR * Math.sin(angle);
            return (
              <circle
                key={n}
                cx={cx}
                cy={cy}
                r={n % 3 === 0 ? 3 : 2}
                fill={accentColor}
                fillOpacity={n % 3 === 0 ? 0.9 : 0.5}
              />
            );
          })}

          {/* Hour hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="45"
            stroke={accentColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeOpacity={0.9}
            transform={`rotate(${hourAngle} 100 100)`}
            style={{ transition: "transform 0.3s ease" }}
          />

          {/* Minute hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="28"
            stroke={accentColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeOpacity={0.7}
            transform={`rotate(${minuteAngle} 100 100)`}
            style={{ transition: "transform 0.3s ease" }}
          />

          {/* Second hand trail */}
          {params.showSeconds && trailLines}

          {/* Second hand */}
          {params.showSeconds && (
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="18"
              stroke={accentColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeOpacity={0.9}
              transform={`rotate(${secondAngle} 100 100)`}
            />
          )}

          {/* Center blip */}
          <circle cx="100" cy="100" r="3" fill={accentColor} fillOpacity={0.9} />
          <circle cx="100" cy="100" r="6" fill="none" stroke={accentColor} strokeWidth={0.5} strokeOpacity={0.3} />
        </svg>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell params={params}>
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
    </WidgetShell>
  );
}
