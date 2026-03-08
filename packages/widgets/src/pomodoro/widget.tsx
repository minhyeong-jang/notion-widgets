"use client";

import { useState, useEffect, useCallback } from "react";
import { WidgetShell } from "../widget-shell";
import type { PomodoroParams } from "./schema";

type TimerState = "idle" | "working" | "break";

function usePomodoro(params: PomodoroParams) {
  const workSeconds = parseInt(params.workMinutes, 10) * 60;
  const breakSeconds = parseInt(params.breakMinutes, 10) * 60;
  const totalSessions = parseInt(params.sessions, 10) || 4;

  const [state, setState] = useState<TimerState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(1);

  const totalSeconds = state === "break" ? breakSeconds : workSeconds;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setState("idle");
    setSecondsLeft(workSeconds);
    setSession(1);
  }, [workSeconds]);

  const handleSkip = useCallback(() => {
    if (state === "working") {
      setState("break");
      setSecondsLeft(breakSeconds);
    } else {
      setState("working");
      setSecondsLeft(workSeconds);
      if (state === "break") setSession(s => s + 1);
    }
  }, [state, workSeconds, breakSeconds]);

  const handleToggle = useCallback(() => {
    if (state === "idle") {
      setState("working");
      setSecondsLeft(workSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(prev => !prev);
    }
  }, [state, workSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (state === "working") {
            setState("break");
            return breakSeconds;
          } else {
            setState("working");
            setSession(s => s + 1);
            return workSeconds;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, state, workSeconds, breakSeconds]);

  const displayMin = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const displaySec = (secondsLeft % 60).toString().padStart(2, "0");

  return {
    state, isRunning, session, totalSessions,
    progress, displayMin, displaySec,
    handleToggle, handleReset, handleSkip,
  };
}

const stateLabels: Record<TimerState, { en: string; ko: string }> = {
  idle: { en: "Ready", ko: "준비" },
  working: { en: "Focus", ko: "집중" },
  break: { en: "Break", ko: "휴식" },
};

/* ─── Compact Style (default) ─── */

function CompactStyle({ timer, accentColor, textColor }: { timer: ReturnType<typeof usePomodoro>; accentColor: string; textColor: string }) {
  const breakColor = "#60a5fa";
  const ringColor = timer.state === "break" ? breakColor : accentColor;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timer.progress);

  const label = stateLabels[timer.state];

  return (
    <div className="flex items-center gap-6">
      {/* Ring */}
      <div className="relative">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke={textColor} strokeOpacity="0.08" strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke={ringColor} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-mono font-bold tabular-nums" style={{ color: textColor }}>
            {timer.displayMin}:{timer.displaySec}
          </span>
        </div>
      </div>

      {/* Info + Controls */}
      <div className="flex flex-col gap-2">
        <span
          className="text-sm font-medium"
          style={{ color: ringColor, textShadow: "var(--w-text-shadow)" }}
        >
          {label.en}
        </span>
        <span className="text-xs" style={{ color: textColor, opacity: 0.5 }}>
          {timer.session}/{timer.totalSessions} sessions
        </span>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={timer.handleToggle}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: accentColor, color: textColor }}
          >
            {!timer.isRunning ? "\u25B6" : "\u2759\u2759"}
          </button>
          <button
            onClick={timer.handleReset}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs hover:opacity-80"
            style={{ backgroundColor: `${textColor}1a`, color: textColor, opacity: 0.7 }}
          >
            {"\u21BA"}
          </button>
          <button
            onClick={timer.handleSkip}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs hover:opacity-80"
            style={{ backgroundColor: `${textColor}1a`, color: textColor, opacity: 0.7 }}
          >
            {"\u23ED"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Standard Style ─── */

function StandardStyle({ timer, accentColor, textColor }: { timer: ReturnType<typeof usePomodoro>; accentColor: string; textColor: string }) {
  const breakColor = "#60a5fa";
  const ringColor = timer.state === "break" ? breakColor : accentColor;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timer.progress);

  const label = stateLabels[timer.state];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke={textColor} strokeOpacity="0.1" strokeWidth="6"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke={ringColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold tabular-nums" style={{ color: textColor }}>
            {timer.displayMin}:{timer.displaySec}
          </span>
          <span
            className="text-sm font-medium mt-1"
            style={{ color: ringColor, textShadow: "var(--w-text-shadow)" }}
          >
            {label.ko}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={timer.handleToggle}
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
          style={{ backgroundColor: accentColor, color: textColor }}
        >
          {!timer.isRunning ? "\u25B6" : "\u2759\u2759"}
        </button>
        <button
          onClick={timer.handleReset}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm hover:opacity-80"
          style={{ backgroundColor: `${textColor}1a`, color: textColor, opacity: 0.7 }}
        >
          {"\u21BA"}
        </button>
        <button
          onClick={timer.handleSkip}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm hover:opacity-80"
          style={{ backgroundColor: `${textColor}1a`, color: textColor, opacity: 0.7 }}
        >
          {"\u23ED"}
        </button>
      </div>

      <div className="text-sm" style={{ color: textColor, opacity: 0.4 }}>
        {timer.session}/{timer.totalSessions} sessions
      </div>
    </div>
  );
}

