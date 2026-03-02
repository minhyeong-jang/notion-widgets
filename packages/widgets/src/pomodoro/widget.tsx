"use client";

import { useState, useEffect, useCallback } from "react";
import type { PomodoroParams } from "./schema";

type TimerState = "idle" | "working" | "break";

export function PomodoroWidget({ params }: { params: PomodoroParams }) {
  const workSeconds = parseInt(params.workMinutes, 10) * 60;
  const breakSeconds = parseInt(params.breakMinutes, 10) * 60;

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
      if (state === "break") {
        setSession(s => s + 1);
      }
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

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const accentColor = "#" + params.color;
  const breakColor = "#60a5fa";
  const ringColor = state === "break" ? breakColor : accentColor;

  const statusLabel = state === "idle"
    ? "준비"
    : state === "working"
      ? "집중"
      : "휴식";

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-52 h-52">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="6"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-mono font-bold text-white tabular-nums">
              {displayMin}:{displaySec}
            </span>
            <span
              className="text-sm font-medium mt-1"
              style={{ color: ringColor }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: accentColor }}
          >
            {!isRunning ? "\u25B6" : "\u2759\u2759"}
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white/70 text-sm hover:bg-white/20"
          >
            {"\u21BA"}
          </button>
          <button
            onClick={handleSkip}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white/70 text-sm hover:bg-white/20"
          >
            {"\u23ED"}
          </button>
        </div>

        <div className="text-white/40 text-sm">
          {session}/4 세션
        </div>
      </div>
    </div>
  );
}
