"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { CalculatorParams } from "./schema";

/* ─────────────────────────── math engine ─────────────────────────── */

type Op = "add" | "sub" | "mul" | "div";

const OP_SYMBOL: Record<Op, string> = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
};

interface CalcState {
  display: string; // raw numeric string (no grouping), or "Error"
  previous: number | null;
  op: Op | null;
  overwrite: boolean; // next digit replaces display
  expr: string; // secondary line (running expression)
}

const INITIAL: CalcState = {
  display: "0",
  previous: null,
  op: null,
  overwrite: true,
  expr: "",
};

const MAX_DIGITS = 12;

/** Convert a number to a clean, re-parseable string (no float noise, no grouping). */
function toNumStr(n: number): string {
  if (!isFinite(n)) return "Error";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  // Fall back to precision trimming for very large / very small / noisy values.
  if (abs >= 1e12 || abs < 1e-9 || n.toString().replace(/[-.]/g, "").length > MAX_DIGITS) {
    return parseFloat(n.toPrecision(MAX_DIGITS)).toString();
  }
  return n.toString();
}

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case "add":
      return a + b;
    case "sub":
      return a - b;
    case "mul":
      return a * b;
    case "div":
      return b === 0 ? NaN : a / b;
  }
}

type Action =
  | { type: "digit"; value: string }
  | { type: "dot" }
  | { type: "op"; value: Op }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "delete" }
  | { type: "unary"; value: "negate" | "percent" | "sqrt" | "square" | "reciprocal" | "pi" };

function reducer(state: CalcState, action: Action): CalcState {
  const err = state.display === "Error";

  switch (action.type) {
    case "clear":
      return INITIAL;

    case "digit": {
      // After an error, start completely fresh.
      if (err) return { ...INITIAL, display: action.value, overwrite: false };
      // While "overwrite" is set (just after an operator or a result), the new
      // digit starts a fresh operand — but we must KEEP the pending op/previous.
      if (state.overwrite) return { ...state, display: action.value, overwrite: false };
      if (state.display === "0") return { ...state, display: action.value, overwrite: false };
      if (state.display.replace(/[-.]/g, "").length >= MAX_DIGITS) return state;
      return { ...state, display: state.display + action.value, overwrite: false };
    }

    case "dot": {
      if (err || state.overwrite) return { ...state, display: "0.", overwrite: false };
      if (state.display.includes(".")) return state;
      return { ...state, display: state.display + ".", overwrite: false };
    }

    case "delete": {
      if (err) return INITIAL;
      if (state.overwrite) return state;
      const trimmed = state.display.length > 1 ? state.display.slice(0, -1) : "0";
      const cleaned = trimmed === "-" || trimmed === "-0" ? "0" : trimmed;
      return { ...state, display: cleaned };
    }

    case "op": {
      if (err) return state;
      const cur = parseFloat(state.display);
      // Chained operation: fold the pending op before setting the new one.
      if (state.previous !== null && state.op && !state.overwrite) {
        const result = compute(state.previous, cur, state.op);
        const resultStr = toNumStr(result);
        return {
          display: resultStr,
          previous: resultStr === "Error" ? null : result,
          op: resultStr === "Error" ? null : action.value,
          overwrite: true,
          expr: resultStr === "Error" ? "" : `${resultStr} ${OP_SYMBOL[action.value]}`,
        };
      }
      return {
        ...state,
        previous: cur,
        op: action.value,
        overwrite: true,
        expr: `${toNumStr(cur)} ${OP_SYMBOL[action.value]}`,
      };
    }

    case "equals": {
      if (err || state.op === null || state.previous === null) return state;
      const cur = parseFloat(state.display);
      const result = compute(state.previous, cur, state.op);
      const resultStr = toNumStr(result);
      return {
        display: resultStr,
        previous: null,
        op: null,
        overwrite: true,
        expr:
          resultStr === "Error"
            ? ""
            : `${toNumStr(state.previous)} ${OP_SYMBOL[state.op]} ${toNumStr(cur)} =`,
      };
    }

    case "unary": {
      if (err && action.value !== "pi") return state;
      if (action.value === "pi") {
        return { ...state, display: toNumStr(Math.PI), overwrite: true, expr: "" };
      }
      const v = parseFloat(state.display);
      if (action.value === "negate") {
        if (v === 0) return state;
        return { ...state, display: toNumStr(-v) };
      }
      let result: number;
      let label: string;
      if (action.value === "percent") {
        result = v / 100;
        label = `${toNumStr(v)}%`;
      } else if (action.value === "sqrt") {
        result = v < 0 ? NaN : Math.sqrt(v);
        label = `√${toNumStr(v)}`;
      } else if (action.value === "square") {
        result = v * v;
        label = `${toNumStr(v)}²`;
      } else {
        result = v === 0 ? NaN : 1 / v;
        label = `1/${toNumStr(v)}`;
      }
      const resultStr = toNumStr(result);
      return {
        ...state,
        display: resultStr,
        overwrite: true,
        expr: resultStr === "Error" ? "" : label,
      };
    }
  }
}

