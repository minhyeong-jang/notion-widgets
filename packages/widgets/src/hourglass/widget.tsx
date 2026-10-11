"use client";

import { useEffect, useRef, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { HourglassParams } from "./schema";

interface Geometry {
  /** Top sand surface line (empty top bulb). */
  topY: number;
  /** Neck centre. */
  midY: number;
  /** Bottom sand floor (full bottom bulb). */
  botY: number;
  /** Glass interior outline (clip + stroke). */
  interior: string;
  /** Vertical stand posts. */
  postL: number;
  postR: number;
  /** End-cap bar span. */
  capL: number;
  capR: number;
  capTopTop: number;
  capTopBot: number;
  capBotTop: number;
  capBotBot: number;
}

const GEO: Record<string, Geometry> = {
  classic: {
    topY: 16,
    midY: 75,
    botY: 134,
    interior: "M20,16 L80,16 L53,75 L80,134 L20,134 L47,75 Z",
    postL: 15,
    postR: 85,
    capL: 15,
    capR: 85,
    capTopTop: 9,
    capTopBot: 16,
    capBotTop: 134,
    capBotBot: 141,
  },
  curved: {
    topY: 16,
    midY: 75,
    botY: 134,
    interior:
      "M22,16 L78,16 C78,42 58,60 52,73 C58,88 78,108 78,134 L22,134 C22,108 42,88 48,77 C42,60 22,42 22,16 Z",
    postL: 16,
    postR: 84,
    capL: 16,
    capR: 84,
    capTopTop: 9,
    capTopBot: 16,
    capBotTop: 134,
    capBotBot: 141,
  },
  slim: {
    topY: 14,
    midY: 75,
    botY: 136,
    interior: "M32,14 L68,14 L53,75 L68,136 L32,136 L47,75 Z",
    postL: 27,
    postR: 73,
    capL: 27,
    capR: 73,
    capTopTop: 7,
    capTopBot: 14,
    capBotTop: 136,
    capBotBot: 143,
  },
};

function useHourglass(durationSec: number, loop: boolean, enabled: boolean) {
  const [p, setP] = useState(0);
  const [flips, setFlips] = useState(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const flipsRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    flipsRef.current = 0;
    setFlips(0);
    setP(0);
    startRef.current = performance.now();

    const tick = (t: number) => {
      const elapsed = (t - startRef.current) / 1000;
      let prog = elapsed / durationSec;

      if (prog >= 1) {
        if (loop) {
          const whole = Math.floor(prog);
          flipsRef.current += whole;
          setFlips(flipsRef.current);
          // Carry the remainder so cycles stay in phase.
          startRef.current = t - (elapsed - whole * durationSec) * 1000;
          prog -= whole;
        } else {
          setP(1);
          return;
        }
      }
      setP(prog);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationSec, loop, enabled]);

  return { p, flips };
}

function fmt(totalSec: number): string {
  const s = Math.max(0, Math.ceil(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function HourglassWidget({ params }: { params: HourglassParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const durationSec = Number(params.duration);
  const isStatic = params.seek !== undefined;
  const anim = useHourglass(durationSec, params.loop, !isStatic);

  const p = isStatic ? (params.seek as number) : anim.p;
  const flips = isStatic ? 0 : anim.flips;
  const flipped = flips % 2 === 1;

  const g = GEO[params.variant] ?? GEO.classic;
  const { topY, midY, botY } = g;

  const isNeon = params.style === "neon";
  const isDark = mode === "dark";
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  // Frame + stand colours: derived, never hardcoded.
  const frameColor = isNeon ? accent : textFaint;
  const capColor = isNeon ? accentBright : textDim;
  // Subtle "empty glass" body tint.
  const glassFill = isNeon
    ? `${accent}14`
    : isDark
      ? "rgba(255,255,255,0.045)"
      : "rgba(0,0,0,0.035)";

  // ── Sand surfaces (SVG coords) ──
  // Both bulbs share one expression; only the filled region differs by flip.
  const topSurface = flipped
    ? midY - (midY - topY) * p // top bulb fills from the neck up
    : topY + (midY - topY) * p; // top bulb drains down toward the neck
  const botSurface = botY - (botY - midY) * p;

  const topSandY = topSurface;
  const topSandH = Math.max(0, midY - topSurface);
  // !flipped → pile rests on the bottom floor; flipped → sand clings to the neck.
  const botSandY = flipped ? midY : botSurface;
  const botSandH = flipped
    ? Math.max(0, botSurface - midY)
    : Math.max(0, botY - botSurface);

  const streaming = p > 0.001 && p < 0.999;

  const uid = `${params.variant}-${params.accent}-${mode}`;
  const clipId = `hg-clip-${uid}`;
  const gradId = `hg-grad-${uid}`;

  const remaining = durationSec * (1 - p);

  const sandFilter = isNeon ? `drop-shadow(0 0 5px ${accentBright})` : undefined;
  const frameFilter = isNeon ? `drop-shadow(0 0 4px ${accent})` : undefined;

  const svg = (
    <svg
      viewBox="0 0 100 150"
      width={params.variant === "slim" ? 128 : 150}
      height={params.variant === "slim" ? 236 : 225}
      role="img"
      aria-label="Hourglass"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentBright} />
          <stop offset="55%" stopColor={accent} />
          <stop offset="100%" stopColor={accentDeep} />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={g.interior} />
        </clipPath>
      </defs>

      {/* Stand: posts + end caps */}
      <g style={{ filter: frameFilter }}>
        <rect
          x={g.postL - 1.5}
          y={g.capTopTop}
          width={3}
          height={g.capBotBot - g.capTopTop}
          rx={1.5}
          fill={capColor}
        />
        <rect
          x={g.postR - 1.5}
          y={g.capTopTop}
          width={3}
          height={g.capBotBot - g.capTopTop}
          rx={1.5}
          fill={capColor}
        />
        <rect
          x={g.capL - 2}
          y={g.capTopTop}
          width={g.capR - g.capL + 4}
          height={g.capTopBot - g.capTopTop}
          rx={2}
          fill={capColor}
        />
        <rect
          x={g.capL - 2}
          y={g.capBotTop}
          width={g.capR - g.capL + 4}
          height={g.capBotBot - g.capBotTop}
          rx={2}
          fill={capColor}
        />
      </g>

      {/* Glass body tint */}
      <path d={g.interior} fill={glassFill} />

      {/* Sand (clipped to the glass interior) */}
      <g clipPath={`url(#${clipId})`} style={{ filter: sandFilter }}>
        {topSandH > 0.2 && (
          <rect x={0} y={topSandY} width={100} height={topSandH + 0.5} fill={`url(#${gradId})`} />
        )}
        {botSandH > 0.2 && (
          <rect x={0} y={botSandY} width={100} height={botSandH + 0.5} fill={`url(#${gradId})`} />
        )}
        {/* Soft rounded pile on the floor the sand is settling onto */}
        {!flipped && botSandH > 0.2 && (
          <ellipse cx={50} cy={botSandY} rx={22} ry={4} fill={accentBright} opacity={0.55} />
        )}
        {/* Falling stream through the neck */}
        {streaming && (
          <rect
            x={49}
            y={flipped ? midY - 24 : midY - 22}
            width={2}
            height={flipped ? 24 : 46}
            fill={accentBright}
            className="hg-stream"
          />
        )}
      </g>

      {/* Glass outline on top */}
      <path
        d={g.interior}
        fill="none"
        stroke={frameColor}
        strokeWidth={isNeon ? 1.6 : 2}
        strokeLinejoin="round"
        style={{ filter: frameFilter }}
        opacity={isNeon ? 1 : 0.85}
      />
    </svg>
  );

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes hg-fall { 0% { opacity: .35 } 50% { opacity: 1 } 100% { opacity: .35 } }
        .hg-stream { animation: hg-fall 0.7s ease-in-out infinite; }
      `}</style>
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          style={{
            transform: `rotate(${flips * 180}deg)`,
            transformOrigin: "center center",
            transition: isStatic ? undefined : "transform 0.7s ease-in-out",
          }}
        >
          {svg}
        </div>

        {params.showTime && (
          <div
            className="tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: isNeon ? "2px" : "0.02em",
              color: isNeon ? accentBright : text,
              fontFamily: isNeon ? "var(--font-geist-mono, 'Courier New', monospace)" : undefined,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {fmt(remaining)}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
