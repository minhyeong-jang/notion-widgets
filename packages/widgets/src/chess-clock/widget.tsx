"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ChessClockParams } from "./schema";

type Side = "A" | "B";
const other = (s: Side): Side => (s === "A" ? "B" : "A");

const STRINGS: Record<
  string,
  { start: string; pause: string; resume: string; reset: string; timeUp: string; moves: string }
> = {
  ko: { start: "한쪽을 눌러 시작", pause: "일시정지", resume: "계속", reset: "초기화", timeUp: "시간 종료", moves: "수" },
  en: { start: "Tap a side to start", pause: "Pause", resume: "Resume", reset: "Reset", timeUp: "Time's up", moves: "moves" },
  ja: { start: "タップで開始", pause: "一時停止", resume: "再開", reset: "リセット", timeUp: "時間切れ", moves: "手" },
  zh: { start: "点击一侧开始", pause: "暂停", resume: "继续", reset: "重置", timeUp: "时间到", moves: "手" },
  de: { start: "Seite tippen zum Start", pause: "Pause", resume: "Weiter", reset: "Zurücksetzen", timeUp: "Zeit um", moves: "Züge" },
  fr: { start: "Touchez un côté", pause: "Pause", resume: "Reprendre", reset: "Réinit.", timeUp: "Temps écoulé", moves: "coups" },
  es: { start: "Toca un lado", pause: "Pausa", resume: "Seguir", reset: "Reiniciar", timeUp: "Tiempo agotado", moves: "jugadas" },
};

