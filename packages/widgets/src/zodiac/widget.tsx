"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ZodiacParams } from "./schema";
import {
  resolveSign,
  formatDateRange,
  ELEMENT_LABELS,
  type ZodiacSign,
} from "./signs";

// Fixed decorative background stars (normalized to the 100×100 viewBox)
const BG_STARS: Array<[number, number, number]> = [
  [8, 14, 0.7],
  [90, 22, 0.9],
  [12, 88, 0.8],
  [94, 78, 0.6],
  [72, 10, 0.7],
  [40, 8, 0.5],
  [6, 52, 0.6],
  [96, 50, 0.8],
  [26, 94, 0.5],
  [64, 92, 0.7],
  [48, 30, 0.4],
  [82, 40, 0.5],
];

interface ConstellationProps {
  sign: ZodiacSign;
  accent: string;
  faint: string;
  neon: boolean;
  dark: boolean;
  size: number;
}

function Constellation({ sign, accent, faint, neon, dark, size }: ConstellationProps) {
  const glow = neon
    ? `drop-shadow(0 0 3px ${accent}) drop-shadow(0 0 7px ${accent})`
    : dark
      ? `drop-shadow(0 0 2px ${accent}80)`
      : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* decorative background stars */}
      {BG_STARS.map(([x, y, o], i) => (
        <circle key={`bg-${i}`} cx={x} cy={y} r={0.7} fill={faint} opacity={o * 0.6} />
      ))}

      <g style={{ filter: glow }}>
        {/* connecting lines */}
        {sign.lines.map(([a, b], i) => {
          const [x1, y1] = sign.stars[a];
          const [x2, y2] = sign.stars[b];
          return (
            <line
              key={`ln-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={accent}
              strokeWidth={0.9}
              strokeLinecap="round"
              opacity={0.55}
            />
          );
        })}
        {/* main stars */}
        {sign.stars.map(([x, y], i) => (
          <g key={`st-${i}`}>
            <circle cx={x} cy={y} r={3.4} fill={accent} opacity={0.16} />
            <circle cx={x} cy={y} r={1.7} fill={accent} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function TraitChips({
  traits,
  accent,
  tint,
  border,
}: {
  traits: string[];
  accent: string;
  tint: string;
  border: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {traits.map((t) => (
        <span
          key={t}
          className="rounded-full px-2.5 py-1 text-[11px] font-medium leading-none"
          style={{
            color: accent,
            backgroundColor: tint,
            border: `1px solid ${border}`,
            textShadow: "var(--w-text-shadow)",
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function ZodiacWidget({ params }: { params: ZodiacParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const dark = colorMode === "dark";
  const neon = params.style === "neon";
  const isKo = params.locale.startsWith("ko");

  const sign = resolveSign(params.birthday);
  const name = isKo ? sign.nameKo : sign.name;
  const traits = isKo ? sign.traitsKo : sign.traits;
  const planet = isKo ? sign.planetKo : sign.planet;
  const dateRange = formatDateRange(sign, params.locale);
  const el = ELEMENT_LABELS[sign.element];
  const elementLabel = isKo ? el.ko : el.en;

  const accent = `#${colors.accent}`;
  const text = `#${colors.text}`;
  const dim = `#${colors.textDim}`;
  const faint = `#${colors.textFaint}`;
  const tint = `#${colors.accentTint}`;
  const border = `#${colors.border}`;

  const textShadow = { textShadow: "var(--w-text-shadow)" } as const;

  // ---- Compact ----
  if (params.variant === "compact") {
    return (
      <WidgetShell params={params}>
        <div className="flex items-center gap-4 px-6">
          <div className="relative flex items-center justify-center">
            <Constellation
              sign={sign}
              accent={accent}
              faint={faint}
              neon={neon}
              dark={dark}
              size={72}
            />
            <span
              className="absolute text-2xl"
              style={{ color: accent, ...textShadow }}
            >
              {sign.glyph}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg font-semibold leading-tight"
              style={{ color: text, ...textShadow }}
            >
              {name}
            </span>
            <span className="text-xs" style={{ color: dim }}>
              {dateRange}
            </span>
            <span className="mt-0.5 text-[11px]" style={{ color: faint }}>
              {el.symbol} {elementLabel} · {planet}
            </span>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ---- Constellation (star map focus) ----
  if (params.variant === "constellation") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center px-6">
          <Constellation
            sign={sign}
            accent={accent}
            faint={faint}
            neon={neon}
            dark={dark}
            size={190}
          />
          <div className="mt-4 flex items-center gap-2.5">
            <span className="text-2xl" style={{ color: accent, ...textShadow }}>
              {sign.glyph}
            </span>
            <span
              className="text-xl font-semibold tracking-wide"
              style={{ color: text, ...textShadow }}
            >
              {name}
            </span>
          </div>
          <span className="mt-1 text-xs" style={{ color: dim }}>
            {dateRange}
          </span>
          {params.showTraits && (
            <div className="mt-3">
              <TraitChips traits={traits} accent={accent} tint={tint} border={border} />
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  // ---- Card (default) ----
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center px-6">
        <div className="relative flex items-center justify-center">
          <Constellation
            sign={sign}
            accent={accent}
            faint={faint}
            neon={neon}
            dark={dark}
            size={128}
          />
          <span
            className="absolute text-4xl"
            style={{ color: accent, opacity: 0.92, ...textShadow }}
          >
            {sign.glyph}
          </span>
        </div>

        <h2
          className="mt-3 text-2xl font-bold tracking-wide"
          style={{ color: text, ...textShadow }}
        >
          {name}
        </h2>
        <span className="mt-1 text-[13px]" style={{ color: dim }}>
          {dateRange}
        </span>

        <div className="mt-2.5 flex items-center gap-3 text-xs" style={{ color: faint }}>
          <span className="flex items-center gap-1">
            <span style={{ color: accent }}>{el.symbol}</span>
            {elementLabel}
          </span>
          <span style={{ color: border }}>|</span>
          <span>{planet}</span>
        </div>

        {params.showTraits && (
          <div className="mt-4">
            <TraitChips traits={traits} accent={accent} tint={tint} border={border} />
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
