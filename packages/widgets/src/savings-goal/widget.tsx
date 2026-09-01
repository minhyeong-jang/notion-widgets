"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { useTracker } from "../use-tracker";
import { TrackerControls } from "../tracker-controls";
import { formatMoney, currencySymbol, type SavingsGoalParams } from "./schema";

type Str = {
  reset: string;
  reached: string;
  of: string;
  m25: string;
  m50: string;
  m75: string;
};

const STRINGS: Record<string, Str> = {
  en: { reset: "Reset", reached: "Goal reached! 🎉", of: "of", m25: "Off to a good start", m50: "Halfway there!", m75: "Almost there!" },
  ko: { reset: "초기화", reached: "목표 달성! 🎉", of: "목표", m25: "좋은 시작이에요", m50: "절반 달성!", m75: "거의 다 왔어요!" },
  ja: { reset: "リセット", reached: "目標達成！🎉", of: "目標", m25: "いいスタート", m50: "半分達成！", m75: "あと少し！" },
  zh: { reset: "重置", reached: "目标达成！🎉", of: "目标", m25: "好的开始", m50: "已过半！", m75: "就快到了！" },
  de: { reset: "Zurücksetzen", reached: "Ziel erreicht! 🎉", of: "von", m25: "Guter Start", m50: "Halb geschafft!", m75: "Fast am Ziel!" },
  fr: { reset: "Réinitialiser", reached: "Objectif atteint ! 🎉", of: "sur", m25: "Bon départ", m50: "À mi-chemin !", m75: "Presque au but !" },
  es: { reset: "Reiniciar", reached: "¡Meta alcanzada! 🎉", of: "de", m25: "Buen comienzo", m50: "¡A mitad de camino!", m75: "¡Casi lo logras!" },
};

function clampPct(saved: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, (saved / goal) * 100));
}

