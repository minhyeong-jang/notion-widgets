"use client";

import { useId } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { LavaLampParams } from "./schema";

const SPEED_FACTOR: Record<LavaLampParams["speed"], number> = {
  slow: 1.7,
  normal: 1,
  fast: 0.6,
};

interface Blob {
  cx: number;
  r: number;
  /** vertical travel in user units (negative = upward) */
  travel: number;
  /** base cycle duration in seconds (scaled by speed) */
  dur: number;
  /** phase offset as a fraction of dur */
  phase: number;
}

// Deterministic blob layouts — no Math.random, so SSR and client agree.
const LAMP_BLOBS: Blob[] = [
  { cx: 100, r: 21, travel: -150, dur: 13, phase: 0 },
  { cx: 86, r: 15, travel: -120, dur: 10, phase: 0.35 },
  { cx: 116, r: 17, travel: -135, dur: 15, phase: 0.6 },
  { cx: 100, r: 12, travel: -100, dur: 9, phase: 0.15 },
  { cx: 92, r: 13, travel: -90, dur: 11, phase: 0.8 },
];

const AMBIENT_BLOBS: Blob[] = [
  { cx: 60, r: 34, travel: -70, dur: 14, phase: 0 },
  { cx: 150, r: 42, travel: -90, dur: 18, phase: 0.4 },
  { cx: 240, r: 30, travel: -60, dur: 12, phase: 0.7 },
  { cx: 110, r: 24, travel: -80, dur: 16, phase: 0.2 },
  { cx: 205, r: 26, travel: -72, dur: 13, phase: 0.9 },
  { cx: 280, r: 22, travel: -58, dur: 11, phase: 0.55 },
];

export function LavaLampWidget({ params }: { params: LavaLampParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const reactId = useId().replace(/[:]/g, "");

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const accentDim = `#${colors.accentDim}`;
  const surface2 = `#${colors.surface2}`;
  const inset = `#${colors.inset}`;
  const borderStrong = `#${colors.borderStrong}`;
  const textFaint = `#${colors.textFaint}`;
  const bgSoft = `#${colors.bgSoft}`;

  const isNeon = params.style === "neon";
  const isDark = mode === "dark";
  const speed = SPEED_FACTOR[params.speed];

  const gooId = `goo-${reactId}`;
  const clipId = `clip-${reactId}`;
  const fluidId = `fluid-${reactId}`;
  const blobGradId = `blob-${reactId}`;
  const metalId = `metal-${reactId}`;
  const animPrefix = `lava-${reactId}`;

  // Stronger alpha-threshold + blur in neon for a bloomier merge.
  const blur = isNeon ? 9 : 7;
  const sharpen = isNeon ? 20 : 17;

  const blobs = params.variant === "lamp" ? LAMP_BLOBS : AMBIENT_BLOBS;

  const keyframes = blobs
    .map(
      (b, i) => `@keyframes ${animPrefix}-${i} {
        0%   { transform: translateY(0) scale(1); }
        50%  { transform: translateY(${b.travel}px) scale(1.12); }
        100% { transform: translateY(0) scale(1); }
      }`,
    )
    .join("\n");

  const blobGlow = isNeon ? `drop-shadow(0 0 6px ${accentBright})` : undefined;

  const renderBlobs = () => (
    <g filter={`url(#${gooId})`}>
      {blobs.map((b, i) => {
        // y is placed near the bottom of the travel so motion reads as "rising".
        const baseY = params.variant === "lamp" ? 250 - i * 6 : 190 - (i % 2) * 24;
        return (
          <circle
            key={i}
            cx={b.cx}
            cy={baseY}
            r={b.r}
            fill={`url(#${blobGradId})`}
            style={{
              animation: `${animPrefix}-${i} ${(b.dur * speed).toFixed(2)}s ease-in-out ${(
                -b.phase *
                b.dur *
                speed
              ).toFixed(2)}s infinite`,
              transformOrigin: `${b.cx}px ${baseY}px`,
              filter: blobGlow,
            }}
          />
        );
      })}
    </g>
  );

  const defs = (
    <defs>
      <filter id={gooId} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${sharpen} -8`}
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
      <radialGradient id={blobGradId} cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor={isNeon ? accentBright : accentBright} />
        <stop offset="55%" stopColor={accent} />
        <stop offset="100%" stopColor={accentDeep} />
      </radialGradient>
      <linearGradient id={fluidId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={isNeon || isDark ? inset : surface2} />
        <stop offset="100%" stopColor={isNeon ? "#000000" : isDark ? inset : bgSoft} />
      </linearGradient>
      <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={borderStrong} />
        <stop offset="45%" stopColor={textFaint} />
        <stop offset="100%" stopColor={borderStrong} />
      </linearGradient>
    </defs>
  );

  let graphic: React.ReactNode;

  if (params.variant === "ambient") {
    const W = 320;
    const H = 220;
    graphic = (
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ maxWidth: 360, display: "block", borderRadius: 18 }}
        role="img"
        aria-label="Lava lamp ambient animation"
      >
        {defs}
        <clipPath id={clipId}>
          <rect x="0" y="0" width={W} height={H} rx="18" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width={W} height={H} fill={`url(#${fluidId})`} />
          {renderBlobs()}
          {/* subtle top sheen */}
          <rect x="0" y="0" width={W} height={H / 2} fill="#ffffff" opacity={isDark ? 0.03 : 0.12} />
        </g>
        {!isNeon && (
          <rect
            x="0.5"
            y="0.5"
            width={W - 1}
            height={H - 1}
            rx="18"
            fill="none"
            stroke={borderStrong}
            strokeOpacity={isDark ? 0.5 : 0.7}
          />
        )}
      </svg>
    );
  } else {
    // lamp bottle
    const vessel = "M68,72 L132,72 L151,250 Q151,263 138,263 L62,263 Q49,263 49,250 Z";
    graphic = (
      <svg
        width="100%"
        viewBox="0 0 200 320"
        style={{ maxWidth: 190, display: "block", filter: isNeon ? `drop-shadow(0 0 22px ${accent}66)` : undefined }}
        role="img"
        aria-label="Lava lamp animation"
      >
        {defs}
        <clipPath id={clipId}>
          <path d={vessel} />
        </clipPath>

        {/* metal base */}
        <path d="M60,262 L140,262 L162,304 Q164,310 158,310 L42,310 Q36,310 38,304 Z" fill={`url(#${metalId})`} />
        <rect x="52" y="300" width="96" height="8" rx="4" fill={borderStrong} />

        {/* glass interior + blobs (clipped) */}
        <g clipPath={`url(#${clipId})`}>
          <path d={vessel} fill={`url(#${fluidId})`} />
          {renderBlobs()}
          {/* left-side glass highlight */}
          <path
            d="M70,80 L60,250"
            stroke="#ffffff"
            strokeOpacity={isDark ? 0.08 : 0.35}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        {/* glass rim */}
        <path d={vessel} fill="none" stroke={borderStrong} strokeOpacity={isDark ? 0.6 : 0.8} strokeWidth="2" />

        {/* metal cap + knob */}
        <path d="M68,72 L132,72 L124,48 Q123,44 118,44 L82,44 Q77,44 76,48 Z" fill={`url(#${metalId})`} />
        <rect x="90" y="34" width="20" height="12" rx="3" fill={textFaint} />
      </svg>
    );
  }

  return (
    <WidgetShell params={params}>
      <style>{keyframes}</style>
      <div className="flex items-center justify-center" style={{ padding: "8px 14px", width: "100%" }}>
        {graphic}
      </div>
    </WidgetShell>
  );
}
