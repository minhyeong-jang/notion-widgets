"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ScoreboardParams } from "./schema";

/* ------------------------------------------------------------------ */
/* i18n                                                                */
/* ------------------------------------------------------------------ */

type Strings = { teamA: string; teamB: string; reset: string; win: string; vs: string };

const STRINGS: Record<string, Strings> = {
  en: { teamA: "Team A", teamB: "Team B", reset: "Reset", win: "WIN", vs: "VS" },
  ko: { teamA: "A팀", teamB: "B팀", reset: "초기화", win: "승리", vs: "VS" },
  ja: { teamA: "チームA", teamB: "チームB", reset: "リセット", win: "勝利", vs: "VS" },
  zh: { teamA: "A队", teamB: "B队", reset: "重置", win: "胜", vs: "VS" },
  de: { teamA: "Team A", teamB: "Team B", reset: "Zurücksetzen", win: "SIEG", vs: "VS" },
  fr: { teamA: "Équipe A", teamB: "Équipe B", reset: "Réinit.", win: "GAGNÉ", vs: "VS" },
  es: { teamA: "Equipo A", teamB: "Equipo B", reset: "Reiniciar", win: "GANA", vs: "VS" },
};

/* ------------------------------------------------------------------ */
/* Persistent score state (localStorage so a Notion embed keeps score  */
/* across reloads)                                                      */
/* ------------------------------------------------------------------ */

interface Scores {
  a: number;
  b: number;
}

const ZERO: Scores = { a: 0, b: 0 };

