"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { CounterParams } from "./schema";
import { getCounterStrings } from "./strings";

/* ─────────────────────────── helpers ─────────────────────────── */

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const STORAGE_PREFIX = "nw:counter:v1:";

function readStored(label: string): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + label);
    if (raw === null) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.round(n) : 0;
  } catch {
    return 0;
  }
}

function writeStored(label: string, value: number): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + label, String(value));
  } catch {
    // localStorage unavailable — in-memory state still works for the session.
  }
}

const MIN = -1_000_000;
const MAX = 1_000_000;

/* ─────────────────────────── button styling ─────────────────────────── */

interface ButtonSet {
  minus: CSSProperties;
  plus: CSSProperties;
}

function buttonStyles(
  style: string,
  colors: ReturnType<typeof resolveColors>,
  mode: "dark" | "light",
  size: number,
): ButtonSet {
  const accent = `#${colors.accent}`;
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    fontSize: Math.round(size * 0.46),
    lineHeight: 1,
    fontWeight: 500,
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    padding: 0,
  };

  if (style === "neon") {
    const neon: CSSProperties = {
      ...base,
      background: "transparent",
      border: `1px solid ${accent}`,
      color: accent,
      borderRadius: 4,
      textShadow: "var(--w-text-shadow)",
      boxShadow: `inset 0 0 12px ${hexToRgba(accent, 0.08)}, 0 0 10px ${hexToRgba(accent, 0.12)}`,
    };
    return {
      minus: neon,
      plus: { ...neon, background: hexToRgba(accent, 0.1) },
    };
  }

  if (style === "glass") {
    const radius = Math.round(size * 0.32);
    const neutral: CSSProperties = {
      ...base,
      background: mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)",
      border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.18)" : hexToRgba(accent, 0.18)}`,
      color: `#${colors.text}`,
      borderRadius: radius,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    };
    return {
      minus: neutral,
      plus: {
        ...neutral,
        background: hexToRgba(accent, mode === "dark" ? 0.3 : 0.22),
        border: `1px solid ${hexToRgba(accent, 0.4)}`,
        color: accent,
      },
    };
  }

  // minimal & soft share the outline-minus / filled-accent-plus language.
  const radius = Math.round(size * 0.32);
  const minus: CSSProperties = {
    ...base,
    background: "transparent",
    border: `1.5px solid #${colors.border}`,
    color: `#${colors.textDim}`,
    borderRadius: radius,
  };
  const plus: CSSProperties = {
    ...base,
    background: accent,
    border: `1.5px solid ${accent}`,
    color: `#${colors.btnText}`,
    borderRadius: radius,
    boxShadow: style === "soft" ? `0 4px 14px ${hexToRgba(accent, 0.32)}` : "none",
  };
  return { minus, plus };
}

/* ─────────────────────────── component ─────────────────────────── */

