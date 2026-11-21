"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { IntervalTimerParams } from "./schema";

type Phase = "work" | "rest" | "done";

interface Segment {
  type: "work" | "rest";
  dur: number;
  round: number;
}

function buildSegments(work: number, rest: number, rounds: number): Segment[] {
  const segs: Segment[] = [];
  for (let r = 1; r <= rounds; r++) {
    segs.push({ type: "work", dur: work, round: r });
    if (rest > 0 && r < rounds) segs.push({ type: "rest", dur: rest, round: r });
  }
  return segs;
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface AudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function useIntervalTimer(work: number, rest: number, rounds: number) {
  const segments = useMemo(() => buildSegments(work, rest, rounds), [work, rest, rounds]);

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [segIndex, setSegIndex] = useState(0);
  const [remaining, setRemaining] = useState((segments[0]?.dur ?? 0) * 1000);

  const remainingRef = useRef(remaining);
  const segIndexRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const lastTickSecRef = useRef(-1);
  const audioRef = useRef<AudioContext | null>(null);

  const beep = useCallback((freq: number, durSec = 0.09, vol = 0.35) => {
    const ctx = audioRef.current;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durSec + 0.02);
    } catch {
      /* audio unavailable */
    }
  }, []);

  const resetTo = useCallback(
    (startRunning: boolean) => {
      segIndexRef.current = 0;
      setSegIndex(0);
      remainingRef.current = (segments[0]?.dur ?? 0) * 1000;
      setRemaining(remainingRef.current);
      lastTickSecRef.current = -1;
      setDone(false);
      runningRef.current = startRunning;
      setRunning(startRunning);
    },
    [segments],
  );

  // Reset whenever the configuration changes (customizer preview).
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    resetTo(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments]);

  const advance = useCallback(() => {
    const next = segIndexRef.current + 1;
    if (next >= segments.length) {
      runningRef.current = false;
      setRunning(false);
      setDone(true);
      remainingRef.current = 0;
      setRemaining(0);
      beep(880, 0.12, 0.4);
      window.setTimeout(() => beep(1175, 0.12, 0.4), 130);
      window.setTimeout(() => beep(1568, 0.2, 0.4), 280);
      return;
    }
    segIndexRef.current = next;
    setSegIndex(next);
    remainingRef.current = segments[next].dur * 1000;
    setRemaining(remainingRef.current);
    lastTickSecRef.current = -1;
    beep(segments[next].type === "work" ? 920 : 540, 0.12, 0.4);
  }, [segments, beep]);

  const frame = useCallback(
    (ts: number) => {
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      remainingRef.current -= dt;

      const secLeft = Math.ceil(remainingRef.current / 1000);
      if (secLeft <= 3 && secLeft >= 1 && secLeft !== lastTickSecRef.current) {
        lastTickSecRef.current = secLeft;
        beep(700, 0.05, 0.18);
      }

      if (remainingRef.current <= 0) {
        advance();
      } else {
        setRemaining(remainingRef.current);
      }

      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(frame);
      }
    },
    [advance, beep],
  );

  const ensureAudio = useCallback(() => {
    try {
      if (!audioRef.current) {
        const w = window as AudioWindow;
        const AC = window.AudioContext || w.webkitAudioContext;
        if (AC) audioRef.current = new AC();
      }
      void audioRef.current?.resume?.();
    } catch {
      /* ignore */
    }
  }, []);

  const start = useCallback(() => {
    ensureAudio();
    runningRef.current = true;
    setRunning(true);
    lastRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(frame);
    // Cue the very first work interval.
    if (segIndexRef.current === 0 && lastTickSecRef.current === -1) {
      beep(920, 0.12, 0.4);
    }
  }, [ensureAudio, frame, beep]);

  const toggle = useCallback(() => {
    if (done) {
      resetTo(true);
      ensureAudio();
      runningRef.current = true;
      lastRef.current = performance.now();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(frame);
      beep(920, 0.12, 0.4);
      return;
    }
    if (runningRef.current) {
      runningRef.current = false;
      setRunning(false);
      cancelAnimationFrame(rafRef.current);
    } else {
      start();
    }
  }, [done, resetTo, ensureAudio, frame, beep, start]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    resetTo(false);
  }, [resetTo]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      try {
        void audioRef.current?.close();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const seg = segments[Math.min(segIndexRef.current, segments.length - 1)] ?? {
    type: "work" as const,
    dur: 0,
    round: 1,
  };
  const phase: Phase = done ? "done" : seg.type;
  const currentRound = seg.round;
  const segDurMs = seg.dur * 1000 || 1;
  const progress = done ? 1 : Math.min(1, Math.max(0, remaining / segDurMs));

  return {
    running,
    done,
    phase,
    currentRound,
    rounds,
    remaining,
    progress,
    toggle,
    reset,
  };
}

