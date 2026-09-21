"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { parseCards, type FlashcardParams } from "./schema";

interface Strings {
  tapToFlip: string;
  showAnswer: string;
  hideAnswer: string;
  tapToReveal: string;
  next: string;
  prev: string;
  front: string;
  back: string;
  empty: string;
}

const STRINGS: Record<string, Strings> = {
  en: { tapToFlip: "Tap to flip", showAnswer: "Show answer", hideAnswer: "Hide answer", tapToReveal: "Tap to reveal", next: "Next", prev: "Prev", front: "Q", back: "A", empty: "No cards yet" },
  ko: { tapToFlip: "탭하여 뒤집기", showAnswer: "정답 보기", hideAnswer: "정답 숨기기", tapToReveal: "탭하여 확인", next: "다음", prev: "이전", front: "문제", back: "정답", empty: "카드가 없어요" },
  ja: { tapToFlip: "タップで裏返す", showAnswer: "答えを見る", hideAnswer: "答えを隠す", tapToReveal: "タップで表示", next: "次へ", prev: "前へ", front: "問", back: "答", empty: "カードがありません" },
  zh: { tapToFlip: "点击翻转", showAnswer: "查看答案", hideAnswer: "隐藏答案", tapToReveal: "点击显示", next: "下一个", prev: "上一个", front: "问", back: "答", empty: "暂无卡片" },
  de: { tapToFlip: "Zum Umdrehen tippen", showAnswer: "Antwort zeigen", hideAnswer: "Antwort verbergen", tapToReveal: "Zum Aufdecken tippen", next: "Weiter", prev: "Zurück", front: "F", back: "A", empty: "Noch keine Karten" },
  fr: { tapToFlip: "Toucher pour retourner", showAnswer: "Voir la réponse", hideAnswer: "Masquer", tapToReveal: "Toucher pour révéler", next: "Suivant", prev: "Précédent", front: "Q", back: "R", empty: "Aucune carte" },
  es: { tapToFlip: "Toca para girar", showAnswer: "Ver respuesta", hideAnswer: "Ocultar", tapToReveal: "Toca para revelar", next: "Siguiente", prev: "Anterior", front: "P", back: "R", empty: "Sin tarjetas" },
};

