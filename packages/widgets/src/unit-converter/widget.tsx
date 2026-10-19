"use client";

import { useState, type CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { UnitConverterParams } from "./schema";
import {
  CATEGORIES,
  CATEGORY_IDS,
  convert,
  formatResult,
  getUnit,
  type CategoryId,
} from "./data";

function SwapIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 3v8M4 3L2 5.2M4 3l2 2.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13V5M12 13l2-2.2M12 13l-2-2.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function normalizeUnits(category: CategoryId, from: string, to: string) {
  const units = CATEGORIES[category].units;
  const has = (id: string) => units.some((u) => u.id === id);
  const f = has(from) ? from : units[0].id;
  let t = has(to) ? to : units[1].id;
  if (t === f) t = units.find((u) => u.id !== f)?.id ?? units[1].id;
  return { from: f, to: t };
}

export function UnitConverterWidget({ params }: { params: UnitConverterParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const [category, setCategory] = useState<CategoryId>(params.category);
  const initUnits = normalizeUnits(params.category, params.from, params.to);
  const [from, setFrom] = useState(initUnits.from);
  const [to, setTo] = useState(initUnits.to);
  const [value, setValue] = useState<string>(String(params.value));

  const isNeon = params.style === "neon";
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const inset = `#${colors.inset}`;
  const surface2 = `#${colors.surface2}`;
  const border = `#${colors.border}`;
  const borderStrong = `#${colors.borderStrong}`;
  const btnText = `#${colors.btnText}`;
  const mono = isNeon ? "monospace" : undefined;

  const valueNum = value.trim() === "" ? NaN : Number(value);
  const result = Number.isNaN(valueNum) ? NaN : convert(category, valueNum, from, to);
  const resultText = formatResult(result);
  const fromSym = getUnit(category, from)?.symbol ?? from;
  const toSym = getUnit(category, to)?.symbol ?? to;

  const switchCategory = (c: CategoryId) => {
    if (c === category) return;
    // Reset to the new category's first two units.
    const u = normalizeUnits(c, "", "");
    setCategory(c);
    setFrom(u.from);
    setTo(u.to);
  };

  const cycleUnit = (which: "from" | "to") => {
    const units = CATEGORIES[category].units;
    const cur = which === "from" ? from : to;
    const idx = units.findIndex((u) => u.id === cur);
    const next = units[(idx + 1) % units.length].id;
    const other = which === "from" ? to : from;
    const chosen = next === other ? units[(idx + 2) % units.length].id : next;
    if (which === "from") setFrom(chosen);
    else setTo(chosen);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // ─── shared element styles ───
  const pill = (c: CategoryId) => {
    const active = c === category;
    const base: CSSProperties = {
      fontSize: 11,
      fontWeight: 600,
      padding: "5px 11px",
      borderRadius: isNeon ? 4 : 999,
      cursor: "pointer",
      letterSpacing: isNeon ? "1px" : "0.02em",
      fontFamily: mono,
      transition: "all .15s ease",
      textTransform: isNeon ? "uppercase" : "none",
    };
    if (isNeon) {
      return {
        ...base,
        background: "transparent",
        color: active ? accentBright : `${accent}99`,
        border: `1.5px solid ${active ? accent : `${accent}3a`}`,
        textShadow: active ? `0 0 8px ${accentBright}` : "none",
        boxShadow: active ? `0 0 8px ${accent}44` : "none",
      } as CSSProperties;
    }
    return {
      ...base,
      background: active ? accent : "transparent",
      color: active ? btnText : textDim,
      border: `1px solid ${active ? accent : border}`,
    } as CSSProperties;
  };

  const chipStyle: CSSProperties = isNeon
    ? {
        background: "transparent",
        color: accentBright,
        border: `1.5px solid ${accent}`,
        fontFamily: "monospace",
        textShadow: `0 0 6px ${accentBright}`,
        boxShadow: `inset 0 0 8px ${accent}18`,
      }
    : {
        background: surface2,
        color: text,
        border: `1px solid ${borderStrong}`,
      };

  const chip = (which: "from" | "to", sym: string, big = false) => (
    <button
      type="button"
      onClick={() => cycleUnit(which)}
      className="nw-uc-chip font-semibold"
      title="Tap to change unit"
      style={{
        ...chipStyle,
        fontSize: big ? 15 : 13,
        padding: big ? "7px 13px" : "6px 11px",
        borderRadius: isNeon ? 5 : 10,
        cursor: "pointer",
        lineHeight: 1,
        minWidth: big ? 52 : 44,
      }}
    >
      {sym}
    </button>
  );

  const inputStyle = (size: number): CSSProperties => ({
    width: `${Math.max(2, String(value || "0").length + 1)}ch`,
    minWidth: 48,
    maxWidth: 160,
    background: "transparent",
    border: "none",
    borderBottom: `2px solid ${isNeon ? `${accent}66` : borderStrong}`,
    outline: "none",
    color: isNeon ? accentBright : text,
    fontSize: size,
    fontWeight: 700,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    fontFamily: mono,
    textShadow: isNeon ? `0 0 8px ${accentBright}` : undefined,
    paddingBottom: 2,
  });

  const valueInput = (size: number) => (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (/^-?\d*\.?\d*$/.test(v)) setValue(v);
      }}
      className="nw-uc-input"
      style={inputStyle(size)}
      aria-label="value"
    />
  );

  const resultEl = (size: number) => (
    <span
      className="font-bold"
      style={{
        fontSize: size,
        color: isNeon ? accentBright : accent,
        fontVariantNumeric: "tabular-nums",
        fontFamily: mono,
        textShadow: isNeon ? `0 0 12px ${accentBright}` : "var(--w-text-shadow)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {resultText}
    </span>
  );

  // Scale the hero number down as it grows so it never wraps the card.
  const focusSize = (() => {
    const len = resultText.length;
    if (len <= 5) return 56;
    if (len <= 7) return 46;
    if (len <= 9) return 36;
    return 28;
  })();

  const swapBtn = (horizontal: boolean) => (
    <button
      type="button"
      onClick={swap}
      className="nw-uc-swap"
      aria-label="swap"
      style={{
        width: 32,
        height: 32,
        borderRadius: isNeon ? 6 : 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: isNeon ? "transparent" : inset,
        border: `1.5px solid ${isNeon ? accent : border}`,
        boxShadow: isNeon ? `0 0 8px ${accent}44` : undefined,
        transform: horizontal ? "rotate(90deg)" : "none",
      }}
    >
      <SwapIcon color={isNeon ? accentBright : textDim} />
    </button>
  );

  const pillsRow = (
    <div className="flex flex-wrap justify-center" style={{ gap: 6 }}>
      {CATEGORY_IDS.map((c) => (
        <button key={c} type="button" onClick={() => switchCategory(c)} style={pill(c)}>
          {params.locale.slice(0, 2) === "ko" ? CATEGORIES[c].nameKo : CATEGORIES[c].nameEn}
        </button>
      ))}
    </div>
  );

  const styleTag = (
    <style>{`
      .nw-uc-chip, .nw-uc-swap { transition: transform .12s ease, filter .15s ease; }
      .nw-uc-chip:hover, .nw-uc-swap:hover { filter: brightness(1.08); }
      .nw-uc-chip:active, .nw-uc-swap:active { transform: scale(0.94); }
      .nw-uc-swap:active { transform: scale(0.94); }
      .nw-uc-input:focus { border-bottom-color: ${accent} !important; }
      .nw-uc-input::-webkit-outer-spin-button, .nw-uc-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    `}</style>
  );

  let body: React.ReactNode;

  if (params.variant === "compact") {
    body = (
      <div className="flex flex-col items-center" style={{ gap: 12 }}>
        {pillsRow}
        <div className="flex items-center flex-wrap justify-center" style={{ gap: 10 }}>
          <div className="flex items-end" style={{ gap: 6 }}>
            {valueInput(26)}
            {chip("from", fromSym)}
          </div>
          <span style={{ color: isNeon ? accent : textFaint, fontSize: 18, fontFamily: mono }}>=</span>
          <div className="flex items-end" style={{ gap: 6 }}>
            {resultEl(26)}
            {chip("to", toSym)}
          </div>
        </div>
      </div>
    );
  } else if (params.variant === "focus") {
    body = (
      <div className="flex flex-col items-center" style={{ gap: 14 }}>
        {pillsRow}
        <div className="flex flex-col items-center" style={{ gap: 4, maxWidth: "100%" }}>
          <div className="flex items-baseline" style={{ gap: 8 }}>
            {resultEl(focusSize)}
            <span
              className="font-semibold"
              style={{ fontSize: 22, color: isNeon ? accent : textDim, fontFamily: mono }}
            >
              {toSym}
            </span>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          {valueInput(18)}
          {chip("from", fromSym)}
          {swapBtn(true)}
          {chip("to", toSym)}
        </div>
      </div>
    );
  } else {
    // ─── stack (default) ───
    const blockStyle: CSSProperties = {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 12,
      width: "100%",
      padding: "10px 4px",
    };
    const tag = (txt: string) => (
      <div
        className="font-semibold"
        style={{
          fontSize: 10,
          color: isNeon ? accentBright : textFaint,
          letterSpacing: isNeon ? "2px" : "0.1em",
          textTransform: "uppercase",
          fontFamily: mono,
          marginBottom: 2,
        }}
      >
        {isNeon ? `> ${txt}` : txt}
      </div>
    );
    body = (
      <div className="flex flex-col items-center" style={{ gap: 12, width: 248 }}>
        {pillsRow}
        <div className="flex flex-col items-center w-full" style={{ gap: 2 }}>
          <div style={blockStyle}>
            <div className="flex flex-col items-start">
              {tag(params.locale.slice(0, 2) === "ko" ? "입력" : "From")}
              {valueInput(30)}
            </div>
            {chip("from", fromSym, true)}
          </div>
          <div className="flex items-center w-full" style={{ gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: isNeon ? `${accent}33` : border }} />
            {swapBtn(false)}
            <div style={{ flex: 1, height: 1, background: isNeon ? `${accent}33` : border }} />
          </div>
          <div style={blockStyle}>
            <div className="flex flex-col items-start" style={{ minWidth: 0 }}>
              {tag(params.locale.slice(0, 2) === "ko" ? "결과" : "To")}
              {resultEl(30)}
            </div>
            {chip("to", toSym, true)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <WidgetShell params={params}>
      {styleTag}
      <div className="flex flex-col items-center" style={{ padding: "6px 16px" }}>
        {body}
      </div>
    </WidgetShell>
  );
}
