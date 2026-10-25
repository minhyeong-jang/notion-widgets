"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { AquariumParams } from "./schema";
import { SPEED_FACTOR } from "./schema";

const TANK_W = 330;
const TANK_H = 220;

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

type ColorKey = "accent" | "accentBright" | "accentDeep";

interface FishSpec {
  shape: "round" | "long";
  colorKey: ColorKey;
  size: number;
  top: number; // % of tank height
  dur: number; // seconds
  delay: number;
  dir: 1 | -1;
}

interface PlantSpec {
  x: number; // px from left
  h: number; // px
  delay: number;
  colorKey: ColorKey;
}

interface BubbleSpec {
  x: number; // % of width
  size: number;
  dur: number;
  delay: number;
}

interface Scene {
  fish: FishSpec[];
  plants: PlantSpec[];
  bubbles: BubbleSpec[];
  rays: boolean;
}

const SCENES: Record<AquariumParams["variant"], Scene> = {
  reef: {
    fish: [
      { shape: "round", colorKey: "accent", size: 42, top: 18, dur: 15, delay: 0, dir: 1 },
      { shape: "long", colorKey: "accentBright", size: 30, top: 40, dur: 19, delay: -7, dir: -1 },
      { shape: "round", colorKey: "accentDeep", size: 48, top: 58, dur: 24, delay: -12, dir: 1 },
      { shape: "long", colorKey: "accentBright", size: 24, top: 30, dur: 17, delay: -4, dir: -1 },
      { shape: "round", colorKey: "accent", size: 28, top: 70, dur: 21, delay: -15, dir: 1 },
    ],
    plants: [
      { x: 14, h: 76, delay: 0, colorKey: "accentDeep" },
      { x: 44, h: 54, delay: -1.6, colorKey: "accentDeep" },
      { x: TANK_W - 40, h: 66, delay: -0.9, colorKey: "accentDeep" },
    ],
    bubbles: [
      { x: 20, size: 6, dur: 7, delay: 0 },
      { x: 32, size: 4, dur: 9, delay: -3 },
      { x: 55, size: 7, dur: 8, delay: -5 },
      { x: 68, size: 5, dur: 10, delay: -1.5 },
      { x: 82, size: 4, dur: 7.5, delay: -6 },
      { x: 90, size: 6, dur: 9.5, delay: -2.5 },
    ],
    rays: false,
  },
  deep: {
    fish: [
      { shape: "long", colorKey: "accentBright", size: 52, top: 28, dur: 26, delay: 0, dir: 1 },
      { shape: "round", colorKey: "accent", size: 40, top: 52, dur: 30, delay: -11, dir: -1 },
      { shape: "long", colorKey: "accentDeep", size: 34, top: 66, dur: 28, delay: -17, dir: 1 },
    ],
    plants: [{ x: TANK_W - 42, h: 70, delay: 0, colorKey: "accentDeep" }],
    bubbles: [
      { x: 24, size: 5, dur: 11, delay: 0 },
      { x: 60, size: 4, dur: 13, delay: -5 },
      { x: 84, size: 6, dur: 12, delay: -8 },
    ],
    rays: true,
  },
  calm: {
    fish: [
      { shape: "round", colorKey: "accent", size: 42, top: 34, dur: 20, delay: 0, dir: 1 },
      { shape: "long", colorKey: "accentBright", size: 30, top: 56, dur: 24, delay: -9, dir: -1 },
    ],
    plants: [{ x: 20, h: 60, delay: 0, colorKey: "accentDeep" }],
    bubbles: [
      { x: 30, size: 5, dur: 9, delay: 0 },
      { x: 72, size: 4, dur: 11, delay: -4 },
    ],
    rays: false,
  },
};

function Fish({
  shape,
  color,
  size,
  eye,
  glow,
}: {
  shape: "round" | "long";
  color: string;
  size: number;
  eye: string;
  glow?: string;
}) {
  const w = size;
  const h = size * 0.64;
  const bodyRy = shape === "long" ? 6.5 : 9;
  const filter = glow ? `drop-shadow(0 0 4px ${glow})` : undefined;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 44 28"
      style={{ display: "block", overflow: "visible", filter }}
      aria-hidden
    >
      {/* tail */}
      <path d="M3 14 L15 5 L15 23 Z" fill={color} opacity={0.88} />
      {/* top + bottom fins */}
      <path d="M22 7 Q27 0 33 8 Z" fill={color} opacity={0.75} />
      <path d="M22 21 Q27 28 33 20 Z" fill={color} opacity={0.75} />
      {/* body */}
      <ellipse cx="26" cy="14" rx="15.5" ry={bodyRy} fill={color} />
      {/* eye */}
      <circle cx="36.5" cy="12.6" r="1.7" fill={eye} />
    </svg>
  );
}

