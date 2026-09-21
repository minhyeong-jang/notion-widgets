"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { BarChartParams } from "./schema";
import { getSample, parseData, type DataPoint } from "./data";

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

interface Ctx {
  accentColor: string;
  trackColor: string;
  textColor: string;
  dimColor: string;
  maxVal: number;
  isNeon: boolean;
  showValue: boolean;
}

export function BarChartWidget({ params }: { params: BarChartParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isNeon = params.style === "neon";

  const sample = getSample(params.locale);
  const data = parseData(params.data, sample.data);
  const title = params.title.trim()
    ? params.title
    : params.data.trim()
      ? ""
      : sample.title;

  const values = data.map((d) => d.value);
  const maxVal =
    params.max > 0 ? params.max : Math.max(1, ...values);

  const ctx: Ctx = {
    accentColor: `#${colors.accent}`,
    trackColor: hexToRgba(`#${colors.track}`, isNeon ? 0.5 : 1),
    textColor: `#${colors.text}`,
    dimColor: `#${colors.textDim}`,
    maxVal,
    isNeon,
    showValue: params.showValue,
  };

  return (
    <WidgetShell params={params}>
      <div style={{ width: "100%", maxWidth: 340, padding: "4px 8px" }}>
        {title && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: ctx.accentColor,
              textShadow: isNeon ? "var(--w-text-shadow)" : "none",
              marginBottom: 16,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </div>
        )}
        {params.variant === "rows" ? (
          <RowsChart data={data} ctx={ctx} />
        ) : params.variant === "line" ? (
          <LineChart data={data} ctx={ctx} />
        ) : (
          <BarsChart data={data} ctx={ctx} />
        )}
      </div>
    </WidgetShell>
  );
}

/* ----------------------------- Vertical bars ----------------------------- */
function BarsChart({ data, ctx }: { data: DataPoint[]; ctx: Ctx }) {
  const chartH = 118;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: chartH + 40 }}>
      {data.map((d, i) => {
        const pct = Math.max(0, Math.min(1, d.value / ctx.maxVal));
        const isMax = d.value === Math.max(...data.map((x) => x.value));
        const fill = isMax ? ctx.accentColor : hexToRgba(ctx.accentColor, 0.62);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
            {ctx.showValue && (
              <div style={{ fontSize: 11, fontWeight: 600, color: ctx.dimColor, marginBottom: 6 }}>
                {d.value}
              </div>
            )}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 26,
                height: chartH,
                borderRadius: 6,
                background: ctx.trackColor,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${pct * 100}%`,
                  minHeight: d.value > 0 ? 4 : 0,
                  background: fill,
                  borderRadius: 6,
                  boxShadow: ctx.isNeon ? `0 0 10px ${hexToRgba(ctx.accentColor, 0.7)}` : "none",
                  transition: "height 0.3s",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: ctx.dimColor, marginTop: 8, whiteSpace: "nowrap" }}>
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------- Horizontal rows ---------------------------- */
function RowsChart({ data, ctx }: { data: DataPoint[]; ctx: Ctx }) {
  const maxLabel = Math.min(64, Math.max(28, ...data.map((d) => d.label.length * 8)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((d, i) => {
        const pct = Math.max(0, Math.min(1, d.value / ctx.maxVal));
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: maxLabel,
                flexShrink: 0,
                fontSize: 12,
                color: ctx.dimColor,
                textAlign: "right",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {d.label}
            </div>
            <div
              style={{
                flex: 1,
                height: 12,
                borderRadius: 6,
                background: ctx.trackColor,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(pct * 100, d.value > 0 ? 3 : 0)}%`,
                  height: "100%",
                  borderRadius: 6,
                  background: ctx.accentColor,
                  boxShadow: ctx.isNeon ? `0 0 10px ${hexToRgba(ctx.accentColor, 0.7)}` : "none",
                }}
              />
            </div>
            {ctx.showValue && (
              <div style={{ width: 26, flexShrink: 0, fontSize: 12, fontWeight: 600, color: ctx.textColor, textAlign: "right" }}>
                {d.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Line / area ------------------------------ */
function LineChart({ data, ctx }: { data: DataPoint[]; ctx: Ctx }) {
  const w = 300;
  const h = 110;
  const pad = 14;
  const n = data.length;
  const stepX = n > 1 ? (w - 2 * pad) / (n - 1) : 0;
  const y = (v: number) => h - pad - (Math.max(0, Math.min(1, v / ctx.maxVal))) * (h - 2 * pad);
  const pts = data.map((d, i) => ({ x: pad + i * stepX, y: y(d.value) }));
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = n > 0 ? `${line} L${pts[n - 1].x.toFixed(1)},${h - pad} L${pts[0].x.toFixed(1)},${h - pad} Z` : "";
  const gid = `bc-grad-${ctx.accentColor.replace("#", "")}`;
  const glow: CSSProperties = ctx.isNeon
    ? { filter: `drop-shadow(0 0 5px ${hexToRgba(ctx.accentColor, 0.8)})` }
    : {};

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block", ...glow }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ctx.accentColor} stopOpacity={ctx.isNeon ? 0.45 : 0.32} />
            <stop offset="100%" stopColor={ctx.accentColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {area && <path d={area} fill={`url(#${gid})`} />}
        <path d={line} fill="none" stroke={ctx.accentColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.2} fill={ctx.accentColor} />
        ))}
        {ctx.showValue &&
          pts.map((p, i) => (
            <text
              key={`t${i}`}
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill={ctx.dimColor}
            >
              {data[i].value}
            </text>
          ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: `0 ${pad - 4}px` }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: ctx.dimColor, whiteSpace: "nowrap" }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
