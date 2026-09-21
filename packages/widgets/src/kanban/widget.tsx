"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { getColumns, type KanbanColumn, type KanbanParams } from "./schema";

const STRINGS: Record<string, { empty: string }> = {
  ko: { empty: "비어 있음" },
  en: { empty: "Empty" },
  ja: { empty: "空" },
  zh: { empty: "空" },
  de: { empty: "Leer" },
  fr: { empty: "Vide" },
  es: { empty: "Vacío" },
};

export function KanbanWidget({ params }: { params: KanbanParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";
  const columns = getColumns(params);
  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  const stack = params.variant === "stack";
  // Board packs 3 lanes side-by-side, so it needs more room than the shell's
  // default content card gives. Render it "bare" with our own wide container.
  const bare = !stack;
  const hasContainer = bare && (params.style === "soft" || params.style === "glass");

  // ── Derived colors (never hardcoded) ──
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const borderColor = isDark ? `#${colors.borderStrong}` : `#${colors.border}`;

  const monoFont = isNeon ? "monospace" : undefined;

  // Each column gets a status hue derived from the palette: neutral → active → done.
  const shadeFor = (i: number): string => {
    const seq = [textFaint, accent, accentBright];
    return seq[Math.min(i, seq.length - 1)];
  };

  // Lane + card surfaces (readable on plain bg and on soft/glass containers).
  const laneBg = isNeon ? `${accent}0d` : `${accent}0a`;
  const laneBorder = isNeon ? `${accent}33` : borderColor;
  const cardBg = isNeon
    ? "transparent"
    : isDark
      ? `#${colors.surface2}`
      : "#ffffff";

  const renderCard = (label: string, shade: string, key: number) => {
    const cardStyle: CSSProperties = {
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
      width: "100%",
      padding: isNeon ? "7px 9px" : "8px 10px",
      borderRadius: isNeon ? 5 : 8,
      background: cardBg,
      border: `1px solid ${isNeon ? `${shade}55` : borderColor}`,
      borderLeft: `3px solid ${shade}`,
      boxShadow: isNeon
        ? `0 0 6px ${shade}33`
        : isDark
          ? "0 1px 2px rgba(0,0,0,0.25)"
          : "0 1px 2px rgba(0,0,0,0.05)",
      textAlign: "left",
    };
    return (
      <div key={key} style={cardStyle}>
        <span
          style={{
            fontSize: 12.5,
            lineHeight: 1.35,
            color: isNeon ? accentBright : text,
            fontFamily: monoFont,
            textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
      </div>
    );
  };

  const renderHeader = (column: KanbanColumn, shade: string) => (
    <div
      className="flex items-center"
      style={{ gap: 6, marginBottom: 9, minWidth: 0 }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: shade,
          flexShrink: 0,
          boxShadow: isNeon ? `0 0 6px ${shade}` : undefined,
        }}
      />
      <span
        className="font-semibold truncate"
        style={{
          minWidth: 0,
          fontSize: 11.5,
          color: isNeon ? accentBright : textDim,
          fontFamily: monoFont,
          letterSpacing: isNeon ? "1px" : "0.3px",
          textTransform: "uppercase",
          textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
        }}
      >
        {column.title}
      </span>
      {params.showCount && (
        <span
          className="font-medium tabular-nums shrink-0"
          style={{
            marginLeft: "auto",
            fontSize: 10.5,
            minWidth: 16,
            textAlign: "center",
            padding: "1px 5px",
            borderRadius: 99,
            color: isNeon ? accent : textFaint,
            background: isNeon ? `${accent}1a` : `${accent}14`,
            fontFamily: monoFont,
          }}
        >
          {column.cards.length}
        </span>
      )}
    </div>
  );

  const renderColumn = (column: KanbanColumn, i: number) => {
    const shade = shadeFor(i);
    return (
      <div
        key={i}
        style={{
          flex: stack ? undefined : "1 1 0",
          minWidth: 0,
          width: stack ? "100%" : undefined,
          padding: "9px 9px 11px",
          borderRadius: isNeon ? 6 : 12,
          background: laneBg,
          border: `1px solid ${laneBorder}`,
        }}
      >
        {renderHeader(column, shade)}
        {column.cards.length === 0 ? (
          <div
            style={{
              fontSize: 11.5,
              color: textFaint,
              fontFamily: monoFont,
              padding: "6px 2px",
              opacity: 0.8,
            }}
          >
            {t.empty}
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: 7 }}>
            {column.cards.map((card, ci) => renderCard(card, shade, ci))}
          </div>
        )}
      </div>
    );
  };

  const boardTitle = params.title.trim();

  const titleEl = boardTitle ? (
    <div
      className="font-semibold"
      style={{
        fontSize: 15,
        marginBottom: 12,
        color: isNeon ? accentBright : text,
        fontFamily: monoFont,
        letterSpacing: isNeon ? "1px" : "-0.01em",
        textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
      }}
    >
      {isNeon ? `> ${boardTitle}` : boardTitle}
    </div>
  ) : null;

  const columnsEl = (
    <div
      className={stack ? "flex flex-col" : "flex"}
      style={{ gap: stack ? 9 : 8, alignItems: "stretch" }}
    >
      {columns.map((column, i) => renderColumn(column, i))}
    </div>
  );

  // Soft/glass board: our own wide container that mirrors the shell card chrome.
  let containerStyle: CSSProperties | undefined;
  if (hasContainer) {
    if (params.style === "glass") {
      containerStyle = {
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.72)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : `${accent}22`}`,
        borderRadius: 18,
        padding: 16,
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
      };
    } else {
      containerStyle = {
        background: isDark ? `#${colors.surface}` : `#${colors.surface2}`,
        border: `1px solid #${isDark ? colors.borderSoft : colors.border}`,
        borderRadius: 18,
        padding: 16,
        boxShadow: isDark ? "0 2px 16px rgba(0,0,0,0.22)" : "0 2px 20px rgba(0,0,0,0.06)",
      };
    }
  }

  const maxWidth = stack ? 320 : 500;

  return (
    <WidgetShell params={params} bare={bare}>
      <div className="flex flex-col" style={{ width: "100%", maxWidth, padding: "2px" }}>
        {containerStyle ? (
          <div style={containerStyle}>
            {titleEl}
            {columnsEl}
          </div>
        ) : (
          <>
            {titleEl}
            {columnsEl}
          </>
        )}
      </div>
    </WidgetShell>
  );
}
