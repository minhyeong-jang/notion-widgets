"use client";

import type { CSSProperties, ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { parseEvents, type EventStatus, type TimelineParams } from "./schema";

const STRINGS: Record<string, { done: string }> = {
  ko: { done: "완료" },
  en: { done: "done" },
  ja: { done: "完了" },
  zh: { done: "完成" },
  de: { done: "fertig" },
  fr: { done: "terminé" },
  es: { done: "hecho" },
};

interface Palette {
  accent: string;
  accentBright: string;
  accentDeep: string;
  accentDim: string;
  accentTint: string;
  text: string;
  textDim: string;
  textFaint: string;
  track: string;
  border: string;
  borderStrong: string;
  surfaceCard: string;
  isNeon: boolean;
  isDark: boolean;
}

/** Color of the connector segment, given the status of the event it flows out of. */
function connectorColor(fromStatus: EventStatus | null, p: Palette): string {
  if (fromStatus === "done") return p.isNeon ? p.accentBright : p.accent;
  return p.isNeon ? `${p.accent}33` : p.track;
}

function CheckIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.2 4.2L19 7"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Render a status dot. `axis` controls glow direction hints only. */
function Dot({ status, p }: { status: EventStatus; p: Palette }) {
  const base: CSSProperties = {
    borderRadius: "50%",
    flexShrink: 0,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (status === "done") {
    const sz = 16;
    return (
      <div
        style={{
          ...base,
          width: sz,
          height: sz,
          backgroundColor: p.isNeon ? "transparent" : p.accent,
          border: p.isNeon ? `2px solid ${p.accentBright}` : "none",
          boxShadow: p.isNeon ? `0 0 8px ${p.accentBright}` : "none",
        }}
      >
        <CheckIcon color={p.isNeon ? p.accentBright : p.surfaceCard} size={11} />
      </div>
    );
  }

  if (status === "active") {
    const sz = 18;
    return (
      <div
        style={{
          ...base,
          width: sz,
          height: sz,
          backgroundColor: p.isNeon ? p.accentBright : p.accentBright,
          boxShadow: p.isNeon
            ? `0 0 0 4px ${p.accentTint}, 0 0 14px ${p.accentBright}`
            : `0 0 0 4px ${p.accentTint}`,
          animation: "nw-tl-pulse 1.8s ease-in-out infinite",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: p.isNeon ? "#000" : p.surfaceCard,
            opacity: p.isNeon ? 0.5 : 0.9,
          }}
        />
      </div>
    );
  }

  // upcoming
  const sz = 14;
  return (
    <div
      style={{
        ...base,
        width: sz,
        height: sz,
        backgroundColor: p.isNeon ? "transparent" : p.surfaceCard,
        border: `2px solid ${p.isNeon ? `${p.accent}66` : p.borderStrong}`,
      }}
    />
  );
}

function labelStyle(status: EventStatus, p: Palette): CSSProperties {
  if (p.isNeon) {
    return {
      color: status === "upcoming" ? `${p.accent}99` : p.accentBright,
      fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
      textShadow: status === "active" ? `0 0 8px ${p.accentBright}` : "none",
      letterSpacing: "0.02em",
    };
  }
  return {
    color:
      status === "upcoming"
        ? p.textFaint
        : status === "active"
          ? p.text
          : p.textDim,
  };
}

function dateStyle(status: EventStatus, p: Palette): CSSProperties {
  if (p.isNeon) {
    return {
      color: status === "active" ? p.accentBright : `${p.accent}88`,
      fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
    };
  }
  return { color: status === "active" ? p.accent : p.textFaint };
}

export function TimelineWidget({ params }: { params: TimelineParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  // Card surface used as the "hole" color for done check / upcoming dot fill,
  // so dots read correctly on whatever background sits behind them.
  const surfaceCard =
    params.style === "soft" || params.style === "glass"
      ? isDark
        ? `#${colors.surface2}`
        : "#ffffff"
      : `#${colors.bg}`;

  const p: Palette = {
    accent: `#${colors.accent}`,
    accentBright: `#${colors.accentBright}`,
    accentDeep: `#${colors.accentDeep}`,
    accentDim: `#${colors.accentDim}`,
    accentTint: `#${colors.accentTint}`,
    text: `#${colors.text}`,
    textDim: `#${colors.textDim}`,
    textFaint: `#${colors.textFaint}`,
    track: `#${colors.track}`,
    border: `#${colors.border}`,
    borderStrong: `#${colors.borderStrong}`,
    surfaceCard,
    isNeon,
    isDark,
  };

  const events = parseEvents(params.items);
  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;
  const doneCount = events.filter((e) => e.status === "done").length;

  const keyframes = (
    <style>{`
      @keyframes nw-tl-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.12); }
      }
    `}</style>
  );

  const header =
    params.title.trim().length > 0 ? (
      <div
        className="flex items-baseline justify-between gap-3"
        style={{ marginBottom: 18 }}
      >
        <span
          className="text-[12px] font-semibold uppercase"
          style={{
            color: isNeon ? p.accentBright : p.textDim,
            letterSpacing: isNeon ? "2px" : "0.08em",
            fontFamily: isNeon
              ? "var(--font-geist-mono, 'Courier New', monospace)"
              : undefined,
            textShadow: isNeon ? `0 0 8px ${p.accentBright}` : "none",
          }}
        >
          {isNeon ? `> ${params.title}` : params.title}
        </span>
        {events.length > 0 && (
          <span
            className="text-[11px] font-medium tabular-nums"
            style={{
              color: isNeon ? `${p.accent}aa` : p.textFaint,
              fontFamily: isNeon
                ? "var(--font-geist-mono, 'Courier New', monospace)"
                : undefined,
            }}
          >
            {doneCount}/{events.length} {t.done}
          </span>
        )}
      </div>
    ) : null;

  let body: ReactNode;

  if (params.variant === "horizontal") {
    body = (
      <div className="flex w-full" style={{ gap: 0 }}>
        {events.map((e, i) => {
          const leftColor = connectorColor(
            i === 0 ? null : events[i - 1].status,
            p,
          );
          const rightColor = connectorColor(e.status, p);
          return (
            <div
              key={i}
              className="flex flex-col items-center text-center"
              style={{ flex: "1 1 0", minWidth: 0 }}
            >
              <div
                className="flex items-center justify-center w-full"
                style={{ height: 20 }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: i === 0 ? "transparent" : leftColor,
                    borderRadius: 2,
                  }}
                />
                <div style={{ margin: "0 6px" }}>
                  <Dot status={e.status} p={p} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      i === events.length - 1 ? "transparent" : rightColor,
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                className="text-[13px] font-semibold leading-tight"
                style={{ ...labelStyle(e.status, p), marginTop: 10 }}
              >
                {e.label}
              </div>
              {params.showDate && e.date && (
                <div
                  className="text-[11px] font-medium leading-tight"
                  style={{ ...dateStyle(e.status, p), marginTop: 3 }}
                >
                  {e.date}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  } else {
    // vertical + compact share a rail-based layout
    const compact = params.variant === "compact";
    const railW = compact ? 20 : 28;
    const contentPadBottom = compact ? 8 : 16;

    body = (
      <div className="w-full">
        {events.map((e, i) => {
          const isLast = i === events.length - 1;
          const topColor = connectorColor(
            i === 0 ? null : events[i - 1].status,
            p,
          );
          const bottomColor = connectorColor(e.status, p);
          return (
            <div key={i} className="flex" style={{ minHeight: 0 }}>
              {/* rail */}
              <div
                className="flex flex-col items-center"
                style={{ width: railW, flexShrink: 0 }}
              >
                <div
                  style={{
                    width: 2,
                    height: compact ? 6 : 8,
                    backgroundColor: i === 0 ? "transparent" : topColor,
                    borderRadius: 2,
                  }}
                />
                <Dot status={e.status} p={p} />
                <div
                  style={{
                    width: 2,
                    flex: "1 1 auto",
                    minHeight: compact ? 4 : 6,
                    backgroundColor: isLast ? "transparent" : bottomColor,
                    borderRadius: 2,
                  }}
                />
              </div>
              {/* content */}
              <div
                className="flex-1 min-w-0"
                style={{
                  paddingLeft: compact ? 10 : 14,
                  paddingTop: compact ? 2 : 1,
                  paddingBottom: isLast ? 0 : contentPadBottom,
                }}
              >
                {compact ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className="text-[13px] font-semibold truncate"
                      style={labelStyle(e.status, p)}
                    >
                      {e.label}
                    </span>
                    {params.showDate && e.date && (
                      <span
                        className="text-[11px] font-medium tabular-nums flex-shrink-0"
                        style={dateStyle(e.status, p)}
                      >
                        {e.date}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    {params.showDate && e.date && (
                      <div
                        className="text-[11px] font-medium uppercase"
                        style={{
                          ...dateStyle(e.status, p),
                          letterSpacing: "0.06em",
                          marginBottom: 2,
                        }}
                      >
                        {e.date}
                      </div>
                    )}
                    <div
                      className="text-[15px] font-semibold leading-snug"
                      style={labelStyle(e.status, p)}
                    >
                      {e.label}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <WidgetShell params={params}>
      {keyframes}
      <div
        className="w-full"
        style={{
          maxWidth: params.variant === "horizontal" ? 460 : 340,
          margin: "0 auto",
          padding:
            params.style === "soft" || params.style === "glass"
              ? 0
              : "4px 8px",
        }}
      >
        {header}
        {body}
      </div>
    </WidgetShell>
  );
}
