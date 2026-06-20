"use client";

import { useState, useEffect } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { DailyTarotParams } from "./schema";
import { getDailySpread, type SpreadCard } from "./tarot-cards";

/* ─── Mini Card SVG ─── */

function MiniCardArt({
  number,
  accent,
  isMajor,
  reversed,
}: {
  number: string;
  accent: string;
  isMajor: boolean;
  reversed: boolean;
}) {
  const w = 100;
  const h = 140;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={reversed ? { transform: "rotate(180deg)" } : undefined}
    >
      <rect
        x="2" y="2" width={w - 4} height={h - 4} rx="8"
        fill={accent + "08"} stroke={accent} strokeWidth="1" opacity="0.3"
      />
      <rect
        x="8" y="8" width={w - 16} height={h - 16} rx="5"
        fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15"
      />

      {isMajor ? (
        <>
          <circle cx={cx} cy={cy} r="20" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.25" />
          <circle cx={cx} cy={cy} r="10" fill={accent} opacity="0.12" />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={cx + Math.cos(rad) * 12} y1={cy + Math.sin(rad) * 12}
                x2={cx + Math.cos(rad) * 24} y2={cy + Math.sin(rad) * 24}
                stroke={accent} strokeWidth="0.5" opacity="0.2"
              />
            );
          })}
        </>
      ) : (
        <>
          <rect
            x={cx - 14} y={cy - 14} width="28" height="28" rx="2"
            fill={accent} opacity="0.08"
            transform={`rotate(45, ${cx}, ${cy})`}
          />
          <rect
            x={cx - 8} y={cy - 8} width="16" height="16" rx="1"
            fill="none" stroke={accent} strokeWidth="0.8" opacity="0.25"
            transform={`rotate(45, ${cx}, ${cy})`}
          />
        </>
      )}

      <text x="14" y="24" fill={accent} fontSize="11" fontWeight="bold" fontFamily="serif" opacity="0.6">
        {number}
      </text>
      <text
        x={w - 14} y={h - 14} fill={accent} fontSize="11" fontWeight="bold"
        fontFamily="serif" opacity="0.6" textAnchor="end"
        transform={`rotate(180, ${w - 14}, ${h - 18})`}
      >
        {number}
      </text>
    </svg>
  );
}

/* ─── Card Back SVG ─── */

function CardBack({ accent }: { accent: string }) {
  const w = 100;
  const h = 140;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect
        x="2" y="2" width={w - 4} height={h - 4} rx="8"
        fill={accent + "15"} stroke={accent} strokeWidth="1" opacity="0.4"
      />
      <line x1={cx - 20} y1={cy - 20} x2={cx + 20} y2={cy + 20} stroke={accent} strokeWidth="0.5" opacity="0.2" />
      <line x1={cx + 20} y1={cy - 20} x2={cx - 20} y2={cy + 20} stroke={accent} strokeWidth="0.5" opacity="0.2" />
      <circle cx={cx} cy={cy} r="16" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.3" />
      <circle cx={cx} cy={cy} r="6" fill={accent} opacity="0.2" />
    </svg>
  );
}

/* ─── Single Spread Card ─── */

