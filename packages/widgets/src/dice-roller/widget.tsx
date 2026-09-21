"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { DiceRollerParams } from "./schema";
import { PIP_LAYOUT, getDiceStrings } from "./dice";

/* ─────────────────────────── config ─────────────────────────── */

interface VariantConfig {
  count: number;
  sides: number;
  initial: number[];
}

const VARIANTS: Record<string, VariantConfig> = {
  single: { count: 1, sides: 6, initial: [6] },
  double: { count: 2, sides: 6, initial: [6, 5] },
  d20: { count: 1, sides: 20, initial: [20] },
};

function randInt(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ─────────────────────────── component ─────────────────────────── */

export function DiceRollerWidget({ params }: { params: DiceRollerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";
  const t = getDiceStrings(params.locale);

  const cfg = VARIANTS[params.variant] ?? VARIANTS.double;
  const storageKey = `nw:dice-roller:${params.variant}`;

  // Deterministic initial value keeps SSR and first client paint identical.
  const [dice, setDice] = useState<number[]>(cfg.initial);
  const [rolling, setRolling] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync last roll from localStorage after mount (hydration-safe).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as number[];
        if (Array.isArray(parsed) && parsed.length === cfg.count) {
          setDice(parsed.map((n) => Math.max(1, Math.min(cfg.sides, Math.round(n)))));
        }
      }
    } catch {
      // localStorage unavailable — keep the deterministic default.
    }
    setHydrated(true);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [storageKey, cfg.count, cfg.sides]);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    const shuffle = () => setDice(Array.from({ length: cfg.count }, () => randInt(cfg.sides)));
    intervalRef.current = setInterval(shuffle, 70);
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const final = Array.from({ length: cfg.count }, () => randInt(cfg.sides));
      setDice(final);
      setRolling(false);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(final));
      } catch {
        // ignore write failures
      }
    }, 720);
  }, [rolling, cfg.count, cfg.sides, storageKey]);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const btnText = `#${colors.btnText}`;
  const surface2 = `#${colors.surface2}`;
  const borderStrong = `#${colors.borderStrong}`;
  const monoFont = isNeon ? "monospace" : undefined;

  const total = dice.reduce((a, b) => a + b, 0);
  const dieSize = params.variant === "double" ? 64 : 84;

  const diceEls = dice.map((v, i) => (
    <div
      key={i}
      className={`nw-die${rolling ? " rolling" : ""}`}
      style={{ animationDelay: `${i * 90}ms` }}
    >
      {cfg.sides === 20 ? (
        <D20Face
          value={v}
          size={dieSize + 6}
          accent={isNeon ? accentBright : accent}
          bg={isNeon ? "transparent" : surface2}
          border={isNeon ? accentBright : borderStrong}
          numberColor={isNeon ? accentBright : text}
          glow={isNeon}
        />
      ) : (
        <DieFace
          value={v}
          size={dieSize}
          pip={isNeon ? accentBright : accent}
          bg={isNeon ? "transparent" : surface2}
          border={isNeon ? accentBright : borderStrong}
          glow={isNeon}
        />
      )}
    </div>
  ));

  const rollBtnStyle: CSSProperties = isNeon
    ? {
        background: "transparent",
        color: accentBright,
        border: `1.5px solid ${accent}`,
        fontFamily: "monospace",
        letterSpacing: "1px",
        textShadow: `0 0 8px ${accentBright}`,
        boxShadow: `0 0 10px ${hexToRgba(accent, 0.33)}, inset 0 0 8px ${hexToRgba(accent, 0.13)}`,
      }
    : {
        background: accent,
        color: btnText,
        border: "none",
        boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
      };

  return (
    <WidgetShell params={params}>
      <style>{`
        .nw-die { display: inline-flex; transform-origin: center; }
        .nw-die.rolling { animation: nw-die-roll .48s ease-in-out infinite; }
        @keyframes nw-die-roll {
          0% { transform: rotate(-10deg) scale(1); }
          50% { transform: rotate(10deg) scale(1.07); }
          100% { transform: rotate(-10deg) scale(1); }
        }
        .nw-roll-btn { cursor: pointer; transition: transform .12s ease, filter .15s ease; }
        .nw-roll-btn:hover:not(:disabled) { filter: brightness(1.08); }
        .nw-roll-btn:active:not(:disabled) { transform: scale(0.95); }
        .nw-roll-btn:disabled { opacity: .65; cursor: default; }
      `}</style>
      <div className="flex flex-col items-center" style={{ padding: "16px 22px", gap: 16 }}>
        <div className="flex items-center justify-center" style={{ gap: 16, minHeight: dieSize + 10 }}>
          {diceEls}
        </div>

        {params.variant === "double" && (
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: isNeon ? "2px" : "0.1em",
                color: isNeon ? accentBright : textDim,
                fontFamily: monoFont,
              }}
            >
              {t.total}
            </span>
            <span
              className="tabular-nums"
              style={{
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1,
                color: isNeon ? accentBright : text,
                fontFamily: monoFont,
                textShadow: "var(--w-text-shadow)",
              }}
            >
              {total}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={roll}
          disabled={!hydrated || rolling}
          className="nw-roll-btn inline-flex items-center font-semibold"
          style={{
            ...rollBtnStyle,
            gap: 8,
            fontSize: 14,
            padding: "10px 22px",
            borderRadius: isNeon ? 4 : 12,
          }}
        >
          <DiceIcon color={isNeon ? accentBright : btnText} spinning={rolling} />
          {rolling ? t.rolling : t.roll}
        </button>
      </div>
    </WidgetShell>
  );
}

