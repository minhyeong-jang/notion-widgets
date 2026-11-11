"use client";

import { useEffect, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { WordOfDayParams } from "./schema";
import { WORDS, type VocabWord, type PartOfSpeech } from "./words";

type Labels = {
  title: string;
  pos: Record<PartOfSpeech, string>;
};

const LABELS: Record<string, Labels> = {
  en: {
    title: "Word of the Day",
    pos: { noun: "noun", verb: "verb", adjective: "adjective", adverb: "adverb", idiom: "idiom" },
  },
  ko: {
    title: "오늘의 단어",
    pos: { noun: "명사", verb: "동사", adjective: "형용사", adverb: "부사", idiom: "숙어" },
  },
  ja: {
    title: "今日の単語",
    pos: { noun: "名詞", verb: "動詞", adjective: "形容詞", adverb: "副詞", idiom: "熟語" },
  },
  zh: {
    title: "每日单词",
    pos: { noun: "名词", verb: "动词", adjective: "形容词", adverb: "副词", idiom: "习语" },
  },
};

function labelsFor(locale: string): Labels {
  return LABELS[locale.slice(0, 2)] ?? LABELS.en;
}

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function pickWord(rotation: "daily" | "random"): VocabWord {
  if (rotation === "random") {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return WORDS[dayOfYear() % WORDS.length];
}

export function WordOfDayWidget({ params }: { params: WordOfDayParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const tint = `#${colors.accentTint}`;

  const isKo = params.locale.slice(0, 2) === "ko";
  const L = labelsFor(params.locale);
  const isNeon = params.style === "neon";
  const variant = params.variant;

  // Gate selection behind mount: the "daily" index depends on today's date and
  // "random" uses Math.random — both would mismatch the static SSR render.
  const [word, setWord] = useState<VocabWord | null>(null);
  useEffect(() => {
    setWord(pickWord(params.rotation));
  }, [params.rotation]);

  const w = word ?? WORDS[0];
  const ready = word !== null;

  // Primary gloss = native-language meaning; secondary = English definition.
  const primaryGloss = isKo ? w.ko : w.en;
  const secondaryGloss = isKo ? w.en : null;

  const showPhonetic = params.showPhonetic && variant !== "poster";
  const showExample = params.showExample && variant === "dictionary";
  const showMeaning = params.showMeaning;
  const showTitle = variant !== "simple";

  const monoFont = "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

  // ----- Neon (terminal) rendering -----
  if (isNeon) {
    return (
      <WidgetShell params={params}>
        <style>{`
          @keyframes nw-wod-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        `}</style>
        <div
          className="text-left px-8 w-full"
          style={{
            maxWidth: 460,
            margin: "0 auto",
            fontFamily: monoFont,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          {showTitle && (
            <div style={{ color: accent, opacity: 0.6, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
              {`> ${L.title}`}
            </div>
          )}
          <div className="flex items-baseline" style={{ gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                color: accentBright,
                fontSize: variant === "poster" ? 44 : 34,
                fontWeight: 700,
                textShadow: `0 0 14px ${accentBright}99, 0 0 2px ${accentBright}`,
                lineHeight: 1.1,
              }}
            >
              {w.word}
            </span>
            <span
              aria-hidden
              style={{ color: accentBright, fontSize: 26, animation: "nw-wod-blink 1s step-end infinite", textShadow: `0 0 12px ${accentBright}` }}
            >
              _
            </span>
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {showPhonetic && (
              <span style={{ color: accent, opacity: 0.7, fontSize: 14 }}>{w.phonetic}</span>
            )}
            <span style={{ color: accent, opacity: 0.85, fontSize: 12, border: `1px solid ${accent}`, padding: "1px 7px", borderRadius: 3 }}>
              {L.pos[w.pos]}
            </span>
          </div>
          {showMeaning && (
            <div style={{ marginTop: 14, color: accentBright, opacity: 0.92, fontSize: variant === "poster" ? 20 : 17, lineHeight: 1.5 }}>
              {primaryGloss}
            </div>
          )}
          {showMeaning && secondaryGloss && variant !== "simple" && (
            <div style={{ marginTop: 4, color: accent, opacity: 0.55, fontSize: 13, lineHeight: 1.5 }}>
              {secondaryGloss}
            </div>
          )}
          {showExample && (
            <div style={{ marginTop: 14, color: accent, opacity: 0.6, fontSize: 13, lineHeight: 1.6, paddingLeft: 12, borderLeft: `2px solid ${accent}` }}>
              {`"${w.example}"`}
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ----- Minimal / Soft / Glass rendering -----
  const wordSize = variant === "poster" ? 52 : variant === "simple" ? 34 : 42;
  const meaningSize = variant === "poster" ? 22 : variant === "simple" ? 17 : 19;

  return (
    <WidgetShell params={params}>
      <div
        className="flex flex-col items-center text-center"
        style={{
          padding: "6px 16px",
          maxWidth: 440,
          width: "100%",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        {showTitle && (
          <div
            style={{
              color: accent,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              marginBottom: 12,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {L.title}
          </div>
        )}

        <div
          className="font-bold"
          style={{
            color: text,
            fontSize: wordSize,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            textShadow: "var(--w-text-shadow)",
          }}
        >
          {w.word}
        </div>

        <div className="flex items-center justify-center" style={{ gap: 9, marginTop: 10, flexWrap: "wrap" }}>
          {showPhonetic && (
            <span style={{ color: textFaint, fontSize: 14, letterSpacing: "0.01em" }}>{w.phonetic}</span>
          )}
          <span
            style={{
              color: accent,
              backgroundColor: tint,
              fontSize: 11.5,
              fontWeight: 600,
              padding: "2px 9px",
              borderRadius: 999,
              letterSpacing: "0.02em",
            }}
          >
            {L.pos[w.pos]}
          </span>
        </div>

        {/* accent divider */}
        <div style={{ width: 36, height: 3, borderRadius: 2, backgroundColor: accent, opacity: 0.85, margin: "16px 0 14px" }} />

        {showMeaning && (
          <div
            style={{
              color: text,
              fontSize: meaningSize,
              fontWeight: 500,
              lineHeight: 1.45,
              opacity: 0.92,
            }}
          >
            {primaryGloss}
          </div>
        )}
        {showMeaning && secondaryGloss && variant !== "simple" && (
          <div style={{ color: textDim, fontSize: 14, lineHeight: 1.45, marginTop: 6 }}>
            {secondaryGloss}
          </div>
        )}

        {showExample && (
          <div
            style={{
              color: textDim,
              fontSize: 13.5,
              fontStyle: "italic",
              lineHeight: 1.55,
              marginTop: 16,
              paddingLeft: 12,
              borderLeft: `2px solid ${accent}`,
              textAlign: "left",
              maxWidth: 380,
            }}
          >
            {`“${w.example}”`}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