export function FlashcardWidget({ params }: { params: FlashcardParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentTint = `#${colors.accentTint}`;
  const btnText = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textFaint = `#${colors.textFaint}`;
  const border = `#${colors.border}`;

  const style = params.style || "minimal";
  const isNeon = style === "neon";
  const isGlass = style === "glass";
  const mono = isNeon ? "var(--font-geist-mono, 'Courier New', monospace)" : undefined;

  const lang = params.locale.slice(0, 2);
  const t = STRINGS[lang] ?? STRINGS.en;

  const cards = parseCards(params.cards);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

  if (cards.length === 0) {
    return (
      <WidgetShell params={params}>
        <div style={{ color: textFaint, fontFamily: mono, fontSize: 14 }}>{t.empty}</div>
      </WidgetShell>
    );
  }

  const safeIndex = Math.min(index, cards.length - 1);
  const card = cards[safeIndex];

  const goto = (next: number) => {
    const n = (next + cards.length) % cards.length;
    setIndex(n);
    setFlipped(false);
    setRevealed(false);
  };

  // A single flashcard "face" surface, adapting per style.
  const faceSurface = (): CSSProperties => {
    if (isNeon) {
      return {
        background: isDark ? `#${colors.inset}` : accentTint,
        border: `1px solid ${accent}`,
        boxShadow: `0 0 18px ${accent}55, inset 0 0 24px ${accent}18`,
        borderRadius: 8,
      };
    }
    if (isGlass) {
      return {
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.85)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : accentTint}`,
        boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.28)" : "0 8px 30px rgba(0,0,0,0.08)",
        borderRadius: 18,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      };
    }
    // minimal & soft
    return {
      background: isDark ? `#${colors.surface2}` : "#ffffff",
      border: `1px solid ${border}`,
      boxShadow: style === "soft" ? "0 4px 18px rgba(0,0,0,0.10)" : "0 1px 2px rgba(0,0,0,0.04)",
      borderRadius: 16,
    };
  };

  const deckTag = (
    params.deck ? (
      <span
        className="text-[11px] font-semibold"
        style={{
          color: accent,
          fontFamily: mono,
          letterSpacing: isNeon ? "1.5px" : "0.08em",
          textTransform: "uppercase",
          background: isNeon ? "transparent" : accentTint,
          border: isNeon ? `1px solid ${accent}55` : "none",
          padding: isNeon ? "3px 9px" : "4px 10px",
          borderRadius: 999,
        }}
      >
        {isNeon ? `# ${params.deck}` : params.deck}
      </span>
    ) : <span />
  );

  const counter = (
    params.showCounter ? (
      <span className="text-[12px] tabular-nums" style={{ color: isNeon ? accent : textFaint, fontFamily: mono, opacity: isNeon ? 0.75 : 1 }}>
        {safeIndex + 1} / {cards.length}
      </span>
    ) : <span />
  );

  const sideLabel: CSSProperties = {
    color: isNeon ? accent : textFaint,
    fontFamily: mono,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    opacity: isNeon ? 0.8 : 1,
  };

  const faceText = (isBack: boolean): CSSProperties => ({
    color: isNeon ? (isBack ? accentBright : text) : text,
    fontFamily: mono,
    fontWeight: isBack ? 700 : 600,
    fontSize: 20,
    lineHeight: 1.4,
    textAlign: "center",
    textShadow: isNeon ? `0 0 12px ${accent}66` : "var(--w-text-shadow)",
  });

  // Round icon nav button.
  const navBtn: CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: isNeon ? 8 : 999,
    background: isNeon ? "transparent" : accentTint,
    border: isNeon ? `1px solid ${accent}` : "none",
    color: accent,
    fontSize: 18,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: isNeon ? `0 0 12px ${accent}44` : undefined,
  };

  // ─── Variant: quiz — question card + show/hide answer ───
  if (params.variant === "quiz") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col w-full" style={{ maxWidth: 380, gap: 14 }}>
          <div className="flex items-center justify-between" style={{ paddingInline: 2 }}>
            {deckTag}
            {counter}
          </div>
          <div className="flex flex-col" style={{ ...faceSurface(), padding: "22px 22px", gap: 16, minHeight: 150, justifyContent: "center" }}>
            <div className="flex flex-col items-center" style={{ gap: 8 }}>
              <span style={sideLabel}>{isNeon ? `[${t.front}]` : t.front}</span>
              <div style={{ ...faceText(false), fontSize: 19 }}>{card.front}</div>
            </div>
            {revealed && (
              <>
                <div style={{ height: 1, background: isNeon ? `${accent}33` : border, margin: "2px 0" }} />
                <div className="flex flex-col items-center" style={{ gap: 8 }}>
                  <span style={sideLabel}>{isNeon ? `[${t.back}]` : t.back}</span>
                  <div style={{ ...faceText(true), fontSize: 19, color: isNeon ? accentBright : accent }}>{card.back}</div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center" style={{ gap: 10 }}>
            <button
              onClick={() => setRevealed((r) => !r)}
              style={{
                flex: 1,
                padding: "11px 16px",
                borderRadius: isNeon ? 8 : 12,
                background: revealed ? (isNeon ? "transparent" : accentTint) : (isNeon ? "transparent" : accent),
                border: isNeon ? `1px solid ${accent}` : "none",
                color: revealed ? accent : (isNeon ? accentBright : btnText),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                textShadow: isNeon ? `0 0 8px ${accent}` : "none",
                boxShadow: isNeon ? `0 0 14px ${accent}44` : revealed ? "none" : `0 4px 12px ${accent}40`,
              }}
            >
              {isNeon ? `[ ${revealed ? t.hideAnswer : t.showAnswer} ]` : revealed ? t.hideAnswer : t.showAnswer}
            </button>
            <button aria-label={t.next} onClick={() => goto(safeIndex + 1)} style={navBtn}>→</button>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ─── Variant: list — tap-to-reveal rows ───
  if (params.variant === "list") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col w-full" style={{ maxWidth: 400, gap: 12 }}>
          <div className="flex items-center justify-between" style={{ paddingInline: 2 }}>
            {deckTag}
            <span className="text-[12px] tabular-nums" style={{ color: isNeon ? accent : textFaint, fontFamily: mono, opacity: isNeon ? 0.75 : 1 }}>
              {cards.length}
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {cards.map((c, i) => {
              const open = !!openRows[i];
              return (
                <button
                  key={i}
                  onClick={() => setOpenRows((r) => ({ ...r, [i]: !r[i] }))}
                  style={{ ...faceSurface(), padding: "12px 14px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: open ? 8 : 0 }}
                >
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: isNeon ? 5 : 7,
                        background: isNeon ? "transparent" : accentTint,
                        border: isNeon ? `1px solid ${accent}` : "none",
                        color: accent,
                        fontFamily: mono,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[15px]" style={{ flex: 1, color: text, fontFamily: mono, fontWeight: 600 }}>{c.front}</span>
                    <span style={{ color: accent, fontFamily: mono, fontSize: 13, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
                  </div>
                  {open && (
                    <div className="text-[14px]" style={{ paddingLeft: 32, color: isNeon ? accentBright : accent, fontFamily: mono, fontWeight: 600, lineHeight: 1.4, textShadow: isNeon ? `0 0 10px ${accent}55` : undefined }}>
                      {c.back}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ─── Variant: card (default) — 3D flip ───
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center w-full" style={{ maxWidth: 380, gap: 16 }}>
        <div className="flex items-center justify-between w-full" style={{ paddingInline: 2 }}>
          {deckTag}
          {counter}
        </div>

        <div
          onClick={() => setFlipped((f) => !f)}
          style={{ width: "100%", height: 190, perspective: 1200, cursor: "pointer" }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transition: "transform 0.5s cubic-bezier(0.4,0.2,0.2,1)",
              transform: flipped ? "rotateY(180deg)" : "none",
            }}
          >
            {/* Front */}
            <div
              style={{
                ...faceSurface(),
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "24px 22px",
              }}
            >
              <span style={sideLabel}>{isNeon ? `[${t.front}]` : t.front}</span>
              <div style={faceText(false)}>{card.front}</div>
              <span className="text-[11px]" style={{ position: "absolute", bottom: 12, color: isNeon ? accent : textFaint, fontFamily: mono, opacity: isNeon ? 0.65 : 0.8 }}>
                {isNeon ? `// ${t.tapToFlip}` : t.tapToFlip}
              </span>
            </div>
            {/* Back */}
            <div
              style={{
                ...faceSurface(),
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "24px 22px",
                borderColor: isNeon ? accentBright : undefined,
              }}
            >
              <span style={sideLabel}>{isNeon ? `[${t.back}]` : t.back}</span>
              <div style={{ ...faceText(true), color: isNeon ? accentBright : accent }}>{card.back}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center" style={{ gap: 16 }}>
          <button aria-label={t.prev} onClick={() => goto(safeIndex - 1)} style={navBtn}>‹</button>
          <div className="flex items-center" style={{ gap: 6 }}>
            {cards.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === safeIndex ? 18 : 7,
                  height: 7,
                  borderRadius: 999,
                  background: i === safeIndex ? accent : (isNeon ? `${accent}44` : border),
                  transition: "width 0.2s",
                  boxShadow: i === safeIndex && isNeon ? `0 0 8px ${accent}` : undefined,
                }}
              />
            ))}
          </div>
          <button aria-label={t.next} onClick={() => goto(safeIndex + 1)} style={navBtn}>›</button>
        </div>
      </div>
    </WidgetShell>
  );
}