export function SavingsGoalWidget({ params }: { params: SavingsGoalParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  const storageKey = `nw:savings-goal:${(params.label || "savings").trim().toLowerCase()}`;
  const { count, hydrated, increment, reset } = useTracker({
    storageKey,
    period: params.period,
    step: params.deposit,
  });

  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  // ── Derived colours ──
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const borderColor = isDark ? `#${colors.borderStrong}` : `#${colors.border}`;

  const monoFont = isNeon ? "monospace" : undefined;
  const coinColor = isNeon ? accentBright : accent;
  const coinDeep = isNeon ? accent : accentDeep;

  const saved = count;
  const pct = clampPct(saved, params.goal);
  const pctRounded = Math.round(pct);
  const reached = saved >= params.goal;

  const fmt = (n: number) => formatMoney(n, params.currency, params.locale);
  const symbol = currencySymbol(params.currency, params.locale);
  const savedText = fmt(saved);
  const goalText = fmt(params.goal);
  const depositText = fmt(params.deposit);

  const milestone = reached
    ? ""
    : pct >= 75
      ? t.m75
      : pct >= 50
        ? t.m50
        : pct >= 25
          ? t.m25
          : "";

  const baseId = `sav-${params.accent}-${mode}-${params.variant}`;

  // Shared label chip.
  const labelEl = params.label ? (
    <div
      className="font-semibold"
      style={{
        fontSize: 12,
        color: isNeon ? accentBright : textDim,
        textShadow: "var(--w-text-shadow)",
        fontFamily: monoFont,
        letterSpacing: isNeon ? "1.5px" : "0.06em",
        textTransform: "uppercase",
      }}
    >
      {isNeon ? `> ${params.label}` : params.label}
    </div>
  ) : null;

  const percentEl = (
    <div
      className="font-bold tabular-nums"
      style={{
        fontSize: 12,
        color: isNeon ? accent : reached ? accent : textFaint,
        fontFamily: monoFont,
        opacity: isNeon ? 0.9 : 1,
      }}
    >
      {pctRounded}%
    </div>
  );

  const amountEl = (
    <div className="flex items-baseline" style={{ gap: 6 }}>
      <span
        className="font-bold tabular-nums leading-none"
        style={{
          fontSize: 26,
          color: isNeon ? accentBright : text,
          textShadow: "var(--w-text-shadow)",
          fontFamily: monoFont,
        }}
      >
        {savedText}
      </span>
      <span
        className="font-medium tabular-nums"
        style={{ fontSize: 12, color: isNeon ? accent : textFaint, fontFamily: monoFont, opacity: isNeon ? 0.75 : 1 }}
      >
        {t.of} {goalText}
      </span>
    </div>
  );

  const milestoneEl =
    milestone && !reached ? (
      <div
        className="font-medium"
        style={{ fontSize: 11, color: isNeon ? accentBright : textDim, fontFamily: monoFont, textShadow: "var(--w-text-shadow)" }}
      >
        {isNeon ? `// ${milestone}` : milestone}
      </div>
    ) : null;

  const controlsEl = (
    <TrackerControls
      style={params.style}
      colors={colors}
      reached={reached}
      addLabel={depositText}
      resetLabel={t.reset}
      reachedLabel={t.reached}
      onAdd={increment}
      onReset={reset}
      disabled={!hydrated}
    />
  );

  // ── Variant: jar ────────────────────────────────────────────────────────────
  if (params.variant === "jar") {
    const W = 120;
    const H = 168;
    const fillTop = 46;
    const fillBottom = 150;
    const waterY = fillBottom - (pct / 100) * (fillBottom - fillTop);

    const jarBody = `M 42 30 L 78 30 Q 96 30 96 48 L 96 134 Q 96 150 80 150 L 40 150 Q 24 150 24 134 L 24 48 Q 24 30 42 30 Z`;

    // Coin-disc edges layered up the fill to read as a stack of coins.
    const coinRows: number[] = [];
    for (let y = fillBottom - 6; y > waterY + 2; y -= 11) coinRows.push(y);

    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center" style={{ padding: "8px 18px", gap: 12 }}>
          {labelEl}
          <svg width={W * 0.9} height={H * 0.9} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
            <defs>
              <clipPath id={`${baseId}-clip`}>
                <path d={jarBody} />
              </clipPath>
              <linearGradient id={`${baseId}-grad`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={coinColor} />
                <stop offset="100%" stopColor={coinDeep} />
              </linearGradient>
            </defs>

            {/* jar interior */}
            <path d={jarBody} fill={isNeon ? `${accent}12` : track} opacity={isNeon ? 1 : 0.4} />

            {/* coin fill */}
            <g clipPath={`url(#${baseId}-clip)`}>
              {pct > 0 && (
                <>
                  <rect
                    x={0}
                    y={waterY}
                    width={W}
                    height={fillBottom - waterY + 6}
                    fill={`url(#${baseId}-grad)`}
                    style={{ transition: "y 0.6s cubic-bezier(.4,0,.2,1)" }}
                  />
                  {/* surface highlight */}
                  <ellipse cx={60} cy={waterY} rx={38} ry={5} fill={accentBright} opacity={isNeon ? 0.9 : 0.55} />
                  {/* stacked coin edges */}
                  {coinRows.map((y, i) => (
                    <ellipse
                      key={i}
                      cx={60}
                      cy={y}
                      rx={34}
                      ry={4.2}
                      fill="none"
                      stroke={isDark || isNeon ? `${accentBright}` : `${accentDeep}`}
                      strokeOpacity={0.35}
                      strokeWidth={1.4}
                    />
                  ))}
                </>
              )}
            </g>

            {/* jar outline */}
            <path
              d={jarBody}
              fill="none"
              stroke={isNeon ? accent : borderColor}
              strokeWidth={isNeon ? 2.5 : 3}
              strokeLinejoin="round"
              style={{ filter: isNeon ? `drop-shadow(0 0 4px ${accent})` : undefined }}
            />
            {/* lid band */}
            <rect
              x={34}
              y={14}
              width={52}
              height={18}
              rx={5}
              fill={isNeon ? "transparent" : track}
              stroke={isNeon ? accent : borderColor}
              strokeWidth={isNeon ? 2.5 : 3}
            />
            {/* coin slot */}
            <rect x={51} y={20} width={18} height={5} rx={2.5} fill={isNeon ? accent : borderColor} />
          </svg>

          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            {amountEl}
            {milestoneEl}
          </div>
          {controlsEl}
        </div>
      </WidgetShell>
    );
  }

  // ── Variant: coins ──────────────────────────────────────────────────────────
  if (params.variant === "coins") {
    const N = 10;
    const filled = (saved / params.goal) * N;
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center" style={{ padding: "10px 20px", gap: 14 }}>
          <div className="flex items-center justify-between w-full" style={{ gap: 12 }}>
            {labelEl}
            {percentEl}
          </div>

          <div className="flex flex-wrap justify-center" style={{ gap: 9, maxWidth: 210 }}>
            {Array.from({ length: N }).map((_, i) => {
              const full = i < Math.floor(filled);
              const partial = !full && i === Math.floor(filled) && filled % 1 > 0;
              return (
                <CoinIcon
                  key={i}
                  id={`${baseId}-c${i}`}
                  state={full ? "full" : partial ? "partial" : "empty"}
                  face={coinColor}
                  deep={coinDeep}
                  bright={accentBright}
                  outline={borderColor}
                  track={track}
                  symbol={symbol}
                  isNeon={isNeon}
                />
              );
            })}
          </div>

          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            {amountEl}
            {milestoneEl}
          </div>
          {controlsEl}
        </div>
      </WidgetShell>
    );
  }

  // ── Variant: card ───────────────────────────────────────────────────────────
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col" style={{ padding: "12px 20px", gap: 12, minWidth: 280 }}>
        <div className="flex items-center justify-between" style={{ gap: 12 }}>
          {labelEl}
          <div
            className="font-bold tabular-nums"
            style={{
              fontSize: 12,
              padding: "3px 9px",
              borderRadius: isNeon ? 4 : 999,
              color: isNeon ? accentBright : `#${colors.btnText}`,
              background: isNeon ? "transparent" : accent,
              border: isNeon ? `1.5px solid ${accent}` : "none",
              fontFamily: monoFont,
              boxShadow: isNeon ? `0 0 8px ${accent}66` : undefined,
            }}
          >
            {pctRounded}%
          </div>
        </div>

        {amountEl}

        {/* progress bar */}
        <div
          style={{
            width: "100%",
            height: 12,
            borderRadius: 999,
            background: isNeon ? `${accent}18` : track,
            overflow: "hidden",
            border: isNeon ? `1px solid ${accent}44` : "none",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 999,
              background: isNeon ? accentBright : `linear-gradient(90deg, ${accentDeep}, ${accent})`,
              boxShadow: isNeon ? `0 0 10px ${accentBright}` : undefined,
              transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>

        {milestoneEl}
        <div style={{ marginTop: 2 }}>{controlsEl}</div>
      </div>
    </WidgetShell>
  );
}

function CoinIcon({
  id,
  state,
  face,
  deep,
  bright,
  outline,
  track,
  symbol,
  isNeon,
}: {
  id: string;
  state: "full" | "partial" | "empty";
  face: string;
  deep: string;
  bright: string;
  outline: string;
  track: string;
  symbol: string;
  isNeon: boolean;
}) {
  const S = 30;
  const r = 13;
  const filled = state !== "empty";
  const opacity = state === "partial" ? 0.42 : 1;
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-g`} cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor={bright} />
          <stop offset="60%" stopColor={face} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
      </defs>
      {filled ? (
        <g opacity={opacity} style={{ filter: isNeon ? `drop-shadow(0 0 4px ${bright})` : undefined }}>
          <circle cx={S / 2} cy={S / 2} r={r} fill={`url(#${id}-g)`} />
          <circle cx={S / 2} cy={S / 2} r={r - 2.5} fill="none" stroke={bright} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="1.4 1.6" />
          <text
            x={S / 2}
            y={S / 2 + 0.5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={13}
            fontWeight={800}
            fill={deep}
            fillOpacity={0.85}
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {symbol}
          </text>
        </g>
      ) : (
        <circle cx={S / 2} cy={S / 2} r={r} fill={isNeon ? "transparent" : track} stroke={outline} strokeWidth={1.5} strokeDasharray="3 3" />
      )}
    </svg>
  );
}
