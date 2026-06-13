"use client";

import { useEffect, useState } from "react";

/* ── Theme data ─────────────────────────────────────────── */

const MODES: Record<string, Record<string, string>> = {
  dark: {
    "--bg": "#100f0d", "--bg-soft": "#15140f", "--surface": "#1a1916", "--surface-2": "#201e1a",
    "--inset": "#131210", "--border": "#2a2823", "--border-soft": "#232119", "--border-strong": "#3a372f",
    "--track": "#2a2823", "--text": "#f2f0ea", "--text-dim": "#a7a399", "--text-faint": "#6f6b60",
    "--heat-empty": "rgba(255,255,255,0.05)", "--shadow": "rgba(0,0,0,0.7)",
  },
  light: {
    "--bg": "#faf9f7", "--bg-soft": "#f1efe9", "--surface": "#ffffff", "--surface-2": "#f6f4ef",
    "--inset": "#f3f1ea", "--border": "#e6e3da", "--border-soft": "#eeebe3", "--border-strong": "#d6d2c7",
    "--track": "#e4e0d5", "--text": "#1a1814", "--text-dim": "#57524a", "--text-faint": "#847e73",
    "--heat-empty": "rgba(0,0,0,0.06)", "--shadow": "rgba(0,0,0,0.14)",
  },
};

const ACCENTS: Record<string, Record<string, Record<string, string>>> = {
  green: {
    dark: { "--accent": "#7fb686", "--accent-bright": "#98cc9f", "--accent-deep": "#52b07a", "--accent-dim": "#2c5b3e", "--accent-tint": "rgba(127,182,134,0.12)", "--btn-text": "#0e1a10" },
    light: { "--accent": "#3d8f5a", "--accent-bright": "#357a4d", "--accent-deep": "#52b07a", "--accent-dim": "#bfe0c8", "--accent-tint": "rgba(61,143,90,0.14)", "--btn-text": "#ffffff" },
  },
  red: {
    dark: { "--accent": "#ef4444", "--accent-bright": "#f87171", "--accent-deep": "#c93636", "--accent-dim": "#5e2222", "--accent-tint": "rgba(239,68,68,0.12)", "--btn-text": "#1a0d0d" },
    light: { "--accent": "#dc2626", "--accent-bright": "#b91c1c", "--accent-deep": "#ef4444", "--accent-dim": "#f3c4c4", "--accent-tint": "rgba(220,38,38,0.13)", "--btn-text": "#ffffff" },
  },
  blue: {
    dark: { "--accent": "#3b82f6", "--accent-bright": "#60a5fa", "--accent-deep": "#2f68c8", "--accent-dim": "#21345e", "--accent-tint": "rgba(59,130,246,0.12)", "--btn-text": "#08111f" },
    light: { "--accent": "#2563eb", "--accent-bright": "#1d4ed8", "--accent-deep": "#3b82f6", "--accent-dim": "#c2d5f7", "--accent-tint": "rgba(37,99,235,0.12)", "--btn-text": "#ffffff" },
  },
  ocean: {
    dark: { "--accent": "#06b6d4", "--accent-bright": "#38d0ea", "--accent-deep": "#0794ac", "--accent-dim": "#134e5a", "--accent-tint": "rgba(6,182,212,0.12)", "--btn-text": "#03141a" },
    light: { "--accent": "#0891b2", "--accent-bright": "#0e7490", "--accent-deep": "#06b6d4", "--accent-dim": "#b6e6ef", "--accent-tint": "rgba(8,145,178,0.13)", "--btn-text": "#ffffff" },
  },
  sunset: {
    dark: { "--accent": "#f97316", "--accent-bright": "#fb923c", "--accent-deep": "#c85e12", "--accent-dim": "#5e3216", "--accent-tint": "rgba(249,115,22,0.12)", "--btn-text": "#1a0d05" },
    light: { "--accent": "#ea580c", "--accent-bright": "#c2410c", "--accent-deep": "#f97316", "--accent-dim": "#fbd9b8", "--accent-tint": "rgba(234,88,12,0.13)", "--btn-text": "#ffffff" },
  },
  purple: {
    dark: { "--accent": "#a855f7", "--accent-bright": "#c084fc", "--accent-deep": "#8a3fd4", "--accent-dim": "#3b2358", "--accent-tint": "rgba(168,85,247,0.12)", "--btn-text": "#120819" },
    light: { "--accent": "#9333ea", "--accent-bright": "#7e22ce", "--accent-deep": "#a855f7", "--accent-dim": "#e3cdf7", "--accent-tint": "rgba(147,51,234,0.13)", "--btn-text": "#ffffff" },
  },
};

