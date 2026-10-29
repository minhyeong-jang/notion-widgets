"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { WordOfTheDayParams } from "./schema";
import { WORDS, POS_ABBR, POS_LABEL, type Word } from "./words";

const HEADER: Record<string, string> = {
  en: "Word of the Day",
  ko: "오늘의 단어",
  ja: "今日の単語",
  zh: "每日单词",
  de: "Wort des Tages",
  fr: "Mot du jour",
  es: "Palabra del día",
};

function getDailyIndex(len: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % len;
}

export function WordOfTheDayWidget({ params }: { params: WordOfTheDayParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const idx = params.mode === "random" ? Math.floor(Math.random() * WORDS.length) : getDailyIndex(WORDS.length);
  const entry: Word = WORDS[idx];

  const lang = params.locale.slice(0, 2);
  const header = HEADER[lang] ?? HEADER.en;
  const posLabel = (POS_LABEL[lang] ?? POS_LABEL.en)[entry.pos];
  const meaning = lang === "ko" ? entry.ko : entry.en;
  // For Korean learners the English definition is useful as a secondary gloss.
  const secondary = lang === "ko" ? entry.en : null;

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentTint = `#${colors.accentTint}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  const isNeon = params.style === "neon";
  const mono = isNeon ? "monospace" : undefined;
  const glow = isNeon ? `drop-shadow(0 0 6px ${accentBright})` : undefined;
  const isCompact = params.variant === "compact";

  const headerEl = (
    <div
      className="font-semibold"
      style={{
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: isNeon ? accent : textFaint,
        fontFamily: mono,
        opacity: isNeon ? 0.8 : 1,
      }}
    >
      {isNeon ? `> ${header}` : header}
    </div>
  );

  const wordEl = (
    <div
      className="font-bold leading-none"
      style={{
        fontSize: isCompact ? 32 : 40,
        color: isNeon ? accentBright : text,
        textShadow: "var(--w-text-shadow)",
        fontFamily: isNeon ? "monospace" : "var(--font-serif, Georgia, serif)",
        filter: glow,
        letterSpacing: isNeon ? "1px" : "-0.01em",
      }}
    >
      {isNeon ? entry.word.toLowerCase() : entry.word}
    </div>
  );

  const posBadge = (
    <span
      className="font-semibold"
      style={{
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: isNeon ? 3 : 999,
        color: isNeon ? accentBright : accent,
        backgroundColor: isNeon ? "transparent" : accentTint,
        border: isNeon ? `1px solid ${accent}` : `1px solid ${accent}33`,
        fontFamily: mono,
        fontStyle: "italic",
        whiteSpace: "nowrap",
      }}
    >
      {isNeon ? POS_ABBR[entry.pos] : posLabel}
    </span>
  );

  const meaningEl = (
    <span
      className="font-medium"
      style={{ fontSize: isCompact ? 15 : 17, color: isNeon ? accent : text, fontFamily: mono, lineHeight: 1.4 }}
    >
      {meaning}
    </span>
  );

  return (
    <WidgetShell params={params}>
      <div
        className="flex flex-col items-center text-center"
        style={{ gap: isCompact ? 10 : 14, padding: "8px 24px", maxWidth: 420 }}
      >
        {headerEl}
        {wordEl}

        <div className="flex items-center justify-center flex-wrap" style={{ gap: 8 }}>
          {posBadge}
          {meaningEl}
        </div>

        {!isCompact && secondary && (
          <div style={{ fontSize: 13, color: textDim, fontFamily: mono, lineHeight: 1.4 }}>{secondary}</div>
        )}

        {!isCompact && (
          <>
            <div
              style={{
                width: 40,
                height: 1,
                marginTop: 2,
                backgroundColor: isNeon ? accent : `${accent}55`,
                opacity: isNeon ? 0.5 : 1,
              }}
            />
            <p
              style={{
                fontSize: 14,
                color: isNeon ? accent : textDim,
                fontStyle: "italic",
                fontFamily: mono,
                lineHeight: 1.5,
                opacity: isNeon ? 0.75 : 1,
              }}
            >
              {isNeon ? `“${entry.example}”` : `“${entry.example}”`}
            </p>
          </>
        )}
      </div>
    </WidgetShell>
  );
}
