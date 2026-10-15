"use client";

import type { CSSProperties, ReactNode } from "react";
import { resolveColors, type ResolvedColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { StopwatchParams } from "./schema";
import { useStopwatch } from "./use-stopwatch";

type Labels = {
  start: string;
  pause: string;
  resume: string;
  reset: string;
  lap: string;
};

const LABELS: Record<string, Labels> = {
  en: { start: "Start", pause: "Pause", resume: "Resume", reset: "Reset", lap: "Lap" },
  ko: { start: "시작", pause: "일시정지", resume: "다시 시작", reset: "초기화", lap: "랩" },
  ja: { start: "開始", pause: "一時停止", resume: "再開", reset: "リセット", lap: "ラップ" },
  zh: { start: "开始", pause: "暂停", resume: "继续", reset: "重置", lap: "计次" },
  de: { start: "Start", pause: "Pause", resume: "Weiter", reset: "Zurücksetzen", lap: "Runde" },
  fr: { start: "Départ", pause: "Pause", resume: "Reprendre", reset: "Réinit.", lap: "Tour" },
  es: { start: "Iniciar", pause: "Pausar", resume: "Reanudar", reset: "Reiniciar", lap: "Vuelta" },
};

function getLabels(locale: string): Labels {
  return LABELS[locale.slice(0, 2)] ?? LABELS.en;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Split elapsed ms into the main clock string and the two-digit centiseconds. */
function formatTime(ms: number): { main: string; centi: string } {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const centi = Math.floor((ms % 1000) / 10);
  const main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return { main, centi: pad(centi) };
}

function PlayIcon({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4.5 3.2v9.6a.6.6 0 0 0 .92.5l7.3-4.8a.6.6 0 0 0 0-1l-7.3-4.8a.6.6 0 0 0-.92.5Z" fill={color} />
    </svg>
  );
}

function PauseIcon({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="4" y="3" width="3" height="10" rx="1" fill={color} />
      <rect x="9" y="3" width="3" height="10" rx="1" fill={color} />
    </svg>
  );
}

function ResetIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8a4.5 4.5 0 1 1 1.4 3.26"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M3.2 4.6v2.9h2.9" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function FlagIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 2v12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M4 2.8h7.6a.5.5 0 0 1 .4.8l-1.6 2.1 1.6 2.1a.5.5 0 0 1-.4.8H4" fill={color} opacity={0.9} />
    </svg>
  );
}

interface TimeDisplayProps {
  ms: number;
  showCenti: boolean;
  colors: ResolvedColors;
  isNeon: boolean;
  size: "sm" | "md" | "lg";
}

function TimeDisplay({ ms, showCenti, colors, isNeon, size }: TimeDisplayProps) {
  const { main, centi } = formatTime(ms);
  const text = `#${colors.text}`;
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;

  const mainSize = { sm: 28, md: 52, lg: 68 }[size];
  const centiSize = { sm: 16, md: 26, lg: 34 }[size];

  const mainColor = isNeon ? accentBright : text;
  const centiColor = accent;

  return (
    <div
      className="flex items-baseline justify-center"
      style={{
        gap: showCenti ? Math.round(mainSize * 0.06) : 0,
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum" 1',
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontSize: mainSize,
          fontWeight: isNeon ? 500 : 650,
          color: mainColor,
          letterSpacing: isNeon ? "1px" : "-0.01em",
          textShadow: isNeon
            ? `0 0 10px ${accentBright}, 0 0 24px ${accent}88`
            : "var(--w-text-shadow)",
        }}
      >
        {main}
      </span>
      {showCenti && (
        <span
          style={{
            fontSize: centiSize,
            fontWeight: isNeon ? 500 : 600,
            color: centiColor,
            opacity: isNeon ? 0.95 : 0.85,
            textShadow: isNeon ? `0 0 8px ${accent}` : undefined,
          }}
        >
          .{centi}
        </span>
      )}
    </div>
  );
}

interface ControlBtnProps {
  onClick: () => void;
  colors: ResolvedColors;
  isNeon: boolean;
  variant: "primary" | "ghost";
  children: ReactNode;
  ariaLabel: string;
}

