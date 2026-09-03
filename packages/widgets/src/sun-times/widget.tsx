"use client";

import { useState, useEffect, useId } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { SunTimesParams } from "./schema";
import { getCity } from "./cities";
import { getSunTimes } from "./sun-calc";

function formatTime(date: Date, tz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  }).format(date);
}

function formatDuration(ms: number, isKo: boolean): string {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (isKo) {
    if (h <= 0) return `${m}분`;
    return `${h}시간 ${m}분`;
  }
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

interface SunInfo {
  sunrise: Date | null;
  sunset: Date | null;
  dayLengthMs: number;
  fraction: number; // 0..1 daylight elapsed
  phase: "beforeSunrise" | "day" | "afterSunset" | "polarDay" | "polarNight";
  nextEventMs: number; // ms until the next relevant event (day/beforeSunrise only)
}

function computeSunInfo(now: Date, lat: number, lng: number): SunInfo {
  const t = getSunTimes(now, lat, lng);
  if (t.polarDay) {
    return { sunrise: null, sunset: null, dayLengthMs: 86400000, fraction: 0.5, phase: "polarDay", nextEventMs: 0 };
  }
  if (t.polarNight || !t.sunrise || !t.sunset) {
    return { sunrise: null, sunset: null, dayLengthMs: 0, fraction: 0, phase: "polarNight", nextEventMs: 0 };
  }
  const dayLengthMs = t.sunset.getTime() - t.sunrise.getTime();
  const n = now.getTime();
  if (n < t.sunrise.getTime()) {
    return {
      sunrise: t.sunrise, sunset: t.sunset, dayLengthMs,
      fraction: 0, phase: "beforeSunrise", nextEventMs: t.sunrise.getTime() - n,
    };
  }
  if (n > t.sunset.getTime()) {
    return {
      sunrise: t.sunrise, sunset: t.sunset, dayLengthMs,
      fraction: 1, phase: "afterSunset", nextEventMs: 0,
    };
  }
  const fraction = Math.min(1, Math.max(0, (n - t.sunrise.getTime()) / dayLengthMs));
  return {
    sunrise: t.sunrise, sunset: t.sunset, dayLengthMs,
    fraction, phase: "day", nextEventMs: t.sunset.getTime() - n,
  };
}

interface Palette {
  accent: string;
  accentBright: string;
  accentDeep: string;
  text: string;
  textDim: string;
  textFaint: string;
  track: string;
}

function SunArc({ info, colors, gradId }: { info: SunInfo; colors: Palette; gradId: string }) {
  const W = 280;
  const H = 150;
  const cx = W / 2;
  const baseline = 126;
  const R = 108;
  const isDay = info.phase === "day" || info.phase === "polarDay";

  const theta = Math.PI * (1 - info.fraction);
  const sunX = cx + R * Math.cos(theta);
  const sunY = baseline - R * Math.sin(theta);

  const leftX = cx - R;
  // sweep-flag 1 bulges the arc upward (above the horizon baseline)
  const arcFull = `M ${leftX} ${baseline} A ${R} ${R} 0 0 1 ${cx + R} ${baseline}`;
  const arcElapsed = `M ${leftX} ${baseline} A ${R} ${R} 0 0 1 ${sunX.toFixed(2)} ${sunY.toFixed(2)}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, overflow: "visible" }}>
      <defs>
        <radialGradient id={`${gradId}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.accentBright} />
          <stop offset="100%" stopColor={colors.accentDeep} />
        </radialGradient>
        <linearGradient id={`${gradId}-arc`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.accentDeep} />
          <stop offset="100%" stopColor={colors.accentBright} />
        </linearGradient>
      </defs>

      {/* Horizon line */}
      <line
        x1={leftX - 14} y1={baseline} x2={cx + R + 14} y2={baseline}
        stroke={colors.textFaint} strokeWidth="1" strokeDasharray="2 4" opacity="0.6"
      />

      {/* Full arc track */}
      <path d={arcFull} fill="none" stroke={colors.track} strokeWidth="3" strokeLinecap="round" opacity="0.55" />

      {/* Elapsed arc */}
      {isDay && (
        <path
          d={arcElapsed}
          fill="none"
          stroke={`url(#${gradId}-arc)`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}

      {/* Sun / marker */}
      {isDay ? (
        <>
          <circle cx={sunX} cy={sunY} r="16" fill={colors.accent} opacity="0.18" />
          <circle cx={sunX} cy={sunY} r="9" fill={`url(#${gradId}-sun)`} />
          <circle cx={sunX} cy={sunY} r="9" fill="none" stroke={colors.accentBright} strokeWidth="1" opacity="0.5" />
        </>
      ) : (
        <circle
          cx={info.phase === "beforeSunrise" ? leftX : cx + R}
          cy={baseline}
          r="6"
          fill={colors.textFaint}
          opacity="0.7"
        />
      )}

      {/* Sunrise / sunset endpoint ticks */}
      <circle cx={leftX} cy={baseline} r="2.5" fill={colors.textDim} />
      <circle cx={cx + R} cy={baseline} r="2.5" fill={colors.textDim} />
    </svg>
  );
}

export function SunTimesWidget({ params }: { params: SunTimesParams }) {
  const mode = useWidgetColorMode();
  const c = resolveColors(params.accent, mode);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `st${rawId}`;

  const colors: Palette = {
    accent: `#${c.accent}`,
    accentBright: `#${c.accentBright}`,
    accentDeep: `#${c.accentDeep}`,
    text: `#${c.text}`,
    textDim: `#${c.textDim}`,
    textFaint: `#${c.textFaint}`,
    track: `#${c.track}`,
  };

  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Time / locale formatting differs between the prerendered HTML and the
  // client (ICU data, live clock), so defer time-dependent output until mount.
  if (!mounted) {
    return (
      <WidgetShell params={params}>
        <div style={{ width: params.variant === "compact" ? 240 : 300, height: 200 }} />
      </WidgetShell>
    );
  }

  const city = getCity(params.city);
  const isKo = params.locale.startsWith("ko");
  const info = computeSunInfo(now, city.lat, city.lng);
  const cityName = isKo ? city.nameKo : city.name;

  const sunriseStr = info.sunrise ? formatTime(info.sunrise, city.tz, params.locale) : "—";
  const sunsetStr = info.sunset ? formatTime(info.sunset, city.tz, params.locale) : "—";
  const dayLenStr = formatDuration(info.dayLengthMs, isKo);

  const L = {
    sunrise: isKo ? "일출" : "Sunrise",
    sunset: isKo ? "일몰" : "Sunset",
    dayLength: isKo ? "낮 길이" : "Day length",
  };

  let status: string;
  if (info.phase === "day") {
    status = isKo
      ? `일몰까지 ${formatDuration(info.nextEventMs, isKo)}`
      : `${formatDuration(info.nextEventMs, isKo)} until sunset`;
  } else if (info.phase === "beforeSunrise") {
    status = isKo
      ? `일출까지 ${formatDuration(info.nextEventMs, isKo)}`
      : `${formatDuration(info.nextEventMs, isKo)} until sunrise`;
  } else if (info.phase === "afterSunset") {
    status = isKo ? "일몰 후 · 밤" : "After sunset · Night";
  } else if (info.phase === "polarDay") {
    status = isKo ? "백야 (하루 종일 낮)" : "Polar day";
  } else {
    status = isKo ? "극야 (해가 뜨지 않음)" : "Polar night";
  }

  const glowText = { textShadow: "var(--w-text-shadow)" };

  if (params.variant === "compact") {
    const rows: { label: string; value: string; color: string }[] = [
      { label: L.sunrise, value: sunriseStr, color: colors.accent },
      { label: L.sunset, value: sunsetStr, color: colors.accent },
      { label: L.dayLength, value: dayLenStr, color: colors.text },
    ];
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col" style={{ minWidth: 240, gap: 14 }}>
          <div className="flex items-baseline justify-between" style={{ gap: 12 }}>
            <span className="text-base font-semibold" style={{ color: colors.text, ...glowText }}>
              {cityName}
            </span>
            <span className="text-xs" style={{ color: colors.textDim }}>
              {status}
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: 10 }}>
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between" style={{ gap: 16 }}>
                <span className="text-sm" style={{ color: colors.textDim }}>{r.label}</span>
                <span className="text-lg font-semibold tabular-nums" style={{ color: r.color, ...glowText }}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // Arc variant (default)
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center w-full" style={{ maxWidth: 320, gap: 6 }}>
        <div className="flex flex-col items-center" style={{ gap: 2 }}>
          <span className="text-base font-semibold" style={{ color: colors.text, ...glowText }}>
            {cityName}
          </span>
          <span className="text-xs" style={{ color: colors.textDim }}>
            {status}
          </span>
        </div>

        <SunArc info={info} colors={colors} gradId={gradId} />

        <div className="flex items-start justify-between w-full" style={{ marginTop: -8, padding: "0 6px" }}>
          <div className="flex flex-col items-center" style={{ gap: 1 }}>
            <span className="text-[10px] uppercase tracking-wide" style={{ color: colors.textFaint }}>
              {L.sunrise}
            </span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: colors.accent, ...glowText }}>
              {sunriseStr}
            </span>
          </div>
          <div className="flex flex-col items-center" style={{ gap: 1 }}>
            <span className="text-[10px] uppercase tracking-wide" style={{ color: colors.textFaint }}>
              {L.dayLength}
            </span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: colors.text, ...glowText }}>
              {dayLenStr}
            </span>
          </div>
          <div className="flex flex-col items-center" style={{ gap: 1 }}>
            <span className="text-[10px] uppercase tracking-wide" style={{ color: colors.textFaint }}>
              {L.sunset}
            </span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: colors.accent, ...glowText }}>
              {sunsetStr}
            </span>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