function useScores(storageKey: string) {
  const [scores, setScores] = useState<Scores>(ZERO);
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback(
    (next: Scores) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // localStorage blocked (private mode) — stay in memory only.
      }
    },
    [storageKey],
  );

  // Hydrate after mount so SSR / first paint (0–0) match, then sync.
  useEffect(() => {
    let loaded = ZERO;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Scores>;
        loaded = {
          a: typeof parsed.a === "number" ? Math.max(0, parsed.a) : 0,
          b: typeof parsed.b === "number" ? Math.max(0, parsed.b) : 0,
        };
      }
    } catch {
      // ignore
    }
    setScores(loaded);
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      try {
        setScores(e.newValue ? (JSON.parse(e.newValue) as Scores) : ZERO);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const bump = useCallback(
    (side: "a" | "b", delta: number) => {
      setScores((s) => {
        const next = { ...s, [side]: Math.max(0, s[side] + delta) };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setScores(() => {
      persist(ZERO);
      return ZERO;
    });
  }, [persist]);

  return { scores, hydrated, bump, reset };
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function PlusIcon({ color }: { color: string }) {
  return (
    <svg width={15} height={15} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2v10M2 7h10" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}
function MinusIcon({ color }: { color: string }) {
  return (
    <svg width={15} height={15} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 7h10" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Widget                                                              */
/* ------------------------------------------------------------------ */

const monoFont = "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

export function ScoreboardWidget({ params }: { params: ScoreboardParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentTint = `#${colors.accentTint}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const btnText = `#${colors.btnText}`;
  const borderStrong = `#${colors.borderStrong}`;

  const isNeon = params.style === "neon";
  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  const nameA = params.team1.trim() || t.teamA;
  const nameB = params.team2.trim() || t.teamB;

  const storageKey = `nw:scoreboard:${(params.boardId || "default").trim().toLowerCase()}`;
  const { scores, hydrated, bump, reset } = useScores(storageKey);

  const hasTarget = params.target > 0;
  const aWon = hasTarget && hydrated && scores.a >= params.target;
  const bWon = hasTarget && hydrated && scores.b >= params.target;
  const over = aWon || bWon;

  // Who's ahead (for highlight). No highlight while tied or unstarted.
  const leader: "a" | "b" | null = !hydrated
    ? null
    : scores.a > scores.b
      ? "a"
      : scores.b > scores.a
        ? "b"
        : null;

  const started = hydrated && (scores.a > 0 || scores.b > 0);

  const styleTag = (
    <style>{`
      .nw-sb-btn { cursor: pointer; transition: transform .1s ease, filter .15s ease, opacity .15s ease; -webkit-tap-highlight-color: transparent; }
      .nw-sb-btn:hover:not(:disabled) { filter: brightness(1.1); }
      .nw-sb-btn:active:not(:disabled) { transform: scale(0.92); }
      .nw-sb-btn:disabled { opacity: .4; cursor: default; }
      .nw-sb-reset:hover { opacity: 1 !important; }
      @keyframes nw-sb-pop { 0% { transform: scale(1);} 40% { transform: scale(1.12);} 100% { transform: scale(1);} }
    `}</style>
  );

  const highlight = (active: boolean) => active && !over;

  const scoreColor = (side: "a" | "b", won: boolean) => {
    const active = won || highlight(leader === side);
    if (active) return isNeon ? accentBright : accent;
    // Trailing side: neon stays in the accent family (dimmed), others go neutral.
    return isNeon ? accent : text;
  };
  const scoreOpacity = (side: "a" | "b") => {
    if (over) return 1;
    if (leader == null) return 1;
    return leader === side ? 1 : 0.5;
  };
  const scoreGlow = (side: "a" | "b", won: boolean) => {
    const active = won || highlight(leader === side);
    if (isNeon) return active ? `0 0 20px ${accentBright}aa` : "none";
    return "var(--w-text-shadow)";
  };

  /* ---- a round +/- control pair for one side ---- */
  const Stepper = ({ side, size = 34 }: { side: "a" | "b"; size?: number }) => {
    const plusBg: CSSProperties = isNeon
      ? { background: "transparent", color: accentBright, border: `1.5px solid ${accent}`, boxShadow: `0 0 8px ${accent}55` }
      : { background: accent, color: btnText, border: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.14)" };
    const minusBg: CSSProperties = {
      background: "transparent",
      color: isNeon ? accent : textDim,
      border: `1.5px solid ${isNeon ? accent + "66" : borderStrong}`,
    };
    return (
      <div className="flex items-center justify-center" style={{ gap: 8 }}>
        <button
          type="button"
          aria-label={`-1 ${side === "a" ? nameA : nameB}`}
          disabled={!hydrated}
          onClick={() => bump(side, -params.step)}
          className="nw-sb-btn inline-flex items-center justify-center"
          style={{ ...minusBg, width: size, height: size, borderRadius: isNeon ? 6 : "50%" }}
        >
          <MinusIcon color={isNeon ? accent : textDim} />
        </button>
        <button
          type="button"
          aria-label={`+1 ${side === "a" ? nameA : nameB}`}
          disabled={!hydrated}
          onClick={() => bump(side, params.step)}
          className="nw-sb-btn inline-flex items-center justify-center"
          style={{ ...plusBg, width: size, height: size, borderRadius: isNeon ? 6 : "50%" }}
        >
          <PlusIcon color={isNeon ? accentBright : btnText} />
        </button>
      </div>
    );
  };

  const TeamName = ({ side, won }: { side: "a" | "b"; won: boolean }) => {
    const active = won || highlight(leader === side);
    return (
      <div
        className="font-semibold text-center"
        style={{
          color: active ? accent : isNeon ? accent : textDim,
          opacity: isNeon && !active ? 0.5 : 1,
          fontSize: 14,
          letterSpacing: isNeon ? "1.5px" : "0.01em",
          textTransform: isNeon ? "uppercase" : undefined,
          fontFamily: isNeon ? monoFont : undefined,
          textShadow: isNeon ? (active ? `0 0 8px ${accentBright}` : "none") : "var(--w-text-shadow)",
          maxWidth: 140,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {side === "a" ? nameA : nameB}
      </div>
    );
  };

  const Score = ({ side, won, size }: { side: "a" | "b"; won: boolean; size: number }) => (
    <div
      key={`${side}-${scores[side]}`}
      className="font-bold tabular-nums"
      style={{
        color: scoreColor(side, won),
        opacity: scoreOpacity(side),
        fontSize: size,
        lineHeight: 1,
        fontFamily: isNeon ? monoFont : "inherit",
        fontVariantNumeric: "tabular-nums",
        textShadow: scoreGlow(side, won),
        animation: hydrated ? "nw-sb-pop .25s ease" : undefined,
      }}
    >
      {hydrated ? scores[side] : 0}
    </div>
  );

  const WinBadge = ({ show }: { show: boolean }) =>
    show ? (
      <div
        className="font-bold"
        style={{
          marginTop: 4,
          fontSize: 11,
          letterSpacing: "2px",
          color: isNeon ? accentBright : accent,
          fontFamily: isNeon ? monoFont : undefined,
          textShadow: isNeon ? `0 0 8px ${accentBright}` : undefined,
        }}
      >
        ★ {t.win}
      </div>
    ) : null;

  const ResetButton = ({ node }: { node?: ReactNode }) => (
    <button
      type="button"
      onClick={reset}
      disabled={!hydrated || !started}
      className="nw-sb-btn nw-sb-reset font-medium"
      style={{
        background: "transparent",
        color: textDim,
        border: "none",
        fontFamily: isNeon ? monoFont : undefined,
        opacity: 0.7,
        fontSize: 12,
        padding: "6px 12px",
        borderRadius: 8,
      }}
    >
      {node ?? t.reset}
    </button>
  );

  /* ============================= VERSUS ============================= */
  if (params.variant === "versus") {
    return (
      <WidgetShell params={params}>
        {styleTag}
        <div className="flex flex-col items-center" style={{ gap: 14, padding: "6px 10px" }}>
          <div className="flex items-stretch justify-center" style={{ gap: 14 }}>
            <div className="flex flex-col items-center" style={{ gap: 10, minWidth: 108 }}>
              <TeamName side="a" won={aWon} />
              <Score side="a" won={aWon} size={66} />
              <WinBadge show={aWon} />
              <Stepper side="a" />
            </div>

            <div className="flex flex-col items-center justify-center" style={{ gap: 6 }}>
              <div
                className="font-semibold"
                style={{
                  color: textFaint,
                  fontSize: 16,
                  letterSpacing: "1px",
                  fontFamily: isNeon ? monoFont : undefined,
                }}
              >
                {t.vs}
              </div>
              <div style={{ width: 1, flex: 1, minHeight: 56, background: isNeon ? accent + "33" : track }} />
            </div>

            <div className="flex flex-col items-center" style={{ gap: 10, minWidth: 108 }}>
              <TeamName side="b" won={bWon} />
              <Score side="b" won={bWon} size={66} />
              <WinBadge show={bWon} />
              <Stepper side="b" />
            </div>
          </div>
          <ResetButton />
        </div>
      </WidgetShell>
    );
  }

  /* ============================== STACK ============================= */
  if (params.variant === "stack") {
    const Row = ({ side, won }: { side: "a" | "b"; won: boolean }) => {
      const active = won || highlight(leader === side);
      return (
        <div
          className="flex items-center justify-between w-full"
          style={{
            gap: 12,
            padding: "10px 14px",
            borderRadius: 14,
            background: active ? (isNeon ? "transparent" : accentTint) : "transparent",
            border: `1px solid ${active ? (isNeon ? accent + "66" : accent + "44") : isNeon ? accent + "22" : track}`,
          }}
        >
          <div className="flex items-center" style={{ gap: 10, minWidth: 0 }}>
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                background: active ? (isNeon ? accentBright : accent) : track,
                boxShadow: active && isNeon ? `0 0 8px ${accentBright}` : undefined,
              }}
            />
            <TeamName side={side} won={won} />
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <Score side={side} won={won} size={38} />
            <Stepper side={side} size={30} />
          </div>
        </div>
      );
    };
    return (
      <WidgetShell params={params}>
        {styleTag}
        <div className="flex flex-col items-center" style={{ gap: 10, padding: "6px 14px", width: "100%", maxWidth: 340 }}>
          <Row side="a" won={aWon} />
          <Row side="b" won={bWon} />
          <ResetButton />
        </div>
      </WidgetShell>
    );
  }

  /* ============================= MINIMAL =========================== */
  // Big "A : B" readout; tap each score to add a point.
  return (
    <WidgetShell params={params}>
      {styleTag}
      <div className="flex flex-col items-center" style={{ gap: 12, padding: "8px 16px" }}>
        <div className="flex items-center justify-center" style={{ gap: 16 }}>
          <button
            type="button"
            aria-label={`+1 ${nameA}`}
            disabled={!hydrated}
            onClick={() => bump("a", params.step)}
            className="nw-sb-btn flex flex-col items-center"
            style={{ background: "transparent", border: "none", padding: 0, gap: 6 }}
          >
            <Score side="a" won={aWon} size={64} />
            <TeamName side="a" won={aWon} />
          </button>

          <div
            className="font-bold"
            style={{
              color: textFaint,
              fontSize: 48,
              lineHeight: 1,
              paddingBottom: 18,
              fontFamily: isNeon ? monoFont : "inherit",
            }}
          >
            :
          </div>

          <button
            type="button"
            aria-label={`+1 ${nameB}`}
            disabled={!hydrated}
            onClick={() => bump("b", params.step)}
            className="nw-sb-btn flex flex-col items-center"
            style={{ background: "transparent", border: "none", padding: 0, gap: 6 }}
          >
            <Score side="b" won={bWon} size={64} />
            <TeamName side="b" won={bWon} />
          </button>
        </div>
        {(aWon || bWon) && (
          <WinBadge show />
        )}
        <div className="flex items-center" style={{ gap: 10 }}>
          <button
            type="button"
            aria-label={`-1 ${nameA}`}
            disabled={!hydrated || scores.a <= 0}
            onClick={() => bump("a", -params.step)}
            className="nw-sb-btn nw-sb-reset font-medium"
            style={{ background: "transparent", color: textDim, border: "none", fontSize: 12, opacity: 0.7, padding: "4px 8px", fontFamily: isNeon ? monoFont : undefined }}
          >
            −{nameA.slice(0, 6)}
          </button>
          <ResetButton />
          <button
            type="button"
            aria-label={`-1 ${nameB}`}
            disabled={!hydrated || scores.b <= 0}
            onClick={() => bump("b", -params.step)}
            className="nw-sb-btn nw-sb-reset font-medium"
            style={{ background: "transparent", color: textDim, border: "none", fontSize: 12, opacity: 0.7, padding: "4px 8px", fontFamily: isNeon ? monoFont : undefined }}
          >
            −{nameB.slice(0, 6)}
          </button>
        </div>
      </div>
    </WidgetShell>
  );
}