function Seaweed({ color, h, delay }: { color: string; h: number; delay: number }) {
  // Two offset blades swaying from their base.
  return (
    <svg width={22} height={h} viewBox={`0 0 22 ${h}`} style={{ display: "block", overflow: "visible" }} aria-hidden>
      <path
        d={`M8 ${h} C2 ${h * 0.7} 16 ${h * 0.55} 9 ${h * 0.3} C4 ${h * 0.12} 11 2 10 0`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        style={{ transformOrigin: `8px ${h}px`, animation: `nw-aq-sway 4.5s ease-in-out ${delay}s infinite` }}
      />
      <path
        d={`M15 ${h} C20 ${h * 0.72} 9 ${h * 0.5} 15 ${h * 0.28} C19 ${h * 0.12} 13 4 14 0`}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.7}
        style={{ transformOrigin: `15px ${h}px`, animation: `nw-aq-sway 5.5s ease-in-out ${delay - 1}s infinite` }}
      />
    </svg>
  );
}

export function AquariumWidget({ params }: { params: AquariumParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";
  const isSoft = params.style === "soft";
  const isGlass = params.style === "glass";

  const scene = SCENES[params.variant];
  const sf = SPEED_FACTOR[params.speed];

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const colorFor = (k: ColorKey) => `#${colors[k]}`;

  const isDeep = params.variant === "deep";

  // Water — always derived from the accent palette over a neutral base.
  const waterBase = isDark ? `#${colors.inset}` : `#${colors.bgSoft}`;
  const topA = (isDark ? 0.34 : 0.28) + (isDeep ? -0.04 : 0);
  const midA = isDark ? (isDeep ? 0.26 : 0.18) : isDeep ? 0.16 : 0.12;
  const botA = isDark ? (isDeep ? 0.42 : 0.3) : isDeep ? 0.24 : 0.16;
  const water = `linear-gradient(180deg, ${hexToRgba(accent, topA)} 0%, ${hexToRgba(accentDeep, midA)} 52%, ${hexToRgba(accentDeep, botA)} 100%), ${waterBase}`;

  const eyeColor = isDark ? `#${colors.inset}` : `#${colors.bg}`;
  const fishGlow = isNeon ? hexToRgba(`#${colors.accentBright}`, 0.9) : undefined;
  const fishOpacity = isNeon ? 1 : isDark ? 0.94 : 0.9;

  // Tank frame per style.
  const frame: CSSProperties = {
    position: "relative",
    width: TANK_W,
    height: TANK_H,
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: isNeon ? 8 : 18,
  };
  if (isNeon) {
    frame.border = `1.5px solid ${accentBright}`;
    frame.boxShadow = `0 0 24px ${hexToRgba(accentBright, 0.5)}, inset 0 0 22px ${hexToRgba(accentBright, 0.14)}`;
  } else if (isGlass) {
    frame.border = `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)"}`;
    frame.boxShadow = `0 12px 34px rgba(0,0,0,${isDark ? 0.4 : 0.18})`;
  } else if (isSoft) {
    frame.border = `1px solid ${hexToRgba(accent, isDark ? 0.22 : 0.16)}`;
    frame.boxShadow = `0 12px 34px rgba(0,0,0,${isDark ? 0.4 : 0.14})`;
  } else {
    frame.border = `1px solid ${hexToRgba(accent, isDark ? 0.28 : 0.2)}`;
  }

  const floorColor = hexToRgba(accentDeep, isDark ? 0.5 : 0.32);

  const keyframes = `
    @keyframes nw-aq-swimR { from { left: -22%; } to { left: 118%; } }
    @keyframes nw-aq-swimL { from { left: 118%; } to { left: -22%; } }
    @keyframes nw-aq-bob { 0%,100% { transform: translateY(-3px); } 50% { transform: translateY(3px); } }
    @keyframes nw-aq-rise {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      12% { opacity: 0.7; }
      88% { opacity: 0.45; }
      100% { transform: translateY(-${TANK_H - 14}px) translateX(6px); opacity: 0; }
    }
    @keyframes nw-aq-sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
    @keyframes nw-aq-ray { 0%,100% { opacity: 0.10; } 50% { opacity: 0.22; } }
    @media (prefers-reduced-motion: reduce) {
      .nw-aq-track, .nw-aq-bob, .nw-aq-bub, .nw-aq-ray, .nw-aq-blade { animation: none !important; }
    }
  `;

  return (
    <WidgetShell params={params} bare>
      <style>{keyframes}</style>
      <div style={frame}>
        {/* water */}
        <div style={{ position: "absolute", inset: 0, background: water }} />

        {/* light rays (deep) */}
        {scene.rays && (
          <>
            <div
              className="nw-aq-ray"
              style={{
                position: "absolute",
                top: -20,
                left: "22%",
                width: 60,
                height: TANK_H + 40,
                background: `linear-gradient(180deg, ${hexToRgba(accentBright, 0.5)}, transparent)`,
                transform: "rotate(14deg)",
                filter: "blur(6px)",
                animation: `nw-aq-ray ${7 * sf}s ease-in-out infinite`,
              }}
            />
            <div
              className="nw-aq-ray"
              style={{
                position: "absolute",
                top: -20,
                left: "58%",
                width: 44,
                height: TANK_H + 40,
                background: `linear-gradient(180deg, ${hexToRgba(accentBright, 0.4)}, transparent)`,
                transform: "rotate(14deg)",
                filter: "blur(6px)",
                animation: `nw-aq-ray ${9 * sf}s ease-in-out -2s infinite`,
              }}
            />
          </>
        )}

        {/* plants */}
        {scene.plants.map((p, i) => (
          <div key={`p-${i}`} style={{ position: "absolute", bottom: 10, left: p.x }}>
            <Seaweed color={colorFor(p.colorKey)} h={p.h} delay={p.delay} />
          </div>
        ))}

        {/* floor */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 30,
            background: `linear-gradient(180deg, transparent, ${floorColor})`,
          }}
        />

        {/* fish */}
        {scene.fish.map((f, i) => (
          <div
            key={`f-${i}`}
            className="nw-aq-track"
            style={{
              position: "absolute",
              top: `${f.top}%`,
              animation: `${f.dir === 1 ? "nw-aq-swimR" : "nw-aq-swimL"} ${f.dur * sf}s linear ${f.delay * sf}s infinite`,
            }}
          >
            <div style={{ transform: `scaleX(${f.dir})` }}>
              <div
                className="nw-aq-bob"
                style={{ animation: `nw-aq-bob ${(3 + (i % 3) * 0.6) * sf}s ease-in-out ${-i * 0.4}s infinite`, opacity: fishOpacity }}
              >
                <Fish shape={f.shape} color={colorFor(f.colorKey)} size={f.size} eye={eyeColor} glow={fishGlow} />
              </div>
            </div>
          </div>
        ))}

        {/* bubbles */}
        {params.bubbles &&
          scene.bubbles.map((b, i) => (
            <div
              key={`b-${i}`}
              className="nw-aq-bub"
              style={{
                position: "absolute",
                bottom: 10,
                left: `${b.x}%`,
                width: b.size,
                height: b.size,
                borderRadius: "50%",
                background: hexToRgba(accentBright, isDark ? 0.5 : 0.45),
                border: `1px solid ${hexToRgba(accentBright, 0.7)}`,
                animation: `nw-aq-rise ${b.dur * sf}s linear ${b.delay * sf}s infinite`,
              }}
            />
          ))}

        {/* neon scanlines */}
        {isNeon && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `repeating-linear-gradient(0deg, ${hexToRgba(accentBright, 0.06)} 0px, ${hexToRgba(accentBright, 0.06)} 1px, transparent 1px, transparent 4px)`,
            }}
          />
        )}

        {/* glass reflection */}
        {isGlass && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `linear-gradient(125deg, ${isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.4)"} 0%, transparent 34%, transparent 72%, ${isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.18)"} 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "16%",
                width: 10,
                pointerEvents: "none",
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.35)",
                filter: "blur(4px)",
              }}
            />
          </>
        )}

        {/* top water surface highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            pointerEvents: "none",
            background: `linear-gradient(180deg, ${hexToRgba(accentBright, isDark ? 0.3 : 0.35)}, transparent)`,
          }}
        />
      </div>
    </WidgetShell>
  );
}
