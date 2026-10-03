"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { RoadmapParams } from "./schema";
import { getSample, getStepWord, getDoneWord, parseSteps } from "./data";

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

type NodeState = "done" | "active" | "upcoming";

interface Ctx {
  accent: string;
  accentBright: string;
  track: string;
  text: string;
  dim: string;
  faint: string;
  activeIndex: number; // 0-indexed stage in progress; >= count means all done
  count: number;
  isNeon: boolean;
}

function stateOf(i: number, ctx: Ctx): NodeState {
  if (i < ctx.activeIndex) return "done";
  if (i === ctx.activeIndex) return "active";
  return "upcoming";
}

function nodeGlow(ctx: Ctx, state: NodeState): string {
  if (!ctx.isNeon || state === "upcoming") return "none";
  const c = state === "active" ? ctx.accentBright : ctx.accent;
  return `0 0 10px ${hexToRgba(c, 0.8)}, 0 0 20px ${hexToRgba(c, 0.4)}`;
}

// Label color per state. In neon style, primary text glows in the accent so the
// text-shadow reads as intentional neon on both light and dark backgrounds
// (dark text + neon glow would otherwise smear on a light background).
function labelColor(state: NodeState, ctx: Ctx): string {
  if (state === "upcoming") return ctx.faint;
  if (state === "active") return ctx.accentBright;
  return ctx.isNeon ? ctx.accent : ctx.text;
}