function ControlBtn({ onClick, colors, isNeon, variant, children, ariaLabel }: ControlBtnProps) {
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const btnText = `#${colors.btnText}`;
  const textDim = `#${colors.textDim}`;

  let style: CSSProperties;
  if (variant === "primary") {
    style = isNeon
      ? {
          background: "transparent",
          color: accentBright,
          border: `1.5px solid ${accent}`,
          textShadow: `0 0 8px ${accentBright}`,
          boxShadow: `0 0 10px ${accent}55, inset 0 0 8px ${accent}22`,
          letterSpacing: "1px",
        }
      : {
          background: accent,
          color: btnText,
          border: "none",
          boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
        };
  } else {
    style = isNeon
      ? {
          background: "transparent",
          color: textDim,
          border: `1px solid ${colors.border}`,
          letterSpacing: "1px",
        }
      : {
          background: "transparent",
          color: textDim,
          border: `1px solid #${colors.border}`,
        };
    if (isNeon) style.border = `1px solid #${colors.borderStrong}`;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="nw-sw-btn inline-flex items-center justify-center font-semibold"
      style={{
        ...style,
        gap: 7,
        fontSize: 13,
        padding: "9px 18px",
        borderRadius: isNeon ? 4 : 11,
        minWidth: variant === "primary" ? 112 : undefined,
      }}
    >
      {children}
    </button>
  );
}

const btnStyles = `
  .nw-sw-btn { cursor: pointer; transition: transform .12s ease, filter .15s ease, opacity .15s ease; }
  .nw-sw-btn:hover { filter: brightness(1.08); opacity: 1; }
  .nw-sw-btn:active { transform: scale(0.95); }
  .nw-sw-dot { animation: nw-sw-pulse 1.3s ease-in-out infinite; }
  @keyframes nw-sw-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.78); } }
`;

function RunningDot({ color, running }: { color: string; running: boolean }) {
  return (
    <span
      className={running ? "nw-sw-dot" : undefined}
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: running ? color : "transparent",
        border: running ? "none" : `1.5px solid ${color}`,
        opacity: running ? 1 : 0.4,
        boxShadow: running ? `0 0 8px ${color}` : "none",
      }}
    />
  );
}