/** Render a raw numeric string with optional thousands grouping. */
function formatDisplay(raw: string, grouping: boolean): string {
  if (raw === "Error") return raw;
  const neg = raw.startsWith("-");
  const body = neg ? raw.slice(1) : raw;
  const [intPart, decPart] = body.split(".");
  const groupedInt = grouping ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : intPart;
  let out = groupedInt;
  if (body.includes(".")) out += "." + (decPart ?? "");
  return (neg ? "-" : "") + out;
}

/* ─────────────────────────── layout ─────────────────────────── */

type BtnKind = "digit" | "fn" | "op" | "equals" | "sci";

interface BtnDef {
  label: string;
  kind: BtnKind;
  action: Action;
  span?: number;
}

const DIGIT = (d: string): BtnDef => ({ label: d, kind: "digit", action: { type: "digit", value: d } });
const OP = (label: string, value: Op): BtnDef => ({ label, kind: "op", action: { type: "op", value } });
const FN = (label: string, action: Action): BtnDef => ({ label, kind: "fn", action });
const SCI = (label: string, action: Action): BtnDef => ({ label, kind: "sci", action });

const EQUALS: BtnDef = { label: "=", kind: "equals", action: { type: "equals" }, span: 2 };
const ZERO: BtnDef = { label: "0", kind: "digit", action: { type: "digit", value: "0" }, span: 2 };
const DOT: BtnDef = { label: ".", kind: "digit", action: { type: "dot" } };

const BASIC: BtnDef[] = [
  FN("AC", { type: "clear" }),
  FN("±", { type: "unary", value: "negate" }),
  FN("%", { type: "unary", value: "percent" }),
  OP("÷", "div"),
  DIGIT("7"), DIGIT("8"), DIGIT("9"), OP("×", "mul"),
  DIGIT("4"), DIGIT("5"), DIGIT("6"), OP("−", "sub"),
  DIGIT("1"), DIGIT("2"), DIGIT("3"), OP("+", "add"),
  ZERO, DOT, EQUALS,
];

const SCIENTIFIC: BtnDef[] = [
  FN("AC", { type: "clear" }),
  FN("±", { type: "unary", value: "negate" }),
  FN("%", { type: "unary", value: "percent" }),
  OP("÷", "div"),
  SCI("√", { type: "unary", value: "sqrt" }),
  DIGIT("7"), DIGIT("8"), DIGIT("9"), OP("×", "mul"), SCI("x²", { type: "unary", value: "square" }),
  DIGIT("4"), DIGIT("5"), DIGIT("6"), OP("−", "sub"), SCI("1/x", { type: "unary", value: "reciprocal" }),
  DIGIT("1"), DIGIT("2"), DIGIT("3"), OP("+", "add"), SCI("π", { type: "unary", value: "pi" }),
  ZERO, DOT, EQUALS,
];

/* ─────────────────────────── colors ─────────────────────────── */

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

interface BtnSkin {
  background: string;
  color: string;
  border: string;
  boxShadow?: string;
  textShadow?: string;
  fontWeight?: number;
}

