"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { MetronomeParams } from "./schema";
import { getTempo, clamp } from "./tempo";

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

interface PartProps {
  accentColor: string;
  beatSeconds: number;
  glow: boolean;
  size: number;
}

/** Classic mechanical metronome with a pendulum arm swinging at the tempo. */
function Pendulum({ accentColor, beatSeconds, glow, size }: PartProps) {
  const fullCycle = (beatSeconds * 2).toFixed(4);
  const svgStyle: CSSProperties = glow
    ? { filter: `drop-shadow(0 0 6px ${hexToRgba(accentColor, 0.7)})` }
    : {};
  const armStyle: CSSProperties = {
    transformBox: "view-box",
    transformOrigin: "100px 214px",
    animation: `mt-swing ${fullCycle}s ease-in-out infinite`,
  };

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={svgStyle}>
      {/* Metronome body (trapezoid) */}
      <path
        d="M40 226 L160 226 L122 54 L78 54 Z"
        fill={hexToRgba(accentColor, 0.08)}
        stroke={accentColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* Scale slit */}
      <line x1="100" y1="70" x2="100" y2="206" stroke={hexToRgba(accentColor, 0.25)} strokeWidth={2} />
      {/* Pendulum arm + weight (animated) */}
      <g style={armStyle}>
        <line x1="100" y1="214" x2="100" y2="50" stroke={accentColor} strokeWidth={4} strokeLinecap="round" />
        <rect x="90" y="86" width="20" height="26" rx="3" fill={accentColor} />
        <circle cx="100" cy="50" r="4" fill={accentColor} />
      </g>
      {/* Pivot */}
      <circle cx="100" cy="214" r="6" fill={accentColor} />
    </svg>
  );
}

/** Concentric pulse that expands on every beat. */
function Pulse({ accentColor, beatSeconds, glow, size }: PartProps) {
  const dur = beatSeconds.toFixed(4);
  const svgStyle: CSSProperties = glow
    ? { filter: `drop-shadow(0 0 8px ${hexToRgba(accentColor, 0.7)})` }
    : {};
  const pulseStyle: CSSProperties = {
    transformBox: "view-box",
    transformOrigin: "100px 100px",
    animation: `mt-pulse ${dur}s ease-out infinite`,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
      <circle cx="100" cy="100" r="82" fill="none" stroke={hexToRgba(accentColor, 0.2)} strokeWidth={2} />
      <circle cx="100" cy="100" r="60" style={pulseStyle} fill={hexToRgba(accentColor, 0.18)} />
      <circle cx="100" cy="100" r="60" style={pulseStyle} fill="none" stroke={hexToRgba(accentColor, 0.5)} strokeWidth={2} />
      <circle cx="100" cy="100" r="13" fill={accentColor} />
    </svg>
  );
}

function BeatDots({ beats, accentColor }: { beats: number; accentColor: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: beats }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: i === 0 ? accentColor : "transparent",
            border: `2px solid ${i === 0 ? accentColor : hexToRgba(accentColor, 0.4)}`,
          }}
        />
      ))}
    </div>
  );
}

export function MetronomeWidget({ params }: { params: MetronomeParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const accentColor = `#${colors.accent}`;
  const textColor = `#${colors.text}`;
  const dimColor = `#${colors.textDim}`;

  const bpm = clamp(Math.round(Number(params.bpm)) || 120, 30, 300);
  const beats = clamp(Math.round(Number(params.beats)) || 4, 1, 12);
  const beatSeconds = 60 / bpm;

  const isKo = params.locale.startsWith("ko");
  const tempo = getTempo(bpm);
  const tempoLabel = isKo ? tempo.ko : tempo.en;
  const tempoName = tempo.en; // Italian marking stays canonical
  const signature = `${beats}/4`;
  const isNeon = params.style === "neon";
  const glow = isNeon;

  const keyframes = `
    @keyframes mt-swing {
      0% { transform: rotate(-15deg); }
      50% { transform: rotate(15deg); }
      100% { transform: rotate(-15deg); }
    }
    @keyframes mt-pulse {
      0% { transform: scale(0.72); opacity: 0.85; }
      70% { transform: scale(1.12); opacity: 0.12; }
      100% { transform: scale(1.12); opacity: 0; }
    }
  `;

  const Visual =
    params.variant === "pulse" ? (
      <Pulse accentColor={accentColor} beatSeconds={beatSeconds} glow={glow} size={150} />
    ) : (
      <Pendulum accentColor={accentColor} beatSeconds={beatSeconds} glow={glow} size={150} />
    );

  // ----- Neon style -----
  if (isNeon) {
    return (
      <WidgetShell params={params}>
        <style>{keyframes}</style>
        <div
          className="flex flex-col items-center gap-4"
          style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)" }}
        >
          {Visual}
          <div
            className="flex items-baseline gap-2"
            style={{ color: accentColor, textShadow: `0 0 14px ${hexToRgba(accentColor, 0.6)}` }}
          >
            <span style={{ fontSize: "2.75rem", fontWeight: 700, lineHeight: 1 }}>{bpm}</span>
            <span style={{ fontSize: "0.9rem", opacity: 0.7 }}>BPM</span>
          </div>
          <BeatDots beats={beats} accentColor={accentColor} />
          <div
            className="text-sm"
            style={{ color: accentColor, opacity: 0.75, letterSpacing: "0.08em" }}
          >
            {tempoName.toUpperCase()} · {signature}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ----- Minimal / Soft / Glass -----
  return (
    <WidgetShell params={params}>
      <style>{keyframes}</style>
      <div className="flex flex-col items-center gap-4">
        {Visual}
        <BeatDots beats={beats} accentColor={accentColor} />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: "2.75rem", fontWeight: 700, lineHeight: 1, color: accentColor }}>
              {bpm}
            </span>
            <span style={{ fontSize: "0.9rem", color: dimColor, fontWeight: 600 }}>BPM</span>
          </div>
          <div className="text-sm" style={{ color: textColor }}>
            {tempoName}
            <span style={{ color: dimColor }}> · {signature}</span>
          </div>
          {isKo && (
            <div className="text-xs" style={{ color: dimColor }}>
              {tempoLabel}
            </div>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
