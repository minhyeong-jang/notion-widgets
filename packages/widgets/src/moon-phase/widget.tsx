"use client";

import { WidgetShell } from "../widget-shell";
import type { MoonPhaseParams } from "./schema";
import { getMoonPhase } from "./moon-calc";

function MoonSVG({ phase, accentColor, size }: { phase: number; accentColor: string; size: number }) {
  // SVG moon using two circles and a mask
  // phase 0 = new moon (dark), 4 = full moon (bright)
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  // Calculate the terminator curve based on phase
  // Use an ellipse mask to create the illuminated portion
  const phaseAngle = (phase / 8) * 2 * Math.PI;

  // Direction of illumination sweep
  let d: string;

  if (phase === 0) {
    // New moon - all dark
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />
        <circle cx={cx} cy={cy} r={r - 2} fill={accentColor} opacity="0.05" />
      </svg>
    );
  }

  if (phase === 4) {
    // Full moon - all bright
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={accentColor} opacity="0.2" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
        <circle cx={cx} cy={cy} r={r * 0.85} fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.15" />
      </svg>
    );
  }

  // For other phases, create a path showing the lit portion
  // The illuminated side is determined by waxing (right side lit) vs waning (left side lit)
  const isWaxing = phase < 4;
  const illuminationFraction = Math.abs(Math.cos(phaseAngle));

  // Build the moon path using two arcs
  const top = cy - r;
  const bottom = cy + r;
  const bulge = r * illuminationFraction;

  // Terminator arc sweep
  const terminatorSweep = phase > 0 && phase < 4 ? 0 : 1;

  if (isWaxing) {
    // Right side illuminated
    // Right semicircle (always lit): arc from top to bottom going right
    // Terminator (left edge of lit area): arc from bottom to top
    d = [
      `M ${cx} ${top}`,
      `A ${r} ${r} 0 0 1 ${cx} ${bottom}`, // right semicircle
      `A ${bulge} ${r} 0 0 ${terminatorSweep} ${cx} ${top}`, // terminator
    ].join(" ");
  } else {
    // Left side illuminated
    d = [
      `M ${cx} ${top}`,
      `A ${r} ${r} 0 0 0 ${cx} ${bottom}`, // left semicircle
      `A ${bulge} ${r} 0 0 ${1 - terminatorSweep} ${cx} ${top}`, // terminator
    ].join(" ");
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle (dark side) */}
      <circle cx={cx} cy={cy} r={r} fill={accentColor} opacity="0.05" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />
      {/* Illuminated portion */}
      <path d={d} fill={accentColor} opacity="0.25" />
    </svg>
  );
}

const NEON_MOON_CHARS: Record<number, string> = {
  0: "\u25CF", // ● New Moon (filled = dark)
  1: "\u25D2", // ◒ Waxing Crescent
  2: "\u25D1", // ◑ First Quarter
  3: "\u25D1", // ◑ Waxing Gibbous (reuse quarter)
  4: "\u25CB", // ○ Full Moon (empty = bright)
  5: "\u25D0", // ◐ Waning Gibbous
  6: "\u25D0", // ◐ Last Quarter
  7: "\u25D3", // ◓ Waning Crescent
};

export function MoonPhaseWidget({ params }: { params: MoonPhaseParams }) {
  const accentColor = "#" + params.color;

  const moon = getMoonPhase(new Date());
  const isKo = params.locale.startsWith("ko");
  const phaseName = isKo ? moon.nameKo : moon.name;

  if (params.style === "neon") {
    const moonChar = NEON_MOON_CHARS[moon.phase] ?? "\u25CF";
    const nextFullStr = moon.nextFullMoon.toLocaleDateString(params.locale, {
      month: "short",
      day: "numeric",
    });

    return (
      <WidgetShell params={params}>
        <div
          className="flex flex-col items-center gap-4"
          style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)" }}
        >
          {/* ASCII Moon Character */}
          <div
            className="text-7xl leading-none"
            style={{
              color: accentColor,
              textShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}60`,
            }}
          >
            {moonChar}
          </div>

          {/* Data Table */}
          <div
            className="text-sm text-left"
            style={{
              color: accentColor,
              minWidth: "220px",
              border: `1px solid ${accentColor}25`,
              padding: "12px 16px",
            }}
          >
            <div className="flex justify-between mb-1">
              <span style={{ opacity: 0.5 }}>PHASE</span>
              <span style={{ fontWeight: 700 }}>{phaseName.toUpperCase()}</span>
            </div>
            <div
              className="mb-1"
              style={{
                borderBottom: `1px solid ${accentColor}15`,
                marginBottom: "4px",
                paddingBottom: "4px",
              }}
            />
            <div className="flex justify-between mb-1">
              <span style={{ opacity: 0.5 }}>ILLUMIN.</span>
              <span>{moon.illumination}%</span>
            </div>
            <div className="flex justify-between mb-1">
              <span style={{ opacity: 0.5 }}>AGE</span>
              <span>{moon.dayInCycle.toFixed(1)} {isKo ? "\uC77C" : "days"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ opacity: 0.5 }}>NEXT FULL</span>
              <span>{nextFullStr}</span>
            </div>
          </div>
        </div>
      </WidgetShell>
    );
  }

  if (params.variant === "detailed") {
    const nextFullStr = moon.nextFullMoon.toLocaleDateString(params.locale, {
      month: "short",
      day: "numeric",
    });
    const nextFullLabel = isKo ? "\uB2E4\uC74C \uBCF4\uB984\uB2EC" : "Next Full Moon";

    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center gap-4">
          <MoonSVG phase={moon.phase} accentColor={accentColor} size={160} />
          <div className="text-center">
            <div
              className="text-lg font-medium"
              style={{
                color: accentColor,
                textShadow: "var(--w-text-shadow)",
              }}
            >
              {phaseName}
            </div>
            <div className="text-sm mt-1 opacity-60" style={{ color: accentColor }}>
              {moon.illumination}% {isKo ? "\uC870\uBA85" : "illuminated"}
            </div>
            <div
              className="mt-3 text-xs px-3 py-1 rounded-full inline-block"
              style={{
                backgroundColor: accentColor + "1a",
                color: accentColor,
                borderRadius: "var(--w-radius)",
              }}
            >
              {nextFullLabel}: {nextFullStr}
            </div>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // Minimal style
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-3">
        <MoonSVG phase={moon.phase} accentColor={accentColor} size={140} />
        <div
          className="text-base font-medium"
          style={{
            color: accentColor,
            textShadow: "var(--w-text-shadow)",
          }}
        >
          {phaseName}
        </div>
      </div>
    </WidgetShell>
  );
}
