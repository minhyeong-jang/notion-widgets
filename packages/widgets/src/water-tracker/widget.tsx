"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { useTracker } from "../use-tracker";
import { TrackerControls } from "../tracker-controls";
import type { WaterTrackerParams } from "./schema";

function clampPct(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, (current / goal) * 100));
}

/** Build a horizontally-tiling wave path that fills downward to `floor`. */
function wavePath(width: number, amp: number, period: number, floor: number): string {
  let d = `M 0 0`;
  for (let x = 0; x < width; x += period) {
    d += ` q ${period / 4} ${-2 * amp} ${period / 2} 0 q ${period / 4} ${2 * amp} ${period / 2} 0`;
  }
  d += ` L ${width} ${floor} L 0 ${floor} Z`;
  return d;
}

const STRINGS: Record<string, { add: string; reset: string; done: string }> = {
  ko: { add: "마셨어요", reset: "비우기", done: "목표 달성! 🎉" },
  en: { add: "Drink", reset: "Reset", done: "Goal reached! 🎉" },
  ja: { add: "飲んだ", reset: "リセット", done: "目標達成！🎉" },
  zh: { add: "喝了一杯", reset: "重置", done: "目标达成！🎉" },
  de: { add: "Getrunken", reset: "Zurücksetzen", done: "Ziel erreicht! 🎉" },
  fr: { add: "Bu", reset: "Réinitialiser", done: "Objectif atteint ! 🎉" },
  es: { add: "Bebido", reset: "Reiniciar", done: "¡Meta alcanzada! 🎉" },
};

export function WaterTrackerWidget({ params }: { params: WaterTrackerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const storageKey = `nw:water-tracker:${(params.label || "water").trim().toLowerCase()}`;
  const { count, hydrated, increment, reset } = useTracker({
    storageKey,
    period: params.period,
    step: 1,
  });

  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const borderStrong = `#${colors.borderStrong}`;

  const isNeon = params.style === "neon";

  const pct = clampPct(count, params.goal);
  const pctRounded = Math.round(pct);
  const reached = count >= params.goal;

  const outlineColor = isNeon ? `${accent}40` : borderStrong;
  const fillGlow = isNeon ? `drop-shadow(0 0 5px ${accentBright})` : undefined;
  const waterColor = isNeon ? accentBright : accent;

  const bigText = params.showPercent ? `${pctRounded}%` : `${count}`;
  const subText = params.showPercent
    ? `${count} / ${params.goal}${params.unit ? ` ${params.unit}` : ""}`
    : `/ ${params.goal}${params.unit ? ` ${params.unit}` : ""}`;

  const baseId = `water-${params.accent}-${mode}-${params.variant}`;

  const labelEl = params.label ? (
    <div
      className="text-[11px] font-semibold"
      style={{
        color: isNeon ? accentBright : textDim,
        textShadow: "var(--w-text-shadow)",
        fontFamily: isNeon ? "monospace" : undefined,
        letterSpacing: isNeon ? "2px" : "0.08em",
        textTransform: "uppercase",
      }}
    >
      {isNeon ? `> ${params.label}` : params.label}
    </div>
  ) : null;

  const bigEl = (
    <div
      className="font-bold tabular-nums leading-none"
      style={{
        fontSize: 34,
        color: isNeon ? accentBright : text,
        textShadow: "var(--w-text-shadow)",
        fontFamily: isNeon ? "monospace" : undefined,
      }}
    >
      {bigText}
    </div>
  );

  const subEl = (
    <div
      className="text-xs font-medium tabular-nums"
      style={{
        color: isNeon ? accent : textFaint,
        opacity: isNeon ? 0.75 : 1,
        fontFamily: isNeon ? "monospace" : undefined,
      }}
    >
      {subText}
    </div>
  );

  const controlsEl = (
    <TrackerControls
      style={params.style}
      colors={colors}
      reached={reached}
      addLabel={t.add}
      resetLabel={t.reset}
      reachedLabel={t.done}
      onAdd={increment}
      onReset={reset}
      disabled={!hydrated}
    />
  );

  const waveKeyframes = (
    <style>{`
      @keyframes water-wave-a { from { transform: translateX(0); } to { transform: translateX(-120px); } }
      @keyframes water-wave-b { from { transform: translateX(-120px); } to { transform: translateX(0); } }
    `}</style>
  );

  let visual: React.ReactNode;

  if (params.variant === "glasses") {
    const n = Math.min(params.goal, 24);
    visual = (
      <>
        {labelEl}
        <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 150 }}>
          {Array.from({ length: n }).map((_, i) => {
            const frac = Math.max(0, Math.min(1, count - i));
            return (
              <GlassIcon
                key={i}
                id={`${baseId}-g${i}`}
                frac={frac}
                water={waterColor}
                deep={isNeon ? accentBright : accentDeep}
                outline={outlineColor}
                glow={fillGlow}
              />
            );
          })}
        </div>
        <div className="flex items-baseline gap-1.5">
          {bigEl}
          {subEl}
        </div>
      </>
    );
  } else if (params.variant === "droplets") {
    const n = Math.min(params.goal, 24);
    visual = (
      <>
        {labelEl}
        <div className="flex flex-wrap justify-center" style={{ gap: 9, maxWidth: 145 }}>
          {Array.from({ length: n }).map((_, i) => {
            const frac = Math.max(0, Math.min(1, count - i));
            return (
              <DropletIcon
                key={i}
                id={`${baseId}-d${i}`}
                frac={frac}
                water={waterColor}
                deep={isNeon ? accentBright : accentDeep}
                outline={outlineColor}
                glow={fillGlow}
              />
            );
          })}
        </div>
        <div className="flex items-baseline gap-1.5">
          {bigEl}
          {subEl}
        </div>
      </>
    );
  } else {
    // ─── bottle: animated wave-filling bottle ───
    const W = 120;
    const H = 200;
    const fillTop = 46;
    const fillBottom = 200;
    const waterY = fillBottom - (pct / 100) * (fillBottom - fillTop);

    const bottlePath = `
      M 50 16 L 50 30
      C 50 40, 28 42, 28 64
      L 28 184 Q 28 200, 44 200
      L 76 200 Q 92 200, 92 184
      L 92 64 C 92 42, 70 40, 70 30
      L 70 16 Z`;

    const waveW = 240;
    const waveBack = wavePath(waveW, 4, 40, 220);
    const waveFront = wavePath(waveW, 3, 60, 220);

    visual = (
      <>
        {labelEl}
        <svg
          width={W * 0.85}
          height={H * 0.85}
          viewBox={`0 0 ${W} ${H}`}
          style={{ overflow: "visible", filter: fillGlow }}
        >
          <defs>
            <clipPath id={`${baseId}-clip`}>
              <path d={bottlePath} />
            </clipPath>
          </defs>

          <path d={bottlePath} fill={isNeon ? `${accent}14` : track} opacity={isNeon ? 1 : 0.35} />

          <g clipPath={`url(#${baseId}-clip)`}>
            {pct > 0 && (
              <g style={{ transform: `translateY(${waterY}px)`, transition: "transform 0.7s cubic-bezier(.4,0,.2,1)" }}>
                <g style={{ animation: "water-wave-a 6s linear infinite" }}>
                  <path d={waveBack} fill={isNeon ? accentDeep : accent} opacity={0.9} />
                </g>
                <g style={{ animation: "water-wave-b 4s linear infinite" }}>
                  <path d={waveFront} fill={accentBright} opacity={0.45} />
                </g>
              </g>
            )}
          </g>

          <path
            d={bottlePath}
            fill="none"
            stroke={isNeon ? accent : borderStrong}
            strokeWidth={isNeon ? 2.5 : 3}
            strokeLinejoin="round"
          />
          <rect
            x={46}
            y={2}
            width={28}
            height={14}
            rx={4}
            fill={isNeon ? "none" : track}
            stroke={isNeon ? accent : borderStrong}
            strokeWidth={isNeon ? 2.5 : 3}
          />
        </svg>
        <div className="flex flex-col items-center" style={{ gap: 2 }}>
          {bigEl}
          {subEl}
        </div>
      </>
    );
  }

  return (
    <WidgetShell params={params}>
      {waveKeyframes}
      <div className="flex flex-col items-center" style={{ padding: "10px 18px", gap: 14 }}>
        <div className="flex flex-col items-center" style={{ gap: params.variant === "bottle" ? 10 : 14 }}>
          {visual}
        </div>
        {controlsEl}
      </div>
    </WidgetShell>
  );
}