/** Format milliseconds → M:SS, or S.d under ten seconds for the final countdown. */
function fmt(ms: number): string {
  const clamped = Math.max(0, ms);
  if (clamped < 10000) {
    const s = Math.floor(clamped / 1000);
    const d = Math.floor((clamped % 1000) / 100);
    return `${s}.${d}`;
  }
  const total = Math.ceil(clamped / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ─────────────────────────── engine ─────────────────────────── */

function useChessClock(baseMs: number, incMs: number) {
  const [clocks, setClocks] = useState<{ A: number; B: number }>({ A: baseMs, B: baseMs });
  const [active, setActive] = useState<Side | null>(null);
  const [paused, setPaused] = useState(false);
  const [loser, setLoser] = useState<Side | null>(null);
  const [moves, setMoves] = useState<{ A: number; B: number }>({ A: 0, B: 0 });

  const clockRef = useRef({ A: baseMs, B: baseMs });
  const activeRef = useRef<Side | null>(null);
  activeRef.current = active;

  // Reset whenever the configured base time changes (customizer edits).
  useEffect(() => {
    clockRef.current = { A: baseMs, B: baseMs };
    setClocks({ A: baseMs, B: baseMs });
    setActive(null);
    setPaused(false);
    setLoser(null);
    setMoves({ A: 0, B: 0 });
  }, [baseMs]);

  // Ticking loop for the running side, using real elapsed time for accuracy.
  useEffect(() => {
    if (active === null || paused || loser) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      const key = activeRef.current;
      if (key) {
        const next = Math.max(0, clockRef.current[key] - dt);
        clockRef.current[key] = next;
        setClocks({ ...clockRef.current });
        if (next <= 0) {
          setLoser(key);
          setActive(null);
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, paused, loser]);

  const tap = useCallback(
    (side: Side) => {
      if (loser) return;
      setActive((cur) => {
        if (cur === null) {
          // First tap hands the move to the opponent (chess: Black starts White's clock).
          setPaused(false);
          return other(side);
        }
        if (side === cur) {
          // The thinking player presses their own side to pass the turn.
          clockRef.current[side] = clockRef.current[side] + incMs;
          setClocks({ ...clockRef.current });
          setMoves((m) => ({ ...m, [side]: m[side] + 1 }));
          setPaused(false);
          return other(side);
        }
        return cur; // tapping the idle side is ignored
      });
    },
    [loser, incMs],
  );

  const togglePause = useCallback(() => {
    if (active === null || loser) return;
    setPaused((p) => !p);
  }, [active, loser]);

  const reset = useCallback(() => {
    clockRef.current = { A: baseMs, B: baseMs };
    setClocks({ A: baseMs, B: baseMs });
    setActive(null);
    setPaused(false);
    setLoser(null);
    setMoves({ A: 0, B: 0 });
  }, [baseMs]);

  return { clocks, active, paused, loser, moves, baseMs, tap, togglePause, reset };
}

/* ─────────────────────────── icons ─────────────────────────── */

function PauseIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={color} aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}
function PlayIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.74-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}
function ResetIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
function FlagIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

/* ─────────────────────────── widget ─────────────────────────── */

export function ChessClockWidget({ params }: { params: ChessClockParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  const baseMs = Math.round(params.minutes * 60 * 1000);
  const incMs = Math.round(params.increment * 1000);
  const engine = useChessClock(baseMs, incMs);
  const { clocks, active, paused, loser, moves } = engine;

  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const btnText = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const border = `#${colors.border}`;
  const neutralBg = isDark ? `#${colors.surface2}` : "#ffffff";
  const insetBg = `#${colors.inset}`;

  const glow = (c: string, r = 10) => (isNeon ? `0 0 ${r}px ${c}` : undefined);
  const mono = "var(--font-geist-mono, ui-monospace, monospace)";

  const started = active !== null || loser !== null || clocks.A !== baseMs || clocks.B !== baseMs;
  const lowSide = (side: Side) => active === side && clocks[side] < 30000;

  /* A single player panel (used by split & stacked). */
  const Panel = ({ side, flip = false }: { side: Side; flip?: boolean }) => {
    const isActive = active === side && !paused && !loser;
    const isLoser = loser === side;
    const low = lowSide(side);

    let bg: string;
    let timeColor: string;
    let labelColor: string;
    let bdr: string;
    if (isNeon) {
      bg = "transparent";
      timeColor = isActive ? accentBright : isLoser ? textFaint : textDim;
      labelColor = isActive ? accentBright : textFaint;
      bdr = `2px solid ${isActive ? accentBright : isLoser ? `${textFaint}66` : `${accent}44`}`;
    } else if (isActive) {
      bg = accent;
      timeColor = btnText;
      labelColor = btnText;
      bdr = "2px solid transparent";
    } else {
      bg = isLoser ? insetBg : neutralBg;
      timeColor = isLoser ? textFaint : text;
      labelColor = accent;
      bdr = `1.5px solid ${border}`;
    }

    return (
      <button
        type="button"
        onClick={() => engine.tap(side)}
        aria-label={`Side ${side}`}
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "22px 16px",
          borderRadius: isNeon ? 8 : 16,
          background: bg,
          border: bdr,
          cursor: loser ? "default" : "pointer",
          transform: flip ? "rotate(180deg)" : undefined,
          transition: "background-color 140ms ease, border-color 140ms ease, opacity 140ms ease",
          opacity: isLoser ? 0.7 : 1,
          boxShadow: isActive ? glow(accentBright, 16) : undefined,
          position: "relative",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div className="flex items-center gap-1.5" style={{ opacity: 0.9 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isActive ? (isNeon ? accentBright : btnText) : accent,
              boxShadow: isActive ? glow(accentBright, 6) : undefined,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: labelColor,
              fontFamily: isNeon ? mono : undefined,
            }}
          >
            {side === "A" ? "P1" : "P2"}
          </span>
        </div>

        {isLoser ? (
          <div className="flex flex-col items-center gap-1" style={{ color: timeColor }}>
            <FlagIcon color={timeColor} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{t.timeUp}</span>
          </div>
        ) : (
          <span
            className="tabular-nums"
            style={{
              fontSize: 46,
              fontWeight: 700,
              lineHeight: 1,
              color: timeColor,
              fontFamily: mono,
              letterSpacing: "-0.02em",
              textShadow: isActive ? glow(accentBright, 14) : undefined,
              animation: low ? "nw-cc-pulse 1s ease-in-out infinite" : undefined,
            }}
          >
            {fmt(clocks[side])}
          </span>
        )}

        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: isActive && !isNeon ? btnText : textFaint,
            opacity: isActive && !isNeon ? 0.8 : 1,
            fontFamily: isNeon ? mono : undefined,
          }}
        >
          {moves[side]} {t.moves}
        </span>
      </button>
    );
  };

  /* Center transport controls. */
  const Controls = ({ compact = false }: { compact?: boolean }) => {
    const ghostBg = isNeon ? "transparent" : insetBg;
    const ghostBorder = isNeon ? `1.5px solid ${accent}66` : `1px solid ${border}`;
    const btn: React.CSSProperties = {
      width: compact ? 34 : 38,
      height: compact ? 34 : 38,
      borderRadius: isNeon ? 6 : 10,
      background: ghostBg,
      border: ghostBorder,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: isNeon ? accent : textDim,
    };
    const iconColor = isNeon ? accent : textDim;
    return (
      <div className="flex items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={engine.togglePause}
          aria-label={paused ? t.resume : t.pause}
          disabled={active === null || !!loser}
          style={{ ...btn, opacity: active === null || loser ? 0.4 : 1 }}
        >
          {paused ? <PlayIcon color={iconColor} /> : <PauseIcon color={iconColor} />}
        </button>
        <button type="button" onClick={engine.reset} aria-label={t.reset} style={btn}>
          <ResetIcon color={iconColor} />
        </button>
      </div>
    );
  };

  const BaseLine = () => (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        color: isNeon ? accent : textFaint,
        fontFamily: isNeon ? mono : undefined,
      }}
    >
      {!started
        ? t.start
        : `${params.minutes}:00${params.increment ? ` +${params.increment}` : ""}`}
    </span>
  );

  const pulseStyle = <style>{`@keyframes nw-cc-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }`}</style>;

  /* ─── Variant: bars ─── */
  if (params.variant === "bars") {
    const Bar = ({ side }: { side: Side }) => {
      const isActive = active === side && !paused && !loser;
      const isLoser = loser === side;
      const frac = Math.max(0, Math.min(1, clocks[side] / baseMs));
      const low = lowSide(side);
      return (
        <button
          type="button"
          onClick={() => engine.tap(side)}
          aria-label={`Side ${side}`}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: isNeon ? 8 : 14,
            background: isNeon ? "transparent" : isActive ? `${accent}1f` : neutralBg,
            border: isNeon
              ? `1.5px solid ${isActive ? accentBright : `${accent}44`}`
              : `1.5px solid ${isActive ? accent : border}`,
            cursor: loser ? "default" : "pointer",
            opacity: isLoser ? 0.65 : 1,
            boxShadow: isActive ? glow(accentBright, 12) : undefined,
            transition: "border-color 140ms ease, background-color 140ms ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              flexShrink: 0,
              background: isActive ? accentBright : accent,
              boxShadow: isActive ? glow(accentBright, 6) : undefined,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: isNeon ? accent : textDim, width: 26, flexShrink: 0, fontFamily: isNeon ? mono : undefined }}>
            {side === "A" ? "P1" : "P2"}
          </span>
          <div style={{ flex: 1, height: 8, borderRadius: 999, background: isNeon ? `${accent}22` : insetBg, overflow: "hidden" }}>
            <div
              style={{
                width: `${frac * 100}%`,
                height: "100%",
                borderRadius: 999,
                background: isLoser ? textFaint : `linear-gradient(90deg, ${accent}, ${accentBright})`,
                boxShadow: isActive ? glow(accentBright, 8) : undefined,
                transition: "width 120ms linear",
              }}
            />
          </div>
          <span
            className="tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: isLoser ? textFaint : isActive ? (isNeon ? accentBright : text) : text,
              fontFamily: mono,
              minWidth: 68,
              textAlign: "right",
              textShadow: isActive ? glow(accentBright, 10) : undefined,
              animation: low ? "nw-cc-pulse 1s ease-in-out infinite" : undefined,
            }}
          >
            {loser === side ? t.timeUp : fmt(clocks[side])}
          </span>
        </button>
      );
    };
    return (
      <WidgetShell params={params}>
        {pulseStyle}
        <div className="flex flex-col items-center" style={{ gap: 12, width: "100%", maxWidth: 380, padding: "2px 10px" }}>
          <Bar side="A" />
          <Bar side="B" />
          <div className="flex items-center justify-between w-full" style={{ marginTop: 2, padding: "0 2px" }}>
            <BaseLine />
            <Controls compact />
          </div>
        </div>
      </WidgetShell>
    );
  }

  /* ─── Variant: stacked (face to face) ─── */
  if (params.variant === "stacked") {
    return (
      <WidgetShell params={params}>
        {pulseStyle}
        <div className="flex flex-col items-stretch" style={{ gap: 12, width: "100%", maxWidth: 320, padding: "2px 6px" }}>
          <Panel side="B" flip />
          <div className="flex items-center justify-center gap-4">
            <div style={{ flex: 1, height: 1, background: isNeon ? `${accent}33` : border }} />
            <Controls compact />
            <div style={{ flex: 1, height: 1, background: isNeon ? `${accent}33` : border }} />
          </div>
          <Panel side="A" />
          <div className="flex justify-center" style={{ marginTop: 2 }}>
            <BaseLine />
          </div>
        </div>
      </WidgetShell>
    );
  }

  /* ─── Variant: split (default) ─── */
  return (
    <WidgetShell params={params}>
      {pulseStyle}
      <div className="flex flex-col items-center" style={{ gap: 14, width: "100%", maxWidth: 400, padding: "2px 8px" }}>
        <div className="flex items-stretch w-full" style={{ gap: 12 }}>
          <Panel side="A" />
          <Panel side="B" />
        </div>
        <div className="flex items-center justify-between w-full" style={{ padding: "0 4px" }}>
          <BaseLine />
          <Controls />
        </div>
      </div>
    </WidgetShell>
  );
}
