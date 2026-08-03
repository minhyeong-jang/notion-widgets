"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { RandomPickerParams } from "./schema";
import {
  dayOfYear,
  getStrings,
  makeRng,
  parseOptions,
  strHash,
  type Sentiment,
} from "./random";

/** 3×3 pip layout per die face. */
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const SENTIMENT_ICON: Record<Sentiment, string> = {
  yes: "✓",
  no: "✕",
  maybe: "~",
};

export function RandomPickerWidget({ params }: { params: RandomPickerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentTint = `#${colors.accentTint}`;
  const track = `#${colors.track}`;

  const isNeon = params.style === "neon";
  const mono = isNeon ? "var(--font-mono, 'Courier New', monospace)" : undefined;
  const headColor = isNeon ? accentBright : textFaint;
  const resultColor = isNeon ? accentBright : text;
  const glow = isNeon ? `0 0 14px ${accent}, 0 0 4px ${accent}` : "var(--w-text-shadow)";

  const s = getStrings(params.locale);
  const options = parseOptions(params.options).slice(0, 6);

  // Deterministic daily seed for SSR; re-seed after mount for random mode so
  // server and client first paint agree (no hydration mismatch).
  const dailySeed =
    dayOfYear() * 733 + strHash(`${params.variant}|${params.options}|${params.accent}`);
  const [seed, setSeed] = useState(dailySeed);
  const [rolling, setRolling] = useState(false);
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    if (params.mode === "random") {
      setSeed((Math.floor(Math.random() * 1e9) >>> 0));
    } else {
      setSeed(
        dayOfYear() * 733 +
          strHash(`${params.variant}|${params.options}|${params.accent}`),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode, params.variant, params.options, params.accent]);

  // Shuffle animation while rolling.
  useEffect(() => {
    if (!rolling) return;
    const iv = setInterval(() => setSpin((v) => v + 1), 70);
    const to = setTimeout(() => {
      setRolling(false);
      setSeed((Math.floor(Math.random() * 1e9) >>> 0));
    }, 540);
    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [rolling]);

  function roll() {
    if (!rolling) setRolling(true);
  }

  const activeSeed = rolling ? (seed ^ (spin * 0x9e3779b1)) >>> 0 : seed >>> 0;
  const r = makeRng(activeSeed)();

  const diceValue = 1 + Math.floor(r * 6);
  const isHeads = r < 0.5;
  const answer = s.answers[Math.floor(r * s.answers.length)];
  const winnerIndex = Math.floor(r * options.length);

  const headerLabel =
    params.variant === "dice"
      ? s.dice
      : params.variant === "coin"
        ? s.coin
        : params.variant === "oracle"
          ? s.oracle
          : s.picked;

  const Header = (
    <div
      className="text-[11px] font-semibold uppercase"
      style={{
        color: headColor,
        letterSpacing: isNeon ? "2.5px" : "0.14em",
        fontFamily: mono,
        marginBottom: params.variant === "pick" ? 14 : 20,
        textShadow: isNeon ? glow : undefined,
      }}
    >
      {isNeon ? `> ${headerLabel.replace(/ /g, "_").toUpperCase()}` : headerLabel}
    </div>
  );

  const Footer = (
    <div
      className="text-[10px] font-medium"
      style={{
        color: isNeon ? accent : textFaint,
        letterSpacing: isNeon ? "1.5px" : "0.06em",
        fontFamily: mono,
        marginTop: params.variant === "pick" ? 14 : 20,
        opacity: 0.75,
      }}
    >
      {rolling
        ? isNeon
          ? "// " + s.rolling.toUpperCase()
          : s.rolling
        : isNeon
          ? "[ TAP_TO_ROLL ]"
          : s.tapToRoll}
    </div>
  );

  const popKey = rolling ? "rolling" : `s${seed}`;
  const popStyle: CSSProperties = rolling
    ? {}
    : { animation: "picker-pop 0.42s cubic-bezier(0.22,1,0.36,1)" };

  let body: React.ReactNode;

  if (params.variant === "dice") {
    body = (
      <div
        key={popKey}
        style={{
          ...popStyle,
          width: 128,
          height: 128,
          borderRadius: isNeon ? 10 : 24,
          background: isNeon ? "transparent" : accentTint,
          border: `${isNeon ? 2 : 1.5}px solid ${isNeon ? accent : accentBright}`,
          boxShadow: isNeon
            ? `0 0 18px ${accent}, inset 0 0 12px ${colors.accentTint}`
            : "var(--w-box-shadow)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          padding: 18,
          gap: 4,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const on = PIPS[diceValue].includes(i);
          return (
            <div
              key={i}
              style={{
                justifySelf: "center",
                alignSelf: "center",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: on ? accentBright : "transparent",
                boxShadow: on && isNeon ? `0 0 8px ${accent}` : undefined,
                transition: "background 0.12s",
              }}
            />
          );
        })}
      </div>
    );
  } else if (params.variant === "coin") {
    body = (
      <div
        key={popKey}
        style={{
          ...popStyle,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: isNeon
            ? "transparent"
            : `radial-gradient(circle at 35% 30%, ${accentBright}, ${accent})`,
          border: `${isNeon ? 2.5 : 2}px solid ${isNeon ? accent : accentBright}`,
          boxShadow: isNeon
            ? `0 0 22px ${accent}, inset 0 0 16px ${accentTint}`
            : "var(--w-box-shadow)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1,
            fontFamily: mono,
            color: isNeon ? accentBright : `#${colors.btnText}`,
            textShadow: isNeon ? glow : undefined,
          }}
        >
          {isHeads ? "H" : "T"}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.5px",
            fontFamily: mono,
            color: isNeon ? accent : `#${colors.btnText}`,
            opacity: isNeon ? 0.9 : 0.85,
          }}
        >
          {isHeads ? s.heads : s.tails}
        </span>
      </div>
    );
  } else if (params.variant === "oracle") {
    body = (
      <div
        key={popKey}
        style={{
          ...popStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 280,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: accentTint,
            border: `1.5px solid ${accentBright}`,
            boxShadow: isNeon ? `0 0 16px ${accent}` : undefined,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: accentBright,
              fontFamily: mono,
              textShadow: isNeon ? glow : undefined,
            }}
          >
            {SENTIMENT_ICON[answer.sentiment]}
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1.35,
            textAlign: "center",
            color: resultColor,
            fontFamily: mono,
            textShadow: isNeon ? glow : "var(--w-text-shadow)",
          }}
        >
          {isNeon ? `"${answer.text}"` : answer.text}
        </p>
      </div>
    );
  } else {
    // pick
    body = (
      <div
        key={popKey}
        style={{
          ...popStyle,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          width: "100%",
          maxWidth: 260,
        }}
      >
        {options.map((opt, i) => {
          const won = i === winnerIndex;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 13px",
                borderRadius: isNeon ? 6 : 12,
                background: won ? accentTint : "transparent",
                border: `1px solid ${won ? accentBright : track}`,
                opacity: won ? 1 : 0.5,
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  color: won ? accentBright : textFaint,
                  fontFamily: mono,
                  fontSize: 13,
                  width: 12,
                }}
              >
                {won ? (isNeon ? ">" : "▸") : ""}
              </span>
              <span
                style={{
                  color: won ? resultColor : textDim,
                  fontFamily: mono,
                  fontSize: 15,
                  fontWeight: won ? 700 : 500,
                  textShadow: won && isNeon ? glow : undefined,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes picker-pop {
          0% { transform: scale(0.8); opacity: 0.35; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        onClick={roll}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") roll();
        }}
        className="flex flex-col items-center justify-center select-none"
        style={{ cursor: "pointer", padding: "8px 16px", outline: "none" }}
      >
        {Header}
        {body}
        {Footer}
      </div>
    </WidgetShell>
  );
}