function SpreadCardView({
  spread,
  accent,
  isKo,
  flipped,
  offset,
}: {
  spread: SpreadCard;
  accent: string;
  isKo: boolean;
  flipped: boolean;
  offset: number;
}) {
  const { card, positionLabel, positionLabelKo, reversed } = spread;
  const name = isKo ? card.nameKo : card.name;
  const keywords = (isKo ? card.keywordsKo : card.keywords).split(", ");
  const posLabel = isKo ? positionLabelKo : positionLabel;
  const reversedLabel = reversed ? (isKo ? " (역)" : " (Rev)") : "";

  return (
    <div
      className="flex flex-col items-center gap-2"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: accent, opacity: 0.5 }}
      >
        {posLabel}
      </div>

      <div className="relative" style={{ width: 100, height: 140, perspective: "600px" }}>
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <CardBack accent={accent} />
          </div>
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <MiniCardArt number={card.number} accent={accent} isMajor={card.isMajor} reversed={reversed} />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-1 transition-opacity duration-500"
        style={{ opacity: flipped ? 1 : 0 }}
      >
        <div className="text-xs font-bold text-center leading-tight" style={{ color: accent }}>
          {name}{reversedLabel}
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {keywords.map((kw, i) => (
            <span
              key={i}
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: accent + "18", color: accent, opacity: 0.8 }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Interpretation Panel ─── */

function InterpretationPanel({
  spread,
  accent,
  isKo,
  visible,
}: {
  spread: SpreadCard[];
  accent: string;
  isKo: boolean;
  visible: boolean;
}) {
  return (
    <div
      className="w-full max-w-sm transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <div className="h-px w-full mb-4" style={{ backgroundColor: accent + "25" }} />
      <div className="space-y-4 px-1">
        {spread.map((s) => {
          const name = isKo ? s.card.nameKo : s.card.name;
          const posLabel = isKo ? s.positionLabelKo : s.positionLabel;
          const meaning = isKo ? s.card.meaningKo : s.card.meaning;
          const advice = isKo ? s.card.adviceKo : s.card.advice;
          const reversedLabel = s.reversed ? (isKo ? " (역)" : " (Rev.)") : "";

          return (
            <div key={s.position}>
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: accent, opacity: 0.45 }}
                >
                  {posLabel}
                </span>
                <span style={{ color: accent, opacity: 0.25, fontSize: "9px" }}>·</span>
                <span className="text-[11px] font-semibold" style={{ color: accent }}>
                  {name}{reversedLabel}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: accent, opacity: 0.65 }}>
                {meaning}
              </p>
              <p className="text-[10px] leading-relaxed mt-0.5" style={{ color: accent, opacity: 0.9 }}>
                <span style={{ opacity: 0.45 }}>▸ </span>
                {advice}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Widget ─── */

export function DailyTarotWidget({ params }: { params: DailyTarotParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const accentColor = `#${colors.accent}`;
  const spread = getDailySpread(params.deck);
  const isKo = params.locale.startsWith("ko");
  const todayLabel = isKo ? "오늘의 타로" : "Today's Tarot";

  const [flipped, setFlipped] = useState([false, false, false]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setFlipped((p) => [true, p[1], p[2]]), 400),
      setTimeout(() => setFlipped((p) => [p[0], true, p[2]]), 900),
      setTimeout(() => setFlipped((p) => [p[0], p[1], true]), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isDetailed = params.variant === "detailed";
  const allFlipped = flipped[2];

  const cardRow = (
    <div className="flex items-start justify-center gap-4">
      {spread.map((s, i) => (
        <SpreadCardView
          key={s.position}
          spread={s}
          accent={accentColor}
          isKo={isKo}
          flipped={flipped[i]}
          offset={i === 1 ? -8 : 0}
        />
      ))}
    </div>
  );

  // Neon style
  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <div
          className="flex flex-col items-center gap-4 px-4 py-3 w-full max-w-sm"
          style={{ fontFamily: "monospace" }}
        >
          <div
            style={{
              fontSize: "10px",
              color: accentColor,
              opacity: 0.5,
              letterSpacing: "3px",
            }}
          >
            {todayLabel.toUpperCase()}
          </div>
          {cardRow}
          {isDetailed && (
            <InterpretationPanel spread={spread} accent={accentColor} isKo={isKo} visible={allFlipped} />
          )}
        </div>
      </WidgetShell>
    );
  }

  // All other styles (minimal, soft, glass)
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-4 px-4 py-3 w-full max-w-sm">
        <div
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: accentColor, opacity: 0.5 }}
        >
          {todayLabel}
        </div>
        {cardRow}
        {isDetailed && (
          <InterpretationPanel spread={spread} accent={accentColor} isKo={isKo} visible={allFlipped} />
        )}
      </div>
    </WidgetShell>
  );
}