export function RoadmapWidget({ params }: { params: RoadmapParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isNeon = params.style === "neon";

  const sample = getSample(params.locale);
  const steps = parseSteps(params.steps, sample.steps);
  const count = steps.length;
  // current is 1-indexed; clamp so the bar/counter never runs past the end.
  const activeIndex = Math.max(0, params.current - 1);

  const title = params.title.trim()
    ? params.title
    : params.steps.trim()
      ? ""
      : sample.title;

  const ctx: Ctx = {
    accent: `#${colors.accent}`,
    accentBright: `#${colors.accentBright}`,
    track: `#${colors.track}`,
    text: `#${colors.text}`,
    dim: `#${colors.textDim}`,
    faint: `#${colors.textFaint}`,
    activeIndex,
    count,
    isNeon,
  };

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes rm-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.9); opacity: 0; }
        }
      `}</style>
      <div style={{ width: "100%", maxWidth: 380, padding: "4px 10px" }}>
        {title && (
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: ctx.accent,
              textShadow: isNeon ? "var(--w-text-shadow)" : "none",
              marginBottom: 20,
              letterSpacing: "0.01em",
              textAlign: params.variant === "steps" ? "center" : "left",
            }}
          >
            {title}
          </div>
        )}
        {params.variant === "vertical" ? (
          <VerticalRoadmap steps={steps} ctx={ctx} />
        ) : params.variant === "bar" ? (
          <BarRoadmap steps={steps} ctx={ctx} locale={params.locale} />
        ) : (
          <StepsRoadmap steps={steps} ctx={ctx} />
        )}
      </div>
    </WidgetShell>
  );
}

/* --- shared node circle --- */
function NodeCircle({
  state,
  label,
  size,
  ctx,
}: {
  state: NodeState;
  label: string | number;
  size: number;
  ctx: Ctx;
}) {
  const base: CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: size * 0.42,
    fontWeight: 700,
    boxSizing: "border-box",
    boxShadow: nodeGlow(ctx, state),
    transition: "all 0.3s",
  };

  if (state === "done") {
    return (
      <div style={{ ...base, background: ctx.accent, color: colorOn(ctx) }}>
        <Check size={size * 0.5} />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div
        style={{
          ...base,
          background: ctx.isNeon ? "transparent" : ctx.accentBright,
          border: `2px solid ${ctx.accentBright}`,
          color: ctx.isNeon ? ctx.accentBright : colorOn(ctx),
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "50%",
            border: `2px solid ${ctx.accentBright}`,
            animation: "rm-pulse 1.8s ease-out infinite",
            pointerEvents: "none",
          }}
        />
        {label}
      </div>
    );
  }
  return (
    <div
      style={{
        ...base,
        background: "transparent",
        border: `2px solid ${ctx.track}`,
        color: ctx.faint,
      }}
    >
      {label}
    </div>
  );
}

// Text/icon color that sits on top of a filled accent chip.
function colorOn(ctx: Ctx): string {
  return ctx.isNeon ? "#0b0b0b" : "#ffffff";
}

function Check({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ----------------------------- Horizontal steps ----------------------------- */
function StepsRoadmap({ steps, ctx }: { steps: string[]; ctx: Ctx }) {
  const size = 34;
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {steps.map((label, i) => {
        const state = stateOf(i, ctx);
        const connectorDone = i < ctx.activeIndex;
        return (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {/* left connector */}
              <div
                style={{
                  height: 3,
                  flex: 1,
                  borderRadius: 2,
                  background: i === 0 ? "transparent" : connectorLineColor(i - 1 < ctx.activeIndex, ctx),
                }}
              />
              <NodeCircle state={state} label={i + 1} size={size} ctx={ctx} />
              {/* right connector */}
              <div
                style={{
                  height: 3,
                  flex: 1,
                  borderRadius: 2,
                  background: i === steps.length - 1 ? "transparent" : connectorLineColor(connectorDone, ctx),
                }}
              />
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: state === "upcoming" ? 500 : 600,
                color: labelColor(state, ctx),
                textAlign: "center",
                lineHeight: 1.3,
                wordBreak: "keep-all",
                textShadow: ctx.isNeon && state !== "upcoming" ? "var(--w-text-shadow)" : "none",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function connectorLineColor(done: boolean, ctx: Ctx): string {
  if (!done) return ctx.track;
  return ctx.isNeon ? hexToRgba(ctx.accent, 0.9) : ctx.accent;
}

/* ------------------------------ Vertical timeline ------------------------------ */
function VerticalRoadmap({ steps, ctx }: { steps: string[]; ctx: Ctx }) {
  const size = 30;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {steps.map((label, i) => {
        const state = stateOf(i, ctx);
        const isLast = i === steps.length - 1;
        return (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <NodeCircle state={state} label={i + 1} size={size} ctx={ctx} />
              {!isLast && (
                <div
                  style={{
                    width: 3,
                    flex: 1,
                    minHeight: 24,
                    borderRadius: 2,
                    marginTop: 2,
                    marginBottom: 2,
                    background: connectorLineColor(i < ctx.activeIndex, ctx),
                  }}
                />
              )}
            </div>
            <div style={{ paddingTop: 4, paddingBottom: isLast ? 0 : 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: state === "upcoming" ? 500 : 600,
                  color: labelColor(state, ctx),
                  lineHeight: 1.3,
                  textShadow: ctx.isNeon && state !== "upcoming" ? "var(--w-text-shadow)" : "none",
                }}
              >
                {label}
              </div>
              {state === "active" && (
                <div style={{ fontSize: 11, color: ctx.dim, marginTop: 2 }}>
                  {ctx.isNeon ? "> in progress" : "In progress"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- Bar / stepper --------------------------------- */
function BarRoadmap({
  steps,
  ctx,
  locale,
}: {
  steps: string[];
  ctx: Ctx;
  locale: string;
}) {
  const n = steps.length;
  const allDone = ctx.activeIndex >= n;
  const shownStep = Math.min(ctx.activeIndex + 1, n);
  // Reaching the final stage = 100%.
  const pct = n <= 1 ? (allDone ? 100 : ctx.activeIndex >= 1 ? 100 : 0) : Math.min(100, (ctx.activeIndex / (n - 1)) * 100);
  const currentLabel = allDone ? getDoneWord(locale) : steps[ctx.activeIndex];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: ctx.isNeon ? ctx.accentBright : ctx.text,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textShadow: ctx.isNeon ? "var(--w-text-shadow)" : "none",
          }}
        >
          {currentLabel}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: ctx.dim, flexShrink: 0 }}>
          {getStepWord(locale)} {shownStep} / {n}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          background: ctx.isNeon ? hexToRgba(ctx.track, 0.5) : ctx.track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${ctx.accent}, ${ctx.accentBright})`,
            boxShadow: ctx.isNeon ? `0 0 12px ${hexToRgba(ctx.accent, 0.8)}` : "none",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: ctx.faint }}>{steps[0]}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: ctx.accentBright }}>
          {Math.round(pct)}%
        </span>
        <span style={{ fontSize: 12, color: ctx.faint, textAlign: "right" }}>{steps[n - 1]}</span>
      </div>
    </div>
  );
}
