"use client";

import { useEffect, useRef, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { useTyping } from "./use-typing";
import {
  makeWordStream,
  getDailyPassage,
  getTypingStrings,
  WORD_COUNTS,
} from "./content";
import type { TypingTestParams } from "./schema";

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const MONO = "var(--font-geist-mono, 'SF Mono', 'Menlo', 'Consolas', monospace)";

export function TypingTestWidget({ params }: { params: TypingTestParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const t = getTypingStrings(params.locale);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  // Semantic "mistake" color — a data signal (like the palette widget's swatches),
  // tuned to read on both grounds; all chrome still comes from resolveColors.
  const errorColor = isDark ? "#f2777a" : "#d64545";

  const [mounted, setMounted] = useState(false);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    if (params.variant === "quote") setTarget(getDailyPassage());
    else setTarget(makeWordStream(WORD_COUNTS[params.length]));
  }, [mounted, params.variant, params.length, round]);

  const { typed, status, setValue, reset, wpm, accuracy, elapsedSec } = useTyping(target);

  const restart = () => {
    reset();
    setRound((r) => r + 1);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const glow = (c: string) => (isNeon ? `drop-shadow(0 0 5px ${c})` : undefined);
  const progress = target.length ? Math.min(1, typed.length / target.length) : 0;

  const variantLabel =
    params.variant === "quote" ? "quote" : params.variant === "zen" ? "zen" : "words";

  // ─── Character stream with caret ───
  const chars = target.split("");
  const caretIdx = typed.length;
  const showCaret = focused && status !== "done";

  const caretEl = (
    <span
      key="caret"
      aria-hidden
      style={{
        display: "inline-block",
        width: 0,
        borderLeft: `2px solid ${isNeon ? accentBright : accent}`,
        height: "1.1em",
        marginLeft: -1,
        marginRight: -1,
        transform: "translateY(2px)",
        animation: "nw-caret-blink 1s step-end infinite",
        filter: glow(accent),
      }}
    />
  );

  const rendered: React.ReactNode[] = [];
  chars.forEach((ch, i) => {
    if (showCaret && i === caretIdx) rendered.push(caretEl);
    const isSpace = ch === " ";
    let color = textFaint;
    let bg: string | undefined;
    let underline = false;
    if (i < typed.length) {
      if (typed[i] === ch) {
        color = isNeon ? accentBright : accent;
      } else {
        color = errorColor;
        if (isSpace) {
          bg = hexToRgba(errorColor, 0.28);
          underline = true;
        }
      }
    }
    rendered.push(
      <span
        key={i}
        style={{
          color,
          background: bg,
          borderRadius: bg ? 2 : undefined,
          textDecoration: underline ? "underline" : undefined,
          filter: i < typed.length && typed[i] === ch ? glow(accent) : undefined,
          transition: "color 0.05s linear",
        }}
      >
        {isSpace ? " " : ch}
      </span>,
    );
  });
  if (showCaret && caretIdx >= chars.length) rendered.push(caretEl);

  // ─── Stat pieces ───
  const statBlock = (value: string, label: string, big = false) => (
    <div className="flex flex-col items-center" style={{ gap: 1 }}>
      <span
        className="font-bold tabular-nums leading-none"
        style={{
          fontSize: big ? 30 : 18,
          color: isNeon ? accentBright : accent,
          fontFamily: MONO,
          textShadow: "var(--w-text-shadow)",
          filter: big ? glow(accent) : undefined,
        }}
      >
        {value}
      </span>
      <span
        className="uppercase"
        style={{ fontSize: 9, letterSpacing: "0.08em", color: textFaint, fontFamily: isNeon ? MONO : undefined }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <WidgetShell params={params}>
      <style>{`@keyframes nw-caret-blink { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
      <div className="flex flex-col" style={{ width: 300, gap: 12 }}>
        {/* header / live line */}
        <div className="flex items-center justify-between" style={{ height: 18 }}>
          <span
            className="uppercase font-semibold"
            style={{ fontSize: 10, letterSpacing: "0.12em", color: textDim, fontFamily: isNeon ? MONO : undefined }}
          >
            {isNeon ? `> ${variantLabel}` : variantLabel}
          </span>
          {status === "running" && params.showLive && (
            <span className="tabular-nums font-semibold" style={{ fontSize: 12, color: isNeon ? accentBright : accent, fontFamily: MONO }}>
              {wpm} {t.live} · {elapsedSec.toFixed(0)}s
            </span>
          )}
        </div>

        {/* typing surface */}
        <div
          className="relative select-none"
          onMouseDown={(e) => {
            if (e.target !== inputRef.current) {
              e.preventDefault();
              inputRef.current?.focus();
            }
          }}
          style={{
            fontFamily: MONO,
            fontSize: 16,
            lineHeight: 1.65,
            letterSpacing: "0.02em",
            padding: "14px 16px",
            minHeight: 96,
            borderRadius: 12,
            cursor: "text",
            background: isNeon ? hexToRgba(colors.accent, 0.06) : hexToRgba(colors.text, isDark ? 0.05 : 0.035),
            border: `1px solid ${focused ? hexToRgba(colors.accent, isNeon ? 0.6 : 0.45) : hexToRgba(colors.text, 0.08)}`,
            boxShadow: focused ? `0 0 0 3px ${hexToRgba(colors.accent, 0.12)}` : undefined,
          }}
        >
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Tab") e.preventDefault();
            }}
            disabled={status === "done"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Typing test input"
            className="absolute inset-0 w-full h-full m-0 p-0 border-0 bg-transparent"
            style={{ color: "transparent", caretColor: "transparent", outline: "none", cursor: "text", fontFamily: MONO }}
          />
          <div
            aria-hidden
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "normal",
              overflowWrap: "break-word",
              filter: mounted && (focused || status === "done") ? undefined : "blur(2.5px)",
              opacity: mounted ? 1 : 0.4,
              transition: "filter 0.15s ease",
              pointerEvents: "none",
            }}
          >
            {mounted && target ? rendered : " "}
          </div>
          {mounted && !focused && status !== "done" && (
            <div className="absolute inset-0 flex items-center justify-center text-center" style={{ padding: 12, pointerEvents: "none" }}>
              <span style={{ fontSize: 12, color: textDim, fontFamily: isNeon ? MONO : undefined }}>
                {status === "running" ? t.hintFocus : t.hintIdle}
              </span>
            </div>
          )}
        </div>

        {/* footer: progress (idle/running) or results (done) */}
        {status === "done" ? (
          <div className="flex flex-col items-center" style={{ gap: 10 }}>
            <div className="flex items-center justify-center" style={{ gap: 22 }}>
              {statBlock(String(wpm), t.wpm, true)}
              {statBlock(`${accuracy}%`, t.acc)}
              {statBlock(`${elapsedSec.toFixed(1)}s`, t.time)}
            </div>
            <button
              type="button"
              onClick={restart}
              className="font-semibold transition-transform active:scale-95"
              style={{
                fontSize: 12,
                padding: "7px 20px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: isNeon ? MONO : undefined,
                color: isNeon ? accentBright : `#${colors.btnText}`,
                background: isNeon ? "transparent" : accent,
                border: `1.5px solid ${isNeon ? accentBright : accent}`,
                boxShadow: isNeon ? `0 0 8px ${hexToRgba(colors.accentBright, 0.5)}` : undefined,
              }}
            >
              {isNeon ? `> ${t.restart}` : t.restart}
            </button>
          </div>
        ) : (
          <div className="flex items-center" style={{ gap: 10, height: 18 }}>
            <div className="flex-1 overflow-hidden" style={{ height: 4, borderRadius: 999, background: isNeon ? hexToRgba(colors.accent, 0.15) : track }}>
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: isNeon ? accentBright : accent,
                  filter: glow(accent),
                  transition: "width 0.1s linear",
                }}
              />
            </div>
            <span className="tabular-nums" style={{ fontSize: 10, color: textFaint, fontFamily: MONO }}>
              {typed.length}/{target.length}
            </span>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