export function StopwatchWidget({ params }: { params: StopwatchParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isNeon = params.style === "neon";
  const labels = getLabels(params.locale);

  const storageKey = `nw-stopwatch:${params.label || "default"}`;
  const { running, elapsed, laps, toggle, reset, lap } = useStopwatch(storageKey);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const btnText = `#${colors.btnText}`;

  const toggleLabel = running ? labels.pause : elapsed > 0 ? labels.resume : labels.start;
  const toggleIconColor = isNeon ? accentBright : btnText;

  // Shared label row (optional label + running status dot).
  const labelRow = (align: "center" | "left") =>
    params.label ? (
      <div
        className={`flex items-center ${align === "center" ? "justify-center" : ""}`}
        style={{ gap: 7 }}
      >
        <RunningDot color={accent} running={running} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: isNeon ? "2px" : "1.5px",
            textTransform: "uppercase",
            color: isNeon ? accent : textDim,
            textShadow: isNeon ? `0 0 8px ${accent}88` : undefined,
          }}
        >
          {params.label}
        </span>
      </div>
    ) : null;

  // ---- badge variant: compact pill ----------------------------------------
  if (params.variant === "badge") {
    const pillBg = isNeon
      ? "transparent"
      : colorMode === "dark"
        ? `#${colors.surface2}`
        : "#ffffff";
    const pillBorder = isNeon
      ? `1.5px solid ${accent}`
      : `1px solid #${colorMode === "dark" ? colors.borderSoft : colors.border}`;

    return (
      <WidgetShell params={params} bare>
        <style>{btnStyles}</style>
        <div
          className="inline-flex items-center"
          style={{
            gap: 14,
            padding: "12px 18px 12px 12px",
            borderRadius: isNeon ? 8 : 999,
            background: pillBg,
            border: pillBorder,
            boxShadow: isNeon
              ? `0 0 16px ${accent}44, inset 0 0 10px ${accent}18`
              : colorMode === "dark"
                ? "0 2px 14px rgba(0,0,0,0.25)"
                : "0 2px 16px rgba(0,0,0,0.07)",
          }}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={toggleLabel}
            className="nw-sw-btn inline-flex items-center justify-center"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              flexShrink: 0,
              background: isNeon ? "transparent" : accent,
              border: isNeon ? `1.5px solid ${accent}` : "none",
              boxShadow: isNeon
                ? `0 0 12px ${accent}66, inset 0 0 8px ${accent}22`
                : "0 2px 8px rgba(0,0,0,0.18)",
            }}
          >
            {running ? (
              <PauseIcon color={toggleIconColor} size={16} />
            ) : (
              <PlayIcon color={toggleIconColor} size={16} />
            )}
          </button>
          <div className="flex flex-col" style={{ gap: 2 }}>
            {params.label && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: isNeon ? "1.5px" : "1px",
                  textTransform: "uppercase",
                  color: isNeon ? accent : textDim,
                  textShadow: isNeon ? `0 0 6px ${accent}88` : undefined,
                }}
              >
                {params.label}
              </span>
            )}
            <TimeDisplay
              ms={elapsed}
              showCenti={params.showCenti}
              colors={colors}
              isNeon={isNeon}
              size="sm"
            />
          </div>
          <button
            type="button"
            onClick={reset}
            aria-label={labels.reset}
            className="nw-sw-btn inline-flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              flexShrink: 0,
              background: "transparent",
              border: "none",
              opacity: 0.65,
            }}
          >
            <ResetIcon color={isNeon ? accent : textDim} size={15} />
          </button>
        </div>
      </WidgetShell>
    );
  }

  // ---- laps variant -------------------------------------------------------
  if (params.variant === "laps") {
    // Compute per-lap splits and find fastest/slowest completed splits.
    const splits = laps.map((total, i) => total - (i > 0 ? laps[i - 1] : 0));
    let fastest = -1;
    let slowest = -1;
    if (splits.length > 1) {
      let min = Infinity;
      let max = -Infinity;
      splits.forEach((sp, i) => {
        if (sp < min) {
          min = sp;
          fastest = i;
        }
        if (sp > max) {
          max = sp;
          slowest = i;
        }
      });
    }

    return (
      <WidgetShell params={params}>
        <style>{btnStyles}</style>
        <div className="flex flex-col items-center w-full" style={{ gap: 18, maxWidth: 320 }}>
          {labelRow("center")}
          <TimeDisplay
            ms={elapsed}
            showCenti={params.showCenti}
            colors={colors}
            isNeon={isNeon}
            size="md"
          />
          <div className="flex items-center" style={{ gap: 9 }}>
            <ControlBtn onClick={toggle} colors={colors} isNeon={isNeon} variant="primary" ariaLabel={toggleLabel}>
              {running ? <PauseIcon color={toggleIconColor} /> : <PlayIcon color={toggleIconColor} />}
              {toggleLabel}
            </ControlBtn>
            <ControlBtn onClick={lap} colors={colors} isNeon={isNeon} variant="ghost" ariaLabel={labels.lap}>
              <FlagIcon color={isNeon ? accent : textDim} />
              {labels.lap}
            </ControlBtn>
            <ControlBtn onClick={reset} colors={colors} isNeon={isNeon} variant="ghost" ariaLabel={labels.reset}>
              <ResetIcon color={isNeon ? accent : textDim} />
            </ControlBtn>
          </div>

          {laps.length > 0 && (
            <div
              className="w-full flex flex-col"
              style={{
                gap: 2,
                maxHeight: 132,
                overflowY: "auto",
                borderTop: `1px solid #${isNeon ? colors.borderStrong : colors.border}`,
                paddingTop: 8,
              }}
            >
              {laps
                .map((total, i) => ({ total, split: splits[i], i }))
                .reverse()
                .map(({ total, split, i }) => {
                  const isFast = i === fastest;
                  const isSlow = i === slowest;
                  const splitColor = isFast ? accent : isSlow ? `#${colors.textFaint}` : text;
                  const sp = formatTime(split);
                  const tp = formatTime(total);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                      style={{
                        fontSize: 12.5,
                        padding: "4px 2px",
                        fontVariantNumeric: "tabular-nums",
                        fontFeatureSettings: '"tnum" 1',
                      }}
                    >
                      <span style={{ color: textDim, fontWeight: 600, minWidth: 44 }}>
                        {isNeon ? "#" : ""}
                        {labels.lap} {i + 1}
                      </span>
                      <span
                        style={{
                          color: splitColor,
                          fontWeight: 650,
                          textShadow: isNeon && isFast ? `0 0 8px ${accent}` : undefined,
                        }}
                      >
                        {sp.main}
                        {params.showCenti && <span style={{ opacity: 0.7 }}>.{sp.centi}</span>}
                      </span>
                      <span style={{ color: `#${colors.textFaint}`, minWidth: 56, textAlign: "right" }}>
                        {tp.main}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ---- digits variant (default) -------------------------------------------
  return (
    <WidgetShell params={params}>
      <style>{btnStyles}</style>
      <div className="flex flex-col items-center" style={{ gap: 20 }}>
        {labelRow("center")}
        <TimeDisplay
          ms={elapsed}
          showCenti={params.showCenti}
          colors={colors}
          isNeon={isNeon}
          size="lg"
        />
        <div className="flex items-center" style={{ gap: 10 }}>
          <ControlBtn onClick={toggle} colors={colors} isNeon={isNeon} variant="primary" ariaLabel={toggleLabel}>
            {running ? <PauseIcon color={toggleIconColor} /> : <PlayIcon color={toggleIconColor} />}
            {toggleLabel}
          </ControlBtn>
          <ControlBtn onClick={reset} colors={colors} isNeon={isNeon} variant="ghost" ariaLabel={labels.reset}>
            <ResetIcon color={isNeon ? accent : textDim} />
            {labels.reset}
          </ControlBtn>
        </div>
      </div>
    </WidgetShell>
  );
}
