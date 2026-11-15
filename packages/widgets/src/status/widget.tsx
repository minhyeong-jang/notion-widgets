"use client";

import type { CSSProperties, ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { StatusParams } from "./schema";

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

type StatusKey = StatusParams["status"];

const PRESETS: Record<StatusKey, { en: string; ko: string; active: boolean }> = {
  available: { en: "Available", ko: "활동 중", active: true },
  busy: { en: "Busy", ko: "바쁨", active: true },
  away: { en: "Away", ko: "자리 비움", active: true },
  focus: { en: "Focusing", ko: "집중 중", active: true },
  offline: { en: "Offline", ko: "오프라인", active: false },
  custom: { en: "Status", ko: "상태", active: true },
};

/** Line-art symbol per status, drawn in `col`. */
function StatusSymbol({ status, col }: { status: StatusKey; col: string }) {
  switch (status) {
    case "busy":
      return <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill={col} />;
    case "away":
      return (
        <path
          d="M16.2 5.5a7 7 0 1 0 0 13 5.6 5.6 0 1 1 0-13z"
          fill={col}
        />
      );
    case "focus":
      return (
        <>
          <circle cx="12" cy="12" r="6" fill="none" stroke={col} strokeWidth="2.1" />
          <circle cx="12" cy="12" r="2.1" fill={col} />
        </>
      );
    case "offline":
      return <circle cx="12" cy="12" r="5.4" fill="none" stroke={col} strokeWidth="2.1" />;
    default: // available / custom
      return <circle cx="12" cy="12" r="5.2" fill={col} />;
  }
}

export function StatusWidget({ params }: { params: StatusParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isDark = colorMode === "dark";
  const isNeon = params.style === "neon";
  const isGlass = params.style === "glass";
  const isSoft = params.style === "soft";

  const preset = PRESETS[params.status];
  const isActive = preset.active;
  const isKo = params.locale.startsWith("ko");

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  // Active statuses glow with the accent; offline reads muted.
  const dot = isActive ? (isNeon ? accentBright : accent) : textFaint;
  const label = params.label.trim() || (isKo ? preset.ko : preset.en);
  const message = params.message.trim();
  const showPulse = params.pulse && isActive;

  // Circular chip that carries the status symbol + optional pulse rings.
  const chip = (size: number, animate: boolean): ReactNode => {
    return (
      <span
        className="relative inline-flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {animate && showPulse && (
          <>
            <span
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: hexToRgba(dot, isDark ? 0.5 : 0.4),
                animation: "status-pulse 2.4s ease-out infinite",
              }}
            />
            <span
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: hexToRgba(dot, isDark ? 0.5 : 0.4),
                animation: "status-pulse 2.4s ease-out 1.2s infinite",
              }}
            />
          </>
        )}
        <span
          className="relative inline-flex items-center justify-center rounded-full"
          style={{
            width: size,
            height: size,
            background: hexToRgba(dot, isDark ? 0.16 : 0.12),
            border: `1px solid ${hexToRgba(dot, 0.32)}`,
            boxShadow: isNeon && isActive ? `0 0 ${size * 0.4}px ${hexToRgba(dot, 0.7)}` : "none",
          }}
        >
          <svg
            width={size * 0.62}
            height={size * 0.62}
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={isNeon && isActive ? { filter: `drop-shadow(0 0 ${size * 0.12}px ${hexToRgba(dot, 0.9)})` } : undefined}
          >
            <StatusSymbol status={params.status} col={dot} />
          </svg>
        </span>
        <span className="sr-only">{label}</span>
      </span>
    );
  };

  const pulseKeyframes = (
    <style>{`
      @keyframes status-pulse {
        0% { transform: scale(1); opacity: 0.55; }
        80%, 100% { transform: scale(2.2); opacity: 0; }
      }
    `}</style>
  );

  // Self-contained container styling for pill / banner (bare) variants.
  const containerStyle = (): CSSProperties => {
    const base: CSSProperties = {
      background: isGlass
        ? isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.72)"
        : hexToRgba(dot, isDark ? 0.1 : 0.08),
      border: `1px solid ${hexToRgba(isActive ? dot : textFaint, isGlass ? 0.18 : 0.26)}`,
    };
    if (isGlass) {
      base.backdropFilter = "blur(14px) saturate(170%)";
      base.WebkitBackdropFilter = "blur(14px) saturate(170%)";
      base.boxShadow = isDark ? "0 8px 28px rgba(0,0,0,0.3)" : "0 8px 28px rgba(0,0,0,0.06)";
    } else if (isSoft) {
      base.boxShadow = isDark ? "0 2px 14px rgba(0,0,0,0.22)" : "0 2px 16px rgba(0,0,0,0.07)";
    } else if (isNeon && isActive) {
      base.boxShadow = `0 0 18px ${hexToRgba(dot, 0.4)}, inset 0 0 12px ${hexToRgba(dot, 0.12)}`;
    }
    return base;
  };

  const labelStyle: CSSProperties = {
    color: isNeon && isActive ? accentBright : text,
    textShadow: "var(--w-text-shadow)",
  };

  // ---- PILL -------------------------------------------------------------
  if (params.variant === "pill") {
    return (
      <WidgetShell params={params} bare>
        {pulseKeyframes}
        <div
          className="inline-flex items-center gap-2.5 rounded-full px-4 py-2"
          style={containerStyle()}
        >
          {chip(13, true)}
          <span className="text-sm font-semibold leading-none" style={labelStyle}>
            {label}
          </span>
          {message && (
            <>
              <span
                className="h-1 w-1 rounded-full"
                style={{ background: hexToRgba(textDim, 0.6) }}
              />
              <span className="text-sm leading-none" style={{ color: textDim }}>
                {message}
              </span>
            </>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ---- BANNER -----------------------------------------------------------
  if (params.variant === "banner") {
    return (
      <WidgetShell params={params} bare>
        {pulseKeyframes}
        <div
          className="flex w-full max-w-[460px] items-center gap-3 rounded-2xl px-5 py-3.5"
          style={containerStyle()}
        >
          {chip(18, true)}
          <span className="text-base font-semibold leading-tight" style={labelStyle}>
            {label}
          </span>
          {message && (
            <span
              className="ml-auto truncate text-sm leading-tight"
              style={{ color: textDim }}
              title={message}
            >
              {message}
            </span>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ---- CARD (default) ---------------------------------------------------
  return (
    <WidgetShell params={params}>
      {pulseKeyframes}
      <div className="flex flex-col items-center px-6 text-center">
        {chip(56, true)}
        <div className="mt-5 text-xl font-semibold tracking-tight" style={labelStyle}>
          {label}
        </div>
        {message ? (
          <div className="mt-1.5 max-w-[260px] text-sm leading-snug" style={{ color: textDim }}>
            {message}
          </div>
        ) : (
          <div className="mt-1.5 text-xs" style={{ color: textFaint }}>
            {isKo ? "현재 상태" : "Current status"}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
