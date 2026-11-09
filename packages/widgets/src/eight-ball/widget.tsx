"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { EightBallParams } from "./schema";
import { getAnswers, getDailyAnswer, getEightBallStrings } from "./answers";

/* ─────────────────────────── helpers ─────────────────────────── */

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Scale answer type down as the phrase gets longer so it always fits. */
function fontForLen(len: number, big: number, mid: number, small: number): number {
  if (len <= 10) return big;
  if (len <= 20) return mid;
  return small;
}

const SHAKE_MS = 440;

/* ─────────────────────────── component ─────────────────────────── */

export function EightBallWidget({ params }: { params: EightBallParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const strings = getEightBallStrings(params.locale);
  const answers = getAnswers(params.locale);

  const isNeon = params.style === "neon";
  const isGlass = params.style === "glass";
  const isDark = mode === "dark";
  const variant = params.variant;

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const text = `#${colors.text}`;
  const textFaint = `#${colors.textFaint}`;
  const btnText = `#${colors.btnText}`;

  // Deterministic initial answer keeps SSR and first client paint identical.
  const [idx, setIdx] = useState(() => getDailyAnswer(answers));
  const [asking, setAsking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ask = useCallback(() => {
    if (asking) return;
    setAsking(true);
    timerRef.current = setTimeout(() => {
      setIdx((prev) => {
        if (answers.length <= 1) return prev;
        let n = prev;
        while (n === prev) n = Math.floor(Math.random() * answers.length);
        return n;
      });
      setAsking(false);
    }, SHAKE_MS);
  }, [asking, answers.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const answer = answers[idx] ?? answers[0];
  const toneLabel = strings.tones[answer.tone];

  const stageMotion: CSSProperties = {
    transition: "transform 180ms ease, opacity 180ms ease, filter 180ms ease",
    transform: asking ? "scale(0.9) rotate(-3deg)" : "scale(1) rotate(0deg)",
    opacity: asking ? 0.3 : 1,
    filter: asking ? "blur(3px)" : "none",
  };

  /* ─────────────────────────── variant stages ─────────────────────────── */

  function renderStage() {
    if (variant === "orb") {
      const size = 192;
      const fs = fontForLen(answer.text.length, 21, 17, 14);
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 34% 28%, ${hexToRgba(
              accentBright,
              isDark ? 0.55 : 0.6,
            )}, ${hexToRgba(accent, isDark ? 0.26 : 0.32)} 52%, ${hexToRgba(
              accentDeep,
              isDark ? 0.22 : 0.18,
            )} 100%)`,
            border: `1.5px solid ${hexToRgba(accent, 0.45)}`,
            boxShadow: isNeon
              ? `0 0 44px ${hexToRgba(accent, 0.55)}, inset 0 0 40px ${hexToRgba(accentBright, 0.3)}`
              : `0 10px 30px ${hexToRgba(accentDeep, isDark ? 0.4 : 0.25)}, inset 0 2px 24px ${hexToRgba(accentBright, 0.25)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glossy highlight */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "18%",
              width: "42%",
              height: "28%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${hexToRgba("#ffffff", isDark ? 0.28 : 0.55)}, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "76%",
              textAlign: "center",
              fontSize: fs,
              lineHeight: 1.25,
              fontWeight: 700,
              color: text,
              textShadow: isNeon
                ? `0 0 12px ${hexToRgba(accentBright, 0.7)}`
                : isDark
                  ? "none"
                  : `0 1px 2px ${hexToRgba("#ffffff", 0.6)}`,
            }}
          >
            {answer.text}
          </span>
        </div>
      );
    }

    if (variant === "card") {
      const fs = fontForLen(answer.text.length, 22, 19, 15);
      return (
        <div
          style={{
            width: 248,
            minHeight: 128,
            borderRadius: 18,
            padding: "26px 22px",
            background: isGlass
              ? hexToRgba(accent, isDark ? 0.16 : 0.12)
              : hexToRgba(accent, isDark ? 0.1 : 0.08),
            border: `1.5px solid ${hexToRgba(accent, isDark ? 0.4 : 0.32)}`,
            boxShadow: isNeon ? `0 0 26px ${hexToRgba(accent, 0.35)}` : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            position: "relative",
          }}
        >
          {/* 8 badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              color: btnText,
              boxShadow: isNeon ? `0 0 12px ${hexToRgba(accent, 0.6)}` : "none",
            }}
          >
            8
          </div>
          <span
            style={{
              textAlign: "center",
              fontSize: fs,
              lineHeight: 1.3,
              fontWeight: 600,
              color: text,
              textShadow: isNeon ? `0 0 10px ${hexToRgba(accentBright, 0.5)}` : "none",
            }}
          >
            {answer.text}
          </span>
        </div>
      );
    }

    // ball (default) — classic black 8-ball with answer window
    const size = 200;
    const fs = fontForLen(answer.text.length, 17, 14, 12.5);
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 26%, #42413e, #1a1917 58%, #050505 100%)`,
          boxShadow: isNeon
            ? `0 0 40px ${hexToRgba(accent, 0.5)}, inset 0 -10px 30px rgba(0,0,0,0.6)`
            : `0 14px 34px rgba(0,0,0,${isDark ? 0.5 : 0.32}), inset 0 -12px 34px rgba(0,0,0,0.65), inset 0 6px 18px rgba(255,255,255,0.08)`,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.2)"}`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* top highlight */}
        <div
          style={{
            position: "absolute",
            top: "9%",
            left: "22%",
            width: "40%",
            height: "26%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* "8" badge */}
        <div
          style={{
            position: "absolute",
            top: 18,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "#111",
          }}
        >
          8
        </div>
        {/* answer window */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            transform: "translateY(-44%)",
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${hexToRgba(accentDeep, 0.9)}, ${hexToRgba(accentDeep, 0.65)} 70%)`,
            border: `1.5px solid ${hexToRgba(accentBright, 0.5)}`,
            boxShadow: `inset 0 0 22px ${hexToRgba("#000000", 0.5)}, 0 0 ${isNeon ? 22 : 10}px ${hexToRgba(accentBright, isNeon ? 0.55 : 0.3)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              maxWidth: "80%",
              textAlign: "center",
              fontSize: fs,
              lineHeight: 1.22,
              fontWeight: 600,
              color: "#f3f1ea",
              textShadow: `0 0 10px ${hexToRgba(accentBright, 0.7)}`,
              letterSpacing: "0.01em",
            }}
          >
            {answer.text}
          </span>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── layout ─────────────────────────── */

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "4px 8px",
  };

  return (
    <WidgetShell params={params}>
      <div style={containerStyle}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accent,
            textShadow: isNeon ? `0 0 10px ${hexToRgba(accent, 0.6)}` : "none",
          }}
        >
          {strings.title}
        </span>

        <button
          type="button"
          onClick={ask}
          aria-label={strings.ask}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            ...stageMotion,
          }}
        >
          {renderStage()}
        </button>

        {/* tone chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            opacity: asking ? 0.3 : 1,
            transition: "opacity 180ms ease",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: accent,
              boxShadow: isNeon ? `0 0 8px ${hexToRgba(accent, 0.8)}` : "none",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: textFaint,
            }}
          >
            {toneLabel}
          </span>
        </div>

        {/* ask again button */}
        <button
          type="button"
          onClick={ask}
          disabled={asking}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 999,
            border: "none",
            cursor: asking ? "default" : "pointer",
            background: accent,
            color: btnText,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: isNeon
              ? `0 0 18px ${hexToRgba(accent, 0.5)}`
              : isGlass
                ? `0 6px 16px ${hexToRgba(accent, 0.3)}`
                : `0 4px 12px ${hexToRgba(accent, isDark ? 0.35 : 0.28)}`,
            transition: "transform 120ms ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 12a9 9 0 1 1-2.64-6.36M21 4v4h-4"
              stroke={btnText}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {strings.ask}
        </button>
      </div>
    </WidgetShell>
  );
}
