"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { WordClockParams } from "./schema";
import {
  GRID,
  LABEL,
  clockPhrase,
  litCells,
  type ClockPhrase,
  type WordKey,
} from "./words";

/** Reading order of every word that can light up — used by phrase/line. */
function orderedWords(p: ClockPhrase): WordKey[] {
  return p.hourFirst
    ? [...p.prefix, p.hour, ...p.words] // "IT IS  TEN  O'CLOCK"
    : [...p.prefix, ...p.words, p.hour]; // "IT IS  HALF PAST  TEN"
}

export function WordClockWidget({ params }: { params: WordClockParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  const litColor = isNeon ? accentBright : accent;
  const litShadow = isNeon ? `0 0 10px ${accent}, 0 0 4px ${accentBright}` : "none";
  const monoFont = isNeon ? "var(--font-mono, 'Courier New', monospace)" : undefined;

  // Time is client-only to stay hydration-safe; updates every 5s (5-min grid).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(id);
  }, []);

  const phrase = now ? clockPhrase(now.getHours(), now.getMinutes()) : null;

  // ─────────────────────────────── GRID ───────────────────────────────
  if (params.variant === "grid") {
    const lit = phrase ? litCells(phrase) : new Set<string>();
    const extra = phrase?.extra ?? 0;

    const dot = (on: boolean, key: string) => (
      <span
        key={key}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: on ? litColor : "currentColor",
          opacity: on ? 1 : 0.14,
          boxShadow: on ? litShadow : "none",
          transition: "opacity .5s ease, background-color .5s ease",
        }}
      />
    );

    return (
      <WidgetShell params={params}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: params.showDots ? 12 : 0,
            width: "100%",
            maxWidth: 300,
            color: textFaint,
          }}
        >
          {params.showDots && (
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 2px" }}>
              {dot(extra >= 1, "tl")}
              {dot(extra >= 2, "tr")}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(11, 1fr)",
              gap: "clamp(2px, 1.4vw, 7px)",
              width: "100%",
              fontFamily: monoFont,
            }}
          >
            {GRID.map((row, r) =>
              row.split("").map((ch, c) => {
                const on = lit.has(`${r}-${c}`);
                return (
                  <span
                    key={`${r}-${c}`}
                    style={{
                      textAlign: "center",
                      fontSize: "clamp(11px, 3.4vw, 17px)",
                      fontWeight: on ? 700 : 500,
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      color: on ? litColor : "currentColor",
                      opacity: on ? 1 : 0.16,
                      textShadow: on ? litShadow : "none",
                      transition: "color .5s ease, opacity .5s ease, text-shadow .5s ease",
                    }}
                  >
                    {ch}
                  </span>
                );
              }),
            )}
          </div>

          {params.showDots && (
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 2px" }}>
              {dot(extra >= 4, "bl")}
              {dot(extra >= 3, "br")}
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ────────────────────────── PHRASE / LINE ──────────────────────────
  const isLine = params.variant === "line";
  const words = phrase ? orderedWords(phrase) : [];

  const wordStyle = (key: WordKey): CSSProperties => {
    const isPrefix = key === "IT" || key === "IS";
    const isHour = key === phrase?.hour;
    let color = text;
    let opacity = 1;
    if (isPrefix) {
      color = textFaint;
      opacity = 1;
    } else if (isHour) {
      color = litColor;
    } else {
      color = isNeon ? accent : textDim;
    }
    return {
      color,
      opacity,
      fontWeight: isHour ? 700 : isPrefix ? 500 : 600,
      textShadow: isHour ? litShadow : "none",
      fontFamily: monoFont,
      transition: "color .5s ease",
    };
  };

  return (
    <WidgetShell params={params}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "center",
          gap: isLine ? "0.42em" : "0.32em 0.5em",
          maxWidth: isLine ? 460 : 320,
          padding: "0 12px",
          textAlign: "center",
          fontSize: isLine ? "clamp(15px, 4.5vw, 21px)" : "clamp(26px, 8vw, 40px)",
          lineHeight: isLine ? 1.5 : 1.12,
          letterSpacing: isLine ? "0.06em" : "0.005em",
          textTransform: isLine ? "lowercase" : "uppercase",
          minHeight: isLine ? 24 : 44,
        }}
      >
        {words.map((key, i) => (
          <span key={`${key}-${i}`} style={wordStyle(key)}>
            {LABEL[key]}
          </span>
        ))}
      </div>
    </WidgetShell>
  );
}
