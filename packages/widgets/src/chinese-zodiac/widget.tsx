"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ChineseZodiacParams } from "./schema";
import {
  ANIMALS,
  getAnimalById,
  getAnimalForYear,
  getElementForYear,
  animalIndexForYear,
  latestYearForAnimal,
} from "./animals";

/* ─── 12-branch cycle wheel (signature visual) ─── */

function BranchWheel({
  activeIndex,
  accent,
  dim,
  onColor,
  glow,
  size,
}: {
  activeIndex: number;
  accent: string;
  dim: string;
  onColor: string;
  glow: boolean;
  size: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - size * 0.11;
  const node = size * 0.085;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Chinese zodiac cycle"
      style={glow ? { filter: `drop-shadow(0 0 3px ${accent})` } : undefined}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth={1} opacity={0.16} />
      {ANIMALS.map((a, i) => {
        const ang = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        const active = i === activeIndex;
        return (
          <g key={a.id}>
            {active && glow && <circle cx={x} cy={y} r={node + 3} fill={accent} opacity={0.35} />}
            {active && <circle cx={x} cy={y} r={node} fill={accent} />}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.1}
              fontWeight={active ? 700 : 500}
              fill={active ? onColor : dim}
              opacity={active ? 1 : 0.55}
            >
              {a.branch}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatCol({
  label,
  value,
  textDim,
  text,
}: {
  label: string;
  value: string;
  textDim: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1">
      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: textDim }}>
        {label}
      </span>
      <span className="text-[12px] font-semibold" style={{ color: text }}>
        {value}
      </span>
    </div>
  );
}

/* ─── Main widget ─── */

export function ChineseZodiacWidget({ params }: { params: ChineseZodiacParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const onAccent = `#${colors.btnText}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const tint = `#${colors.accentTint}`;
  const divider = `${accent}22`;

  const isKo = params.locale.startsWith("ko");
  const isNeon = params.style === "neon";

  const currentYear = new Date().getFullYear();
  const animal =
    params.sign === "auto"
      ? getAnimalForYear(params.year)
      : getAnimalById(params.sign) ?? getAnimalForYear(params.year);

  const displayYear =
    params.sign === "auto" ? params.year : latestYearForAnimal(animal.id, currentYear);
  const activeIndex =
    params.sign === "auto"
      ? animalIndexForYear(params.year)
      : ANIMALS.findIndex((a) => a.id === animal.id);
  const element = getElementForYear(displayYear);
  const isYang = activeIndex % 2 === 0;

  const name = isKo ? animal.nameKo : animal.name;
  const traits = isKo ? animal.traitsKo : animal.traits;
  const labelText = isKo ? "띠" : "Chinese Zodiac";
  const elementLabel = isKo ? `${element.ko}(${element.hanja})` : `${element.hanja} ${element.en}`;

  const glyphGlow: CSSProperties = isNeon
    ? { textShadow: `0 0 16px ${accent}, 0 0 32px ${accentBright}` }
    : { textShadow: "var(--w-text-shadow)" };

  const sectionLabel = (
    <div
      className="text-[10px] font-semibold uppercase tracking-[0.25em]"
      style={{ color: isNeon ? accent : textDim }}
    >
      {isNeon ? `> ${labelText}` : labelText}
    </div>
  );

  // Earthly-branch hanja as the emblem glyph — renders as plain text so it
  // inherits the accent color (never an OS emoji).
  const emblem = (fontSize: number) => (
    <span style={{ fontSize, lineHeight: 1, color: accent, ...glyphGlow }}>{animal.branch}</span>
  );

  const signName = (size: string) => (
    <div
      className={`${size} font-bold tracking-tight`}
      style={{
        color: isNeon ? accentBright : text,
        textShadow: isNeon ? "var(--w-text-shadow)" : undefined,
      }}
    >
      {name}
    </div>
  );

  const yearLine = params.showYear && (
    <div className="text-[12px]" style={{ color: textDim }}>
      {isKo ? `${displayYear}년생` : `Year of ${displayYear}`}
    </div>
  );

  const elementBadge = params.showElement && (
    <span
      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
      style={{
        backgroundColor: isNeon ? "transparent" : tint,
        border: isNeon ? `1px solid ${accent}55` : "none",
        color: isNeon ? accent : accentBright,
      }}
    >
      {elementLabel}
    </span>
  );

  const traitPills = params.showTraits && (
    <div className="flex flex-wrap justify-center gap-1.5">
      {traits.map((t, i) => (
        <span
          key={i}
          className="text-[10px] font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: isNeon ? "transparent" : tint,
            border: isNeon ? `1px solid ${accent}55` : "none",
            color: isNeon ? accent : accentBright,
          }}
        >
          {isNeon ? `#${t}` : t}
        </span>
      ))}
    </div>
  );

  /* ── Animal variant: minimal identity ── */
  if (params.variant === "animal") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center gap-3 px-6 py-2">
          {emblem(80)}
          <div className="flex flex-col items-center gap-2">
            {signName("text-2xl")}
            <div className="flex items-center gap-1.5 text-[12px]" style={{ color: textDim }}>
              {params.showYear && <span>{isKo ? `${displayYear}년생` : displayYear}</span>}
              {params.showYear && params.showElement && (
                <span style={{ color: accent, opacity: 0.6 }}>·</span>
              )}
              {params.showElement && <span>{elementLabel}</span>}
            </div>
          </div>
        </div>
      </WidgetShell>
    );
  }

  /* ── Wheel variant: cycle focus ── */
  if (params.variant === "wheel") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center gap-3 px-6 py-2">
          {sectionLabel}
          <BranchWheel
            activeIndex={activeIndex}
            accent={accent}
            dim={text}
            onColor={onAccent}
            glow={isNeon}
            size={172}
          />
          <div className="flex flex-col items-center gap-1">
            {signName("text-xl")}
            {yearLine}
          </div>
        </div>
      </WidgetShell>
    );
  }

  /* ── Card variant: full detail ── */
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-2.5 px-5 py-1 w-full max-w-[340px]">
        {sectionLabel}

        <div className="flex flex-col items-center gap-1.5">
          {emblem(54)}
          {signName("text-2xl")}
          {yearLine}
          {elementBadge}
        </div>

        <BranchWheel
          activeIndex={activeIndex}
          accent={accent}
          dim={text}
          onColor={onAccent}
          glow={isNeon}
          size={128}
        />

        <div
          className="flex items-stretch justify-center w-full pt-3"
          style={{ borderTop: `1px solid ${divider}` }}
        >
          <StatCol
            label={isKo ? "지지" : "Branch"}
            value={animal.branch}
            textDim={textDim}
            text={isNeon ? accentBright : text}
          />
          <div style={{ width: 1, backgroundColor: divider }} />
          <StatCol
            label={isKo ? "음양" : "Polarity"}
            value={isKo ? (isYang ? "양 陽" : "음 陰") : isYang ? "Yang" : "Yin"}
            textDim={textDim}
            text={isNeon ? accentBright : text}
          />
          <div style={{ width: 1, backgroundColor: divider }} />
          <StatCol
            label={isKo ? "순서" : "Order"}
            value={`${activeIndex + 1} / 12`}
            textDim={textDim}
            text={isNeon ? accentBright : text}
          />
        </div>

        {traitPills}
      </div>
    </WidgetShell>
  );
}