function buildSkins(
  style: string,
  colors: ReturnType<typeof resolveColors>,
  isDark: boolean,
): Record<BtnKind, BtnSkin> {
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const btnText = `#${colors.btnText}`;
  const surface2 = `#${colors.surface2}`;
  const inset = `#${colors.inset}`;
  const borderSoft = `#${colors.borderSoft}`;
  const borderStrong = `#${colors.borderStrong}`;

  if (style === "neon") {
    const faint = hexToRgba(colors.accent, 0.35);
    return {
      digit: {
        background: "transparent",
        color: accentBright,
        border: `1px solid ${hexToRgba(colors.accent, 0.25)}`,
        fontWeight: 500,
      },
      fn: {
        background: "transparent",
        color: hexToRgba(colors.accentBright, 0.75),
        border: `1px solid ${hexToRgba(colors.accent, 0.2)}`,
        fontWeight: 500,
      },
      sci: {
        background: "transparent",
        color: hexToRgba(colors.accentBright, 0.75),
        border: `1px solid ${hexToRgba(colors.accent, 0.2)}`,
        fontWeight: 500,
      },
      op: {
        background: "transparent",
        color: accentBright,
        border: `1.5px solid ${accent}`,
        boxShadow: `0 0 8px ${faint}, inset 0 0 6px ${hexToRgba(colors.accent, 0.12)}`,
        textShadow: `0 0 8px ${accentBright}`,
        fontWeight: 600,
      },
      equals: {
        background: hexToRgba(colors.accent, 0.14),
        color: accentBright,
        border: `1.5px solid ${accent}`,
        boxShadow: `0 0 12px ${faint}, inset 0 0 8px ${hexToRgba(colors.accent, 0.18)}`,
        textShadow: `0 0 10px ${accentBright}`,
        fontWeight: 700,
      },
    };
  }

  if (style === "glass") {
    const digitBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.55)";
    const digitBorder = isDark ? "rgba(255,255,255,0.12)" : hexToRgba(colors.accent, 0.14);
    const fnBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.35)";
    return {
      digit: {
        background: digitBg,
        color: text,
        border: `1px solid ${digitBorder}`,
        boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
        fontWeight: 500,
      },
      fn: {
        background: fnBg,
        color: textDim,
        border: `1px solid ${digitBorder}`,
        fontWeight: 500,
      },
      sci: {
        background: fnBg,
        color: accent,
        border: `1px solid ${hexToRgba(colors.accent, 0.22)}`,
        fontWeight: 500,
      },
      op: {
        background: hexToRgba(colors.accent, isDark ? 0.28 : 0.2),
        color: isDark ? accentBright : accent,
        border: `1px solid ${hexToRgba(colors.accent, 0.4)}`,
        fontWeight: 600,
      },
      equals: {
        background: hexToRgba(colors.accent, isDark ? 0.9 : 0.92),
        color: btnText,
        border: `1px solid ${hexToRgba(colors.accent, 0.5)}`,
        boxShadow: `0 4px 14px ${hexToRgba(colors.accent, 0.3)}`,
        fontWeight: 700,
      },
    };
  }

  // soft
  if (style === "soft") {
    return {
      digit: {
        background: isDark ? surface2 : "#ffffff",
        color: text,
        border: `1px solid ${isDark ? borderSoft : borderSoft}`,
        boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
        fontWeight: 500,
      },
      fn: {
        background: inset,
        color: textDim,
        border: `1px solid ${borderSoft}`,
        fontWeight: 500,
      },
      sci: {
        background: hexToRgba(colors.accent, isDark ? 0.14 : 0.1),
        color: accent,
        border: `1px solid ${hexToRgba(colors.accent, 0.18)}`,
        fontWeight: 500,
      },
      op: {
        background: hexToRgba(colors.accent, isDark ? 0.18 : 0.12),
        color: accent,
        border: `1px solid ${hexToRgba(colors.accent, 0.22)}`,
        fontWeight: 600,
      },
      equals: {
        background: accent,
        color: btnText,
        border: "none",
        boxShadow: `0 2px 10px ${hexToRgba(colors.accent, 0.28)}`,
        fontWeight: 700,
      },
    };
  }

  // minimal (default)
  return {
    digit: {
      background: surface2,
      color: text,
      border: `1px solid ${borderSoft}`,
      fontWeight: 500,
    },
    fn: {
      background: inset,
      color: textDim,
      border: `1px solid ${borderSoft}`,
      fontWeight: 500,
    },
    sci: {
      background: inset,
      color: accent,
      border: `1px solid ${borderStrong}`,
      fontWeight: 500,
    },
    op: {
      background: hexToRgba(colors.accent, isDark ? 0.16 : 0.1),
      color: accent,
      border: `1px solid ${hexToRgba(colors.accent, 0.3)}`,
      fontWeight: 600,
    },
    equals: {
      background: accent,
      color: btnText,
      border: "none",
      fontWeight: 700,
    },
  };
}