/* ─── Neon: Terminal Progress Bar ─── */

function NeonStyle({
  timer,
  accentColor,
}: {
  timer: ReturnType<typeof usePomodoro>;
  accentColor: string;
}) {
  const breakColor = "#60a5fa";
  const activeColor = timer.state === "break" ? breakColor : accentColor;

  const barWidth = 24;
  const filled = Math.round(timer.progress * barWidth);
  const empty = barWidth - filled;
  const progressBar = "\u2588".repeat(filled) + "\u2591".repeat(empty);
  const percent = Math.round(timer.progress * 100);

  const modeLabel =
    timer.state === "idle"
      ? "MODE: STANDBY"
      : timer.state === "working"
        ? "MODE: WORK"
        : "MODE: BREAK";

  const monoStyle: React.CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: activeColor,
    textShadow: `0 0 8px ${activeColor}, 0 0 16px ${activeColor}66`,
  };

  return (
    <div
      style={{
        ...monoStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "20px 24px",
      }}
    >
      {/* Mode label */}
      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          opacity: 0.6,
          textTransform: "uppercase",
        }}
      >
        {modeLabel}
      </div>

      {/* Timer digits */}
      <div
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
      >
        {timer.displayMin}:{timer.displaySec}
      </div>

      {/* Progress bar */}
      <div
        style={{
          fontSize: "0.85rem",
          letterSpacing: "0.02em",
          whiteSpace: "pre",
          marginTop: "4px",
        }}
      >
        [{progressBar}] {String(percent).padStart(3, " ")}%
      </div>

      {/* Session counter */}
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          opacity: 0.4,
          marginTop: "4px",
        }}
      >
        SESSION {timer.session}/{timer.totalSessions}
      </div>

      {/* Terminal-style buttons */}
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button
          onClick={timer.handleToggle}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: activeColor,
            background: `${activeColor}15`,
            border: `1px solid ${activeColor}44`,
            borderRadius: "2px",
            padding: "6px 14px",
            cursor: "pointer",
            textShadow: `0 0 6px ${activeColor}88`,
          }}
        >
          {!timer.isRunning ? "[START]" : "[PAUSE]"}
        </button>
        <button
          onClick={timer.handleReset}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: activeColor,
            background: "transparent",
            border: `1px solid ${activeColor}33`,
            borderRadius: "2px",
            padding: "6px 14px",
            cursor: "pointer",
            opacity: 0.6,
          }}
        >
          [RESET]
        </button>
        <button
          onClick={timer.handleSkip}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: activeColor,
            background: "transparent",
            border: `1px solid ${activeColor}33`,
            borderRadius: "2px",
            padding: "6px 14px",
            cursor: "pointer",
            opacity: 0.6,
          }}
        >
          [SKIP]
        </button>
      </div>
    </div>
  );
}

/* ─── Main Widget ─── */

export function PomodoroWidget({ params }: { params: PomodoroParams }) {
  const timer = usePomodoro(params);
  const accentColor = "#" + params.color;
  const textColor = "#fafafa";

  return (
    <WidgetShell params={params}>
      {params.style === "neon" ? (
        <NeonStyle timer={timer} accentColor={accentColor} />
      ) : params.variant === "standard" ? (
        <StandardStyle timer={timer} accentColor={accentColor} textColor={textColor} />
      ) : (
        <CompactStyle timer={timer} accentColor={accentColor} textColor={textColor} />
      )}
    </WidgetShell>
  );
}