export function CounterWidget({ params }: { params: CounterParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const t = getCounterStrings(params.locale);
  const isNeon = params.style === "neon";
  const accent = `#${colors.accent}`;
  const step = Math.max(1, Math.floor(params.step || 1));

  const labels = useMemo<string[]>(() => {
    if (params.variant === "multi") {
      const parts = params.label
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length >= 2) return parts.slice(0, 3);
      return [...t.fallback];
    }
    return [params.label.trim() || "Count"];
  }, [params.variant, params.label, t.fallback]);

  // Deterministic initial values keep SSR and the first client paint identical.
  const [counts, setCounts] = useState<number[]>(() => labels.map(() => 0));

  // Hydrate from localStorage after mount; re-run when the label set changes.
  useEffect(() => {
    setCounts(labels.map((l) => readStored(l)));
  }, [labels]);

  const change = useCallback(
    (i: number, delta: number) => {
      setCounts((prev) => {
        const next = [...prev];
        next[i] = Math.max(MIN, Math.min(MAX, (next[i] ?? 0) + delta));
        writeStored(labels[i], next[i]);
        return next;
      });
    },
    [labels],
  );

  const resetAll = useCallback(() => {
    setCounts(() => {
      const next = labels.map(() => 0);
      labels.forEach((l) => writeStored(l, 0));
      return next;
    });
  }, [labels]);

  const fmt = useCallback(
    (n: number) => {
      try {
        return n.toLocaleString(params.locale);
      } catch {
        return String(n);
      }
    },
    [params.locale],
  );

  const isMulti = params.variant === "multi";
  const btnSize = isMulti ? 38 : 56;
  const { minus: minusStyle, plus: plusStyle } = buttonStyles(params.style, colors, mode, btnSize);

  const labelStyle: CSSProperties = isNeon
    ? {
        color: accent,
        opacity: 0.6,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        fontSize: isMulti ? 12 : 13,
      }
    : {
        color: `#${colors.textDim}`,
        fontSize: isMulti ? 13 : 14,
        fontWeight: 500,
        letterSpacing: isMulti ? "0.01em" : "0.02em",
      };

  const valueStyle = (size: string): CSSProperties => ({
    color: accent,
    fontSize: size,
    fontWeight: isNeon ? 500 : 700,
    lineHeight: 1,
    letterSpacing: isNeon ? "0.02em" : "-0.02em",
    textShadow: "var(--w-text-shadow)",
    fontVariantNumeric: "tabular-nums",
  });

  const styleTag = (
    <style>{`
      .nw-ctr-btn { transition: transform .08s ease, filter .15s ease, opacity .15s ease; }
      .nw-ctr-btn:hover { filter: brightness(1.08); }
      .nw-ctr-btn:active { transform: scale(0.9); }
      .nw-ctr-reset { transition: opacity .15s ease, color .15s ease; }
      .nw-ctr-reset:hover { opacity: 1 !important; }
    `}</style>
  );

  const resetStyle: CSSProperties = isNeon
    ? { color: accent, opacity: 0.55, fontSize: 12, letterSpacing: "0.12em", background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }
    : { color: `#${colors.textFaint}`, opacity: 0.85, fontSize: 12, fontWeight: 500, letterSpacing: "0.02em", background: "none", border: "none", cursor: "pointer", padding: "4px 6px" };

  const resetNode = (
    <button type="button" className="nw-ctr-reset" style={resetStyle} onClick={resetAll} aria-label={t.reset}>
      {isNeon ? `[ ${t.reset.toUpperCase()} ]` : `↺ ${t.reset}`}
    </button>
  );

  if (isMulti) {
    return (
      <WidgetShell params={params}>
        {styleTag}
        <div className="flex flex-col w-full" style={{ gap: 14, maxWidth: 340, minWidth: 240 }}>
          {labels.map((label, i) => (
            <div key={`${label}-${i}`} className="flex items-center" style={{ gap: 12 }}>
              <span className="flex-1 truncate" style={labelStyle} title={label}>
                {label}
              </span>
              <div className="flex items-center" style={{ gap: 10 }}>
                <button
                  type="button"
                  className="nw-ctr-btn"
                  style={minusStyle}
                  onClick={() => change(i, -step)}
                  aria-label={`${label} minus ${step}`}
                >
                  −
                </button>
                <span
                  className="text-center"
                  style={{ ...valueStyle("1.9rem"), minWidth: 56, display: "inline-block" }}
                >
                  {fmt(counts[i] ?? 0)}
                </span>
                <button
                  type="button"
                  className="nw-ctr-btn"
                  style={plusStyle}
                  onClick={() => change(i, step)}
                  aria-label={`${label} plus ${step}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center" style={{ marginTop: 4 }}>
            {resetNode}
          </div>
        </div>
      </WidgetShell>
    );
  }

  // single variant
  return (
    <WidgetShell params={params}>
      {styleTag}
      <div className="flex flex-col items-center" style={{ gap: 18 }}>
        <span style={labelStyle}>{isNeon ? `> ${labels[0]}` : labels[0]}</span>
        <span style={valueStyle("4.5rem")}>{fmt(counts[0] ?? 0)}</span>
        <div className="flex items-center" style={{ gap: 18 }}>
          <button
            type="button"
            className="nw-ctr-btn"
            style={minusStyle}
            onClick={() => change(0, -step)}
            aria-label={`minus ${step}`}
          >
            −
          </button>
          <button
            type="button"
            className="nw-ctr-btn"
            style={plusStyle}
            onClick={() => change(0, step)}
            aria-label={`plus ${step}`}
          >
            +
          </button>
        </div>
        {resetNode}
      </div>
    </WidgetShell>
  );
}