function GlassIcon({
  id,
  frac,
  water,
  deep,
  outline,
  glow,
}: {
  id: string;
  frac: number;
  water: string;
  deep: string;
  outline: string;
  glow?: string;
}) {
  const W = 30;
  const H = 38;
  const path = `M 6 3 L 24 3 L 21 35 L 9 35 Z`;
  const fillTop = 3;
  const fillBottom = 35;
  const waterY = fillBottom - frac * (fillBottom - fillTop);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", filter: frac > 0 ? glow : undefined }}>
      <defs>
        <clipPath id={id}>
          <path d={path} />
        </clipPath>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={water} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      {frac > 0 && (
        <g clipPath={`url(#${id})`}>
          <rect x={0} y={waterY} width={W} height={H} fill={`url(#${id}-grad)`} />
        </g>
      )}
      <path d={path} fill="none" stroke={frac >= 1 ? water : outline} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

function DropletIcon({
  id,
  frac,
  water,
  deep,
  outline,
  glow,
}: {
  id: string;
  frac: number;
  water: string;
  deep: string;
  outline: string;
  glow?: string;
}) {
  const W = 28;
  const H = 34;
  const path = `M 14 2 C 14 2, 25 16, 25 22 A 11 11 0 1 1 3 22 C 3 16, 14 2, 14 2 Z`;
  const fillTop = 2;
  const fillBottom = 33;
  const waterY = fillBottom - frac * (fillBottom - fillTop);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", filter: frac > 0 ? glow : undefined }}>
      <defs>
        <clipPath id={id}>
          <path d={path} />
        </clipPath>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={water} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      {frac > 0 && (
        <g clipPath={`url(#${id})`}>
          <rect x={0} y={waterY} width={W} height={H} fill={`url(#${id}-grad)`} />
        </g>
      )}
      <path d={path} fill="none" stroke={frac >= 1 ? water : outline} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}
