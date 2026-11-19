"use client";

import type { ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ZenGardenParams } from "./schema";

interface Stone {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rings: number;
}

const W = 300;
const H = 240;
const PAD = 10;

function getStones(count: number): Stone[] {
  const three: Stone[] = [
    { cx: 150, cy: 126, rx: 27, ry: 21, rings: 6 },
    { cx: 214, cy: 176, rx: 16, ry: 13, rings: 3 },
    { cx: 92, cy: 184, rx: 13, ry: 11, rings: 2 },
  ];
  const two: Stone[] = [
    { cx: 134, cy: 120, rx: 28, ry: 22, rings: 7 },
    { cx: 206, cy: 170, rx: 18, ry: 14, rings: 3 },
  ];
  return count === 2 ? two : three;
}

/** A gentle wavy horizontal rake line as an SVG path string. */
function wavyLine(y: number, amp: number, phase: number): string {
  const segs = 6;
  const startX = PAD + 4;
  const endX = W - PAD - 4;
  const step = (endX - startX) / segs;
  let d = `M ${startX} ${y + Math.sin(phase) * amp}`;
  for (let i = 1; i <= segs; i++) {
    const x = startX + step * i;
    const yy = y + Math.sin(phase + i * 1.05) * amp;
    const cx = x - step / 2;
    const cy = y + Math.sin(phase + (i - 0.5) * 1.05) * amp;
    d += ` Q ${cx} ${cy} ${x} ${yy}`;
  }
  return d;
}

function Scene({
  params,
  accent,
  accentBright,
  sand,
  stoneFill,
  shadow,
  neon,
  showSand,
}: {
  params: ZenGardenParams;
  accent: string;
  accentBright: string;
  sand: string;
  stoneFill: string;
  shadow: string;
  neon: boolean;
  showSand: boolean;
}) {
  const stones = getStones(params.stones === "2" ? 2 : 3);
  const clipId = "zg-clip";
  const glowId = "zg-glow";

  const ripples: ReactNode[] = [];
  if (params.variant === "circular") {
    stones.forEach((s, si) => {
      const gap = 9;
      for (let i = 1; i <= s.rings; i++) {
        const t = i / (s.rings + 1);
        ripples.push(
          <ellipse
            key={`r-${si}-${i}`}
            cx={s.cx}
            cy={s.cy}
            rx={s.rx + 3 + i * gap}
            ry={s.ry + 3 + i * gap}
            fill="none"
            stroke={accent}
            strokeWidth={1.4}
            opacity={0.5 * (1 - t) + 0.08}
            style={neon ? { filter: `drop-shadow(0 0 3px ${accent})` } : undefined}
          />,
        );
      }
    });
  } else {
    // linear: parallel wavy rake lines across the whole tray
    let idx = 0;
    for (let y = 26; y <= H - 20; y += 19) {
      const amp = 3 + (idx % 3);
      ripples.push(
        <path
          key={`l-${y}`}
          d={wavyLine(y, amp, idx * 0.6)}
          fill="none"
          stroke={accent}
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.3}
          style={neon ? { filter: `drop-shadow(0 0 3px ${accent})` } : undefined}
        />,
      );
      idx++;
    }
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ maxWidth: 340, display: "block" }}
      role="img"
      aria-label="Zen garden"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} rx={18} />
        </clipPath>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sand tray — only for minimal; soft/glass use the WidgetShell card as
          the tray, and neon floats glowing rings on the dark background. */}
      {showSand && (
        <>
          <rect
            x={PAD}
            y={PAD}
            width={W - PAD * 2}
            height={H - PAD * 2}
            rx={18}
            fill={sand}
          />
          <rect
            x={PAD}
            y={PAD}
            width={W - PAD * 2}
            height={H - PAD * 2}
            rx={18}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            opacity={0.18}
          />
        </>
      )}

      <g clipPath={`url(#${clipId})`}>
        {ripples}

        {/* Stones (drawn on top of ripples) */}
        {stones.map((s, i) => (
          <g key={`s-${i}`}>
            {/* soft shadow */}
            <ellipse
              cx={s.cx + 2}
              cy={s.cy + 4}
              rx={s.rx}
              ry={s.ry}
              fill={shadow}
              opacity={neon ? 0 : 0.5}
              style={{ filter: "blur(3px)" }}
            />
            {/* halo to break rake lines around the stone (sand-filled, so only
                meaningful when the sand tray is painted) */}
            {showSand && (
              <ellipse
                cx={s.cx}
                cy={s.cy}
                rx={s.rx + 4}
                ry={s.ry + 4}
                fill={sand}
              />
            )}
            {/* stone body */}
            <ellipse
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill={neon ? "none" : stoneFill}
              stroke={accent}
              strokeWidth={neon ? 1.8 : 1.2}
              opacity={neon ? 1 : 0.95}
              style={neon ? { filter: `url(#${glowId})` } : undefined}
            />
            {/* subtle top highlight */}
            <ellipse
              cx={s.cx - s.rx * 0.28}
              cy={s.cy - s.ry * 0.35}
              rx={s.rx * 0.42}
              ry={s.ry * 0.32}
              fill={accentBright}
              opacity={neon ? 0.5 : 0.2}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function ZenGardenWidget({ params }: { params: ZenGardenParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const style = params.style || "minimal";
  const neon = style === "neon";
  // Minimal paints its own warm sand tray; soft/glass reuse the WidgetShell
  // card as the tray so each style stays visually distinct.
  const showSand = style === "minimal";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const sand = mode === "dark" ? `#${colors.inset}` : `#${colors.bgSoft}`;
  const stoneFill = `#${colors.borderStrong}`;
  const shadow = "rgba(0,0,0,0.35)";

  return (
    <WidgetShell params={params}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: showSand ? 8 : 0,
        }}
      >
        <Scene
          params={params}
          accent={accent}
          accentBright={accentBright}
          sand={sand}
          stoneFill={stoneFill}
          shadow={shadow}
          neon={neon}
          showSand={showSand}
        />
      </div>
    </WidgetShell>
  );
}