interface Palette {
  text: string;
  dim: string;
  faint: string;
  accent: string;
  accentBright: string;
  rest: string;
  track: string;
  border: string;
}

function phaseColor(phase: Phase, c: Palette): string {
  if (phase === "rest") return c.rest;
  return c.accent;
}

function phaseLabel(phase: Phase): string {
  if (phase === "work") return "WORK";
  if (phase === "rest") return "REST";
  return "DONE";
}

/* ---------- Round dots ---------- */

function RoundDots({
  rounds,
  currentRound,
  phase,
  done,
  c,
  neon,
}: {
  rounds: number;
  currentRound: number;
  phase: Phase;
  done: boolean;
  c: Palette;
  neon: boolean;
}) {
  // Keep the row compact for high round counts.
  const dot = rounds > 12 ? 7 : 9;
  const gap = rounds > 12 ? 5 : 7;
  return (
    <div className="flex items-center justify-center flex-wrap" style={{ gap, maxWidth: 220 }}>
      {Array.from({ length: rounds }).map((_, i) => {
        const r = i + 1;
        const completed = done || r < currentRound;
        const active = !done && r === currentRound;
        const color = completed || active ? c.accent : c.track;
        return (
          <div
            key={i}
            style={{
              width: dot,
              height: dot,
              borderRadius: "50%",
              background: active && phase === "rest" ? "transparent" : color,
              border: active && phase === "rest" ? `2px solid ${c.accent}` : "none",
              boxShadow: active && neon ? `0 0 8px ${c.accent}` : "none",
              opacity: completed && !active ? 0.55 : 1,
              transition: "background 0.2s linear, opacity 0.2s linear",
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- Ring ---------- */

function RingVisual({
  phase,
  progress,
  remaining,
  c,
  neon,
}: {
  phase: Phase;
  progress: number;
  remaining: number;
  c: Palette;
  neon: boolean;
}) {
  const size = 168;
  const r = 72;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const col = phaseColor(phase, c);
  const offset = circ * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={c.track} strokeWidth={11} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ filter: neon ? `drop-shadow(0 0 6px ${col})` : undefined }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: col,
            textShadow: neon ? `0 0 8px ${col}80` : "var(--w-text-shadow)",
          }}
        >
          {phaseLabel(phase)}
        </span>
        <span
          style={{
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.05,
            color: c.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmt(remaining)}
        </span>
      </div>
    </div>
  );
}

/* ---------- Bar ---------- */

function BarVisual({
  phase,
  progress,
  remaining,
  c,
  neon,
}: {
  phase: Phase;
  progress: number;
  remaining: number;
  c: Palette;
  neon: boolean;
}) {
  const col = phaseColor(phase, c);
  return (
    <div className="flex flex-col items-center" style={{ gap: 12, width: 232 }}>
      <div className="flex items-baseline justify-between w-full">
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: col,
            textShadow: neon ? `0 0 8px ${col}80` : "none",
          }}
        >
          {phaseLabel(phase)}
        </span>
        <span
          style={{
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1,
            color: c.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmt(remaining)}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 12,
          borderRadius: 999,
          background: c.track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 999,
            background: col,
            boxShadow: neon ? `0 0 10px ${col}` : "none",
          }}
        />
      </div>
    </div>
  );
}

/* ---------- Digits ---------- */

function DigitsVisual({
  phase,
  remaining,
  c,
  neon,
}: {
  phase: Phase;
  remaining: number;
  c: Palette;
  neon: boolean;
}) {
  const col = phaseColor(phase, c);
  return (
    <div className="flex flex-col items-center" style={{ gap: 2 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: col,
          textShadow: neon ? `0 0 8px ${col}80` : "none",
        }}
      >
        {phaseLabel(phase)}
      </span>
      <span
        style={{
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1,
          color: c.text,
          fontVariantNumeric: "tabular-nums",
          textShadow: neon ? `0 0 14px ${col}55` : "var(--w-text-shadow)",
        }}
      >
        {fmt(remaining)}
      </span>
    </div>
  );
}

/* ---------- Controls ---------- */

function Controls({
  c,
  neon,
  running,
  done,
  onToggle,
  onReset,
}: {
  c: Palette;
  neon: boolean;
  running: boolean;
  done: boolean;
  onToggle: () => void;
  onReset: () => void;
}) {
  const ghost: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: neon ? 4 : 10,
    border: `1px solid ${c.border}`,
    background: "transparent",
    color: c.dim,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div className="flex items-center justify-center" style={{ gap: 14 }}>
      <button
        type="button"
        aria-label={running ? "Pause" : "Start"}
        onClick={onToggle}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          background: c.accent,
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: neon ? `0 0 16px ${c.accent}` : `0 4px 14px ${c.accent}55`,
        }}
      >
        {running ? (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : done ? (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 2.5-6.3" />
            <path d="M3 4v4h4" />
          </svg>
        ) : (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        )}
      </button>
      <button type="button" aria-label="Reset" onClick={onReset} style={ghost}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 2.5-6.3" />
          <path d="M3 4v4h4" />
        </svg>
      </button>
    </div>
  );
}