/* ─────────────────────────── component ─────────────────────────── */

export function CalculatorWidget({ params }: { params: CalculatorParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";
  const isScientific = params.variant === "scientific";

  const [state, dispatch] = useReducer(reducer, INITIAL);

  const buttons = isScientific ? SCIENTIFIC : BASIC;
  const cols = isScientific ? 5 : 4;
  const skins = useMemo(() => buildSkins(params.style, colors, isDark), [params.style, colors, isDark]);

  const monoFont = isNeon ? "var(--font-geist-mono, 'Courier New', monospace)" : undefined;
  const radius = isNeon ? 6 : params.style === "soft" || params.style === "glass" ? 14 : 12;

  // Physical keyboard support.
  const handleKey = useCallback((e: KeyboardEvent) => {
    const k = e.key;
    if (k >= "0" && k <= "9") dispatch({ type: "digit", value: k });
    else if (k === ".") dispatch({ type: "dot" });
    else if (k === "+") dispatch({ type: "op", value: "add" });
    else if (k === "-") dispatch({ type: "op", value: "sub" });
    else if (k === "*") dispatch({ type: "op", value: "mul" });
    else if (k === "/") { e.preventDefault(); dispatch({ type: "op", value: "div" }); }
    else if (k === "Enter" || k === "=") { e.preventDefault(); dispatch({ type: "equals" }); }
    else if (k === "Backspace") dispatch({ type: "delete" });
    else if (k === "Escape") dispatch({ type: "clear" });
    else if (k === "%") dispatch({ type: "unary", value: "percent" });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const shown = formatDisplay(state.display, params.grouping);
  // Scale the font to the rendered width (commas/sign included) so long,
  // grouped results never clip.
  const len = shown.length;
  const displayFontSize = len <= 6 ? 42 : len <= 9 ? 34 : len <= 11 ? 28 : len <= 14 ? 22 : 18;

  const textColor = `#${colors.text}`;
  const dimColor = `#${colors.textDim}`;
  const accentBright = `#${colors.accentBright}`;

  const bodyWidth = isScientific ? 320 : 268;

  return (
    <WidgetShell params={params}>
      <style>{`
        .nw-calc-btn {
          cursor: pointer;
          transition: transform .1s ease, filter .15s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .nw-calc-btn:hover { filter: brightness(1.08); }
        .nw-calc-btn:active { transform: scale(0.94); }
      `}</style>
      <div style={{ width: "100%", maxWidth: bodyWidth, margin: "0 auto" }}>
        {/* Display */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            textAlign: "right",
            padding: isNeon ? "4px 10px 14px" : "6px 8px 16px",
            minHeight: 70,
          }}
        >
          <div
            className="tabular-nums"
            style={{
              fontSize: 13,
              lineHeight: 1,
              height: 16,
              color: isNeon ? hexToRgba(colors.accentBright, 0.6) : dimColor,
              fontFamily: monoFont,
              letterSpacing: isNeon ? "1px" : undefined,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
              width: "100%",
            }}
          >
            {state.expr || " "}
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: displayFontSize,
              fontWeight: isNeon ? 600 : 600,
              lineHeight: 1.1,
              marginTop: 6,
              color: isNeon ? accentBright : textColor,
              fontFamily: monoFont,
              textShadow: isNeon ? `0 0 12px ${accentBright}` : undefined,
              letterSpacing: isNeon ? "1px" : undefined,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip",
              textAlign: "right",
              width: "100%",
            }}
          >
            {shown}
          </div>
        </div>

        {/* Keypad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 8,
          }}
        >
          {buttons.map((b, i) => {
            const skin = skins[b.kind];
            return (
              <button
                key={i}
                type="button"
                className="nw-calc-btn"
                onClick={() => dispatch(b.action)}
                style={{
                  gridColumn: b.span ? `span ${b.span}` : undefined,
                  height: 50,
                  borderRadius: radius,
                  fontSize: b.kind === "sci" ? 16 : 20,
                  fontWeight: skin.fontWeight,
                  fontFamily: monoFont,
                  background: skin.background,
                  color: skin.color,
                  border: skin.border,
                  boxShadow: skin.boxShadow,
                  textShadow: skin.textShadow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                } as CSSProperties}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}
