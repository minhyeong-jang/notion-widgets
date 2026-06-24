"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ResolvedColors } from "@nw/widget-core";

interface TrackerControlsProps {
  style: string;
  colors: ResolvedColors;
  reached: boolean;
  addLabel: string;
  resetLabel: string;
  reachedLabel: string;
  onAdd: () => void;
  onReset: () => void;
  /** Optional leading icon for the add button (defaults to a plus). */
  icon?: ReactNode;
  disabled?: boolean;
}

function PlusIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2v10M2 7h10" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

export function TrackerControls({
  style,
  colors,
  reached,
  addLabel,
  resetLabel,
  reachedLabel,
  onAdd,
  onReset,
  icon,
  disabled,
}: TrackerControlsProps) {
  const isNeon = style === "neon";
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const btnText = `#${colors.btnText}`;
  const textDim = `#${colors.textDim}`;

  const addStyle: CSSProperties = isNeon
    ? {
        background: "transparent",
        color: accentBright,
        border: `1.5px solid ${accent}`,
        fontFamily: "monospace",
        letterSpacing: "1px",
        textShadow: `0 0 8px ${accentBright}`,
        boxShadow: `0 0 10px ${accent}55, inset 0 0 8px ${accent}22`,
      }
    : {
        background: accent,
        color: btnText,
        border: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      };

  const resetStyle: CSSProperties = {
    background: "transparent",
    color: textDim,
    border: "none",
    fontFamily: isNeon ? "monospace" : undefined,
    opacity: 0.75,
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: 8 }}>
      <style>{`
        .nw-tbtn { cursor: pointer; transition: transform .12s ease, filter .15s ease, opacity .15s ease; }
        .nw-tbtn:hover:not(:disabled) { filter: brightness(1.08); }
        .nw-tbtn:active:not(:disabled) { transform: scale(0.95); }
        .nw-tbtn:disabled { opacity: .5; cursor: default; }
        .nw-treset:hover { opacity: 1 !important; }
      `}</style>

      {reached && (
        <div
          className="text-xs font-semibold"
          style={{
            color: isNeon ? accentBright : accent,
            textShadow: "var(--w-text-shadow)",
            fontFamily: isNeon ? "monospace" : undefined,
            letterSpacing: isNeon ? "1px" : undefined,
          }}
        >
          {reached ? reachedLabel : ""}
        </div>
      )}

      <div className="flex items-center" style={{ gap: 8 }}>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="nw-tbtn inline-flex items-center font-semibold"
          style={{
            ...addStyle,
            gap: 6,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: isNeon ? 4 : 10,
          }}
        >
          {icon ?? <PlusIcon color={isNeon ? accentBright : btnText} />}
          {addLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="nw-tbtn nw-treset font-medium"
          style={{ ...resetStyle, fontSize: 12, padding: "8px 10px", borderRadius: isNeon ? 4 : 8 }}
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