/* ---------- Widget ---------- */

export function IntervalTimerWidget({ params }: { params: IntervalTimerParams }) {
  const mode = useWidgetColorMode();
  const rc = resolveColors(params.accent, mode);
  const neon = params.style === "neon";

  const c: Palette = {
    text: `#${rc.text}`,
    dim: `#${rc.textDim}`,
    faint: `#${rc.textFaint}`,
    accent: `#${rc.accent}`,
    accentBright: `#${rc.accentBright}`,
    rest: `#${rc.textDim}`,
    track: `#${rc.track}`,
    border: `#${neon ? rc.borderStrong : rc.border}`,
  };

  const t = useIntervalTimer(params.work, params.rest, params.rounds);

  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center" style={{ gap: 14, padding: "2px 8px" }}>
        {params.variant === "bar" ? (
          <BarVisual phase={t.phase} progress={t.progress} remaining={t.remaining} c={c} neon={neon} />
        ) : params.variant === "digits" ? (
          <DigitsVisual phase={t.phase} remaining={t.remaining} c={c} neon={neon} />
        ) : (
          <RingVisual phase={t.phase} progress={t.progress} remaining={t.remaining} c={c} neon={neon} />
        )}

        <div className="flex flex-col items-center" style={{ gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: c.faint,
            }}
          >
            {t.done ? "COMPLETE" : neon ? `ROUND ${t.currentRound} / ${t.rounds}` : `Round ${t.currentRound} / ${t.rounds}`}
          </span>
          <RoundDots
            rounds={t.rounds}
            currentRound={t.currentRound}
            phase={t.phase}
            done={t.done}
            c={c}
            neon={neon}
          />
        </div>

        {params.showControls && (
          <Controls
            c={c}
            neon={neon}
            running={t.running}
            done={t.done}
            onToggle={t.toggle}
            onReset={t.reset}
          />
        )}
      </div>
    </WidgetShell>
  );
}