/* ─────────────────────────── faces ─────────────────────────── */

function DieFace({
  value,
  size,
  pip,
  bg,
  border,
  glow,
}: {
  value: number;
  size: number;
  pip: string;
  bg: string;
  border: string;
  glow: boolean;
}) {
  const positions = PIP_LAYOUT[value] ?? PIP_LAYOUT[1];
  const grid = [26, 50, 74];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <rect
        x={6}
        y={6}
        width={88}
        height={88}
        rx={20}
        fill={bg}
        stroke={border}
        strokeWidth={glow ? 2.5 : 2.5}
        style={glow ? { filter: `drop-shadow(0 0 6px ${border})` } : undefined}
      />
      {positions.map((p) => {
        const cx = grid[p % 3];
        const cy = grid[Math.floor(p / 3)];
        return (
          <circle
            key={p}
            cx={cx}
            cy={cy}
            r={8.5}
            fill={pip}
            style={glow ? { filter: `drop-shadow(0 0 4px ${pip})` } : undefined}
          />
        );
      })}
    </svg>
  );
}

function D20Face({
  value,
  size,
  accent,
  bg,
  border,
  numberColor,
  glow,
}: {
  value: number;
  size: number;
  accent: string;
  bg: string;
  border: string;
  numberColor: string;
  glow: boolean;
}) {
  // Pointy-top hexagon silhouette of a d20, with a faint inner triangle for depth.
  const hex = "50,3 91,26 91,74 50,97 9,74 9,26";
  const tri = "50,3 91,74 9,74";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <polygon
        points={hex}
        fill={bg === "transparent" ? hexToRgba(accent, 0.1) : bg}
        stroke={border}
        strokeWidth={2.5}
        strokeLinejoin="round"
        style={glow ? { filter: `drop-shadow(0 0 6px ${border})` } : undefined}
      />
      <polygon points={tri} fill="none" stroke={accent} strokeWidth={1.2} strokeLinejoin="round" opacity={0.4} />
      <text
        x={50}
        y={62}
        textAnchor="middle"
        fontSize={value >= 10 ? 34 : 38}
        fontWeight={700}
        fill={numberColor}
        style={{ fontFamily: "inherit", ...(glow ? { filter: `drop-shadow(0 0 4px ${numberColor})` } : {}) }}
      >
        {value}
      </text>
    </svg>
  );
}

function DiceIcon({ color, spinning }: { color: string; spinning: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={spinning ? { animation: "nw-die-roll .48s ease-in-out infinite" } : undefined}
    >
      <rect x={3} y={3} width={18} height={18} rx={4} stroke={color} strokeWidth={2} />
      <circle cx={8.5} cy={8.5} r={1.6} fill={color} />
      <circle cx={15.5} cy={15.5} r={1.6} fill={color} />
      <circle cx={15.5} cy={8.5} r={1.6} fill={color} />
      <circle cx={8.5} cy={15.5} r={1.6} fill={color} />
    </svg>
  );
}