const ACCENT_KEYS = ["green", "red", "blue", "ocean", "sunset", "purple"] as const;

const DOT_COLORS: Record<string, string> = {
  green: "#7fb686", red: "#ef4444", blue: "#3b82f6",
  ocean: "#06b6d4", sunset: "#f97316", purple: "#a855f7",
};

const ACCENT_NAMES: Record<string, { ko: string }> = {
  green: { ko: "그린" }, red: { ko: "레드" }, blue: { ko: "블루" },
  ocean: { ko: "오션" }, sunset: { ko: "선셋" }, purple: { ko: "퍼플" },
};

const MODE_NAMES: Record<string, { ko: string }> = {
  dark: { ko: "다크" }, light: { ko: "라이트" },
};

const LS_MODE = "nw-mode-v1";
const LS_ACCENT = "nw-accent-v1";

/* ── Icons ──────────────────────────────────────────────── */

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────── */

function applyVars(vars: Record<string, string>) {
  const el = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    el.style.setProperty(key, value);
  }
}

/* ── Component ──────────────────────────────────────────── */

export function ThemeSwitcher() {
  const [mode, setMode] = useState<string>("dark");
  const [accent, setAccent] = useState<string>("green");
  const [mounted, setMounted] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(LS_MODE) || "dark";
    const savedAccent = localStorage.getItem(LS_ACCENT) || "green";
    setMode(savedMode);
    setAccent(savedAccent);
    applyVars(MODES[savedMode]!);
    applyVars(ACCENTS[savedAccent]![savedMode]!);
    setMounted(true);
  }, []);

  function changeMode(newMode: string) {
    setMode(newMode);
    localStorage.setItem(LS_MODE, newMode);
    applyVars(MODES[newMode]!);
    applyVars(ACCENTS[accent]![newMode]!);
    window.dispatchEvent(new CustomEvent("nw-mode-change", { detail: newMode }));
  }

  function changeAccent(newAccent: string) {
    setAccent(newAccent);
    localStorage.setItem(LS_ACCENT, newAccent);
    applyVars(ACCENTS[newAccent]![mode]!);
    window.dispatchEvent(new CustomEvent("nw-accent-change", { detail: newAccent }));
  }

  if (!mounted) return null;

  const label = `${ACCENT_NAMES[accent]?.ko ?? accent} · ${MODE_NAMES[mode]?.ko ?? mode}`;

  return (
    <div
      className="fixed z-60 flex items-center gap-2.5"
      style={{
        right: 22,
        bottom: 22,
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid var(--border-strong)",
        borderRadius: 9999,
        padding: "9px 13px",
        boxShadow: "0 12px 30px -12px var(--shadow)",
      }}
    >
      {/* Mode toggle */}
      <button
        onClick={() => changeMode(mode === "dark" ? "light" : "dark")}
        className="flex items-center justify-center text-text-dim hover:text-text transition-colors cursor-pointer"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          background: "var(--inset)",
        }}
        aria-label="Toggle mode"
      >
        {mode === "dark" ? <MoonIcon /> : <SunIcon />}
      </button>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 18,
          background: "var(--border-strong)",
        }}
      />

      {/* Accent dots */}
      <div className="flex items-center gap-1.5">
        {ACCENT_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => changeAccent(key)}
            className="cursor-pointer transition-transform hover:scale-110"
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: DOT_COLORS[key],
              border: accent === key ? "2px solid var(--text)" : "2px solid transparent",
              padding: 0,
            }}
            aria-label={`Accent: ${key}`}
          />
        ))}
      </div>

      {/* Label */}
      <span className="text-text-dim font-mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
}
