"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { useChecklist } from "./use-checklist";
import { parseItems, type ChecklistParams } from "./schema";

const STRINGS: Record<string, { reset: string; allDone: string; empty: string }> = {
  ko: { reset: "초기화", allDone: "모두 완료! 🎉", empty: "항목을 추가하세요" },
  en: { reset: "Reset", allDone: "All done! 🎉", empty: "Add some items" },
  ja: { reset: "リセット", allDone: "全部完了！🎉", empty: "項目を追加" },
  zh: { reset: "重置", allDone: "全部完成！🎉", empty: "添加项目" },
  de: { reset: "Zurücksetzen", allDone: "Alles erledigt! 🎉", empty: "Einträge hinzufügen" },
  fr: { reset: "Réinitialiser", allDone: "Tout est fait ! 🎉", empty: "Ajoutez des éléments" },
  es: { reset: "Reiniciar", allDone: "¡Todo listo! 🎉", empty: "Añade elementos" },
};

function CheckIcon({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7.5 L5.5 10.5 L11.5 3.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChecklistWidget({ params }: { params: ChecklistParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";

  const items = parseItems(params.items);
  const storageKey = `nw:checklist:${(params.title || "checklist").trim().toLowerCase()}:${items.length}`;
  const { done, hydrated, toggle, reset } = useChecklist({
    storageKey,
    period: params.period,
  });
  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  // ── Derived colors ──
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const btnText = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const borderColor = isDark ? `#${colors.borderStrong}` : `#${colors.border}`;
  const accentTint = `#${colors.accentTint}`;

  const total = items.length;
  const doneCount = items.reduce((n, _, i) => (done.has(i) ? n + 1 : n), 0);
  const allDone = total > 0 && doneCount === total;
  const pct = total > 0 ? (doneCount / total) * 100 : 0;

  const titleColor = isNeon ? accentBright : text;
  const monoFont = isNeon ? "monospace" : undefined;

  // ── Header ──
  const header = (
    <div className="w-full" style={{ marginBottom: 14 }}>
      <div className="flex items-baseline justify-between" style={{ gap: 10 }}>
        <div
          className="font-semibold leading-tight"
          style={{
            fontSize: 15,
            color: titleColor,
            textShadow: "var(--w-text-shadow)",
            fontFamily: monoFont,
            letterSpacing: isNeon ? "1.5px" : "-0.01em",
            textTransform: isNeon ? "uppercase" : undefined,
          }}
        >
          {isNeon ? `> ${params.title}` : params.title}
        </div>
        {params.showProgress && total > 0 && (
          <div
            className="font-medium tabular-nums shrink-0"
            style={{ fontSize: 12, color: isNeon ? accent : textFaint, fontFamily: monoFont, opacity: isNeon ? 0.85 : 1 }}
          >
            {doneCount}/{total}
          </div>
        )}
      </div>
      {params.showProgress && total > 0 && (
        <div
          className="w-full overflow-hidden"
          style={{
            marginTop: 9,
            height: isNeon ? 4 : 6,
            borderRadius: 99,
            backgroundColor: isNeon ? `${accent}26` : track,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 99,
              background: isNeon ? accentBright : `linear-gradient(90deg, ${accent}, ${accentBright})`,
              boxShadow: isNeon ? `0 0 8px ${accentBright}` : undefined,
              transition: "width 0.45s ease",
            }}
          />
        </div>
      )}
    </div>
  );

  // ── Per-item checkbox ──
  const renderBox = (checked: boolean, shape: "square" | "circle") => {
    const radius = shape === "circle" ? "50%" : isNeon ? 4 : 6;
    const dim = shape === "circle" ? 22 : 20;
    const base: CSSProperties = {
      width: dim,
      height: dim,
      borderRadius: radius,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
    };
    if (checked) {
      if (isNeon) {
        return (
          <span
            style={{
              ...base,
              background: "transparent",
              border: `1.5px solid ${accent}`,
              boxShadow: `0 0 8px ${accent}88, inset 0 0 6px ${accent}44`,
            }}
          >
            <CheckIcon color={accentBright} />
          </span>
        );
      }
      return (
        <span style={{ ...base, background: accent, border: `1.5px solid ${accent}` }}>
          <CheckIcon color={btnText} />
        </span>
      );
    }
    return (
      <span
        style={{
          ...base,
          background: "transparent",
          border: `1.5px solid ${isNeon ? `${accent}66` : borderColor}`,
        }}
      />
    );
  };

  // ── Item row ──
  const renderItem = (label: string, i: number) => {
    const checked = done.has(i);
    const isCard = params.variant === "card";
    const shape: "square" | "circle" = params.variant === "circle" ? "circle" : "square";

    const labelStyle: CSSProperties = {
      fontSize: 14,
      color: checked ? textFaint : isNeon ? accentBright : text,
      textDecoration: checked ? "line-through" : "none",
      textDecorationColor: checked ? textFaint : undefined,
      textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
      fontFamily: monoFont,
      transition: "color 0.18s ease",
      lineHeight: 1.35,
      textAlign: "left",
    };

    const rowInner = (
      <>
        {renderBox(checked, shape)}
        <span style={labelStyle}>{label}</span>
      </>
    );

    if (isCard) {
      const cardStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: 11,
        width: "100%",
        padding: "11px 13px",
        borderRadius: isNeon ? 6 : 12,
        cursor: hydrated ? "pointer" : "default",
        textAlign: "left",
        transition: "background-color 0.18s ease, border-color 0.18s ease",
        background: checked ? (isNeon ? `${accent}14` : accentTint) : "transparent",
        border: `1px solid ${checked ? (isNeon ? `${accent}66` : accent) : borderColor}`,
      };
      return (
        <button
          key={i}
          type="button"
          className="nw-cl-row"
          onClick={() => hydrated && toggle(i)}
          disabled={!hydrated}
          style={cardStyle}
        >
          {rowInner}
        </button>
      );
    }

    // list / circle: a row with an optional divider (list only)
    const rowStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: params.variant === "circle" ? "7px 4px" : "9px 4px",
      cursor: hydrated ? "pointer" : "default",
      textAlign: "left",
      background: "transparent",
      border: "none",
      borderBottom:
        params.variant === "list" && i < total - 1
          ? `1px solid ${isNeon ? `${accent}1f` : borderColor}`
          : "none",
    };
    return (
      <button
        key={i}
        type="button"
        className="nw-cl-row"
        onClick={() => hydrated && toggle(i)}
        disabled={!hydrated}
        style={rowStyle}
      >
        {rowInner}
      </button>
    );
  };

  const listGap = params.variant === "card" ? 8 : 0;

  return (
    <WidgetShell params={params}>
      <style>{`
        .nw-cl-row { -webkit-tap-highlight-color: transparent; transition: opacity .15s ease, transform .1s ease; }
        .nw-cl-row:hover:not(:disabled) { opacity: .9; }
        .nw-cl-row:active:not(:disabled) { transform: scale(0.99); }
        .nw-cl-reset { cursor: pointer; transition: opacity .15s ease; opacity: .7; }
        .nw-cl-reset:hover { opacity: 1; }
      `}</style>
      <div
        className="flex flex-col"
        style={{ width: "100%", maxWidth: 320, padding: "4px 4px" }}
      >
        {header}

        {total === 0 ? (
          <div
            className="text-center"
            style={{ fontSize: 13, color: textFaint, fontFamily: monoFont, padding: "12px 0" }}
          >
            {t.empty}
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: listGap }}>
            {items.map((label, i) => renderItem(label, i))}
          </div>
        )}

        {(allDone || doneCount > 0) && (
          <div
            className="flex items-center justify-between"
            style={{ marginTop: 14, minHeight: 18 }}
          >
            <span
              className="font-semibold"
              style={{
                fontSize: 12,
                color: isNeon ? accentBright : accent,
                textShadow: "var(--w-text-shadow)",
                fontFamily: monoFont,
                letterSpacing: isNeon ? "0.5px" : undefined,
                opacity: allDone ? 1 : 0,
              }}
            >
              {t.allDone}
            </span>
            {doneCount > 0 && (
              <button
                type="button"
                className="nw-cl-reset font-medium"
                onClick={() => hydrated && reset()}
                style={{
                  fontSize: 12,
                  color: textDim,
                  background: "transparent",
                  border: "none",
                  fontFamily: monoFont,
                }}
              >
                {t.reset}
              </button>
            )}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
