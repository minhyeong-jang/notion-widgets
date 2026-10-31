"use client";

import type { ReactNode } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { BirthMonthParams } from "./schema";
import { getBirthMonth } from "./birth-data";

interface ArtColors {
  accent: string;
  bright: string;
  glow: boolean; // render a soft halo (dark / neon)
}

/* ─── Faceted gemstone ─── */
function GemSVG({ size, c }: { size: number; c: ArtColors }) {
  const outline = "34,20 66,20 86,42 50,90 14,42";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      {/* soft halo */}
      {c.glow && (
        <polygon points={outline} fill="none" stroke={c.bright} strokeWidth={5} opacity={0.18} strokeLinejoin="round" />
      )}
      {/* body + facets */}
      <polygon points={outline} fill={c.accent} opacity={0.12} />
      <polygon points="34,20 66,20 60,42 40,42" fill={c.accent} opacity={0.3} />
      <polygon points="40,42 60,42 50,90" fill={c.accent} opacity={0.18} />
      <g stroke={c.accent} strokeWidth={0.8} opacity={0.5} fill="none" strokeLinecap="round">
        <line x1="14" y1="42" x2="86" y2="42" />
        <line x1="34" y1="20" x2="40" y2="42" />
        <line x1="66" y1="20" x2="60" y2="42" />
        <line x1="40" y1="42" x2="50" y2="90" />
        <line x1="60" y1="42" x2="50" y2="90" />
        <line x1="27" y1="42" x2="50" y2="90" />
        <line x1="73" y1="42" x2="50" y2="90" />
      </g>
      {/* outline */}
      <polygon points={outline} fill="none" stroke={c.bright} strokeWidth={1.6} opacity={0.9} strokeLinejoin="round" />
      {/* sparkle */}
      <g stroke={c.bright} strokeWidth={1} opacity={0.85} strokeLinecap="round">
        <line x1="30" y1="29" x2="30" y2="37" />
        <line x1="26" y1="33" x2="34" y2="33" />
      </g>
    </svg>
  );
}

/* ─── Stylized flower ─── */
function FlowerSVG({ size, petals, c }: { size: number; petals: number; c: ArtColors }) {
  const cx = 50;
  const cy = 50;
  const rx = petals > 12 ? 5 : petals > 8 ? 7 : 9.5;
  const ry = petals > 12 ? 17 : petals > 8 ? 19 : 21;
  const dist = ry * 0.82;
  const petalCy = cy - dist;
  const centerR = petals > 12 ? 6.5 : 8;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <g>
        {Array.from({ length: petals }).map((_, i) => {
          const angle = (360 / petals) * i;
          return (
            <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
              {c.glow && (
                <ellipse cx={cx} cy={petalCy} rx={rx + 1} ry={ry + 1} fill={c.bright} opacity={0.1} />
              )}
              <ellipse
                cx={cx}
                cy={petalCy}
                rx={rx}
                ry={ry}
                fill={c.accent}
                opacity={0.2}
                stroke={c.accent}
                strokeWidth={0.8}
                strokeOpacity={0.55}
              />
            </g>
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={centerR + 2} fill={c.accent} opacity={0.18} />
      <circle cx={cx} cy={cy} r={centerR} fill={c.accent} opacity={0.5} stroke={c.bright} strokeWidth={1.2} strokeOpacity={0.9} />
    </svg>
  );
}

export function BirthMonthWidget({ params }: { params: BirthMonthParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";
  const isKo = params.locale.startsWith("ko");

  const data = getBirthMonth(params.month);

  const accentColor = `#${colors.accent}`;
  const brightColor = `#${isDark ? colors.accentBright : colors.accent}`;
  const textColor = `#${colors.text}`;
  const dimColor = `#${colors.textDim}`;
  const faintColor = `#${colors.textFaint}`;

  const artColors: ArtColors = {
    accent: accentColor,
    bright: brightColor,
    glow: isDark || isNeon,
  };

  const monthName = isKo ? data.monthNameKo : data.monthName;
  const stoneName = isKo ? data.stoneKo : data.stone;
  const stoneMeaning = isKo ? data.stoneMeaningKo : data.stoneMeaning;
  const flowerName = isKo ? data.flowerKo : data.flower;
  const flowerMeaning = isKo ? data.flowerMeaningKo : data.flowerMeaning;

  const labelCase = isNeon ? ("uppercase" as const) : ("none" as const);
  const letterSpacing = isNeon ? "0.1em" : "0.01em";

  const stoneCaption = isKo ? "탄생석" : "Birthstone";
  const flowerCaption = isKo ? "탄생화" : "Birth Flower";

  const titleShadow = isNeon
    ? `0 0 10px ${brightColor}, 0 0 22px ${accentColor}88`
    : isDark
      ? `0 0 14px ${accentColor}44`
      : "none";

  const Title = ({ children, size = 22 }: { children: ReactNode; size?: number }) => (
    <span
      style={{
        fontSize: size,
        fontWeight: 700,
        color: textColor,
        textTransform: labelCase,
        letterSpacing,
      }}
    >
      {children}
    </span>
  );

  // ─── Variant: gem ───
  if (params.variant === "gem") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          <GemSVG size={146} c={artColors} />
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            <span
              style={{
                fontSize: 12,
                color: accentColor,
                textShadow: titleShadow,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              {monthName} · {stoneCaption}
            </span>
            <Title>{stoneName}</Title>
            <span style={{ fontSize: 13, color: dimColor, textTransform: labelCase, letterSpacing }}>
              {stoneMeaning}
            </span>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ─── Variant: flower ───
  if (params.variant === "flower") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          <FlowerSVG size={146} petals={data.petals} c={artColors} />
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            <span
              style={{
                fontSize: 12,
                color: accentColor,
                textShadow: titleShadow,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              {monthName} · {flowerCaption}
            </span>
            <Title>{flowerName}</Title>
            <span style={{ fontSize: 13, color: dimColor, textTransform: labelCase, letterSpacing }}>
              {flowerMeaning}
            </span>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ─── Variant: card (both) ───
  const Pair = ({
    art,
    name,
    meaning,
  }: {
    art: ReactNode;
    name: string;
    meaning: string;
  }) => (
    <div className="flex flex-col items-center" style={{ gap: 6, flex: 1, minWidth: 0 }}>
      {art}
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: textColor,
          textAlign: "center",
          textTransform: labelCase,
          letterSpacing,
          wordBreak: "keep-all",
        }}
      >
        {name}
      </span>
      <span style={{ fontSize: 11, color: faintColor, textAlign: "center", wordBreak: "keep-all" }}>
        {meaning}
      </span>
    </div>
  );

  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center" style={{ gap: 14 }}>
        <div className="flex flex-col items-center" style={{ gap: 2 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: accentColor,
              textShadow: titleShadow,
              textTransform: labelCase,
              letterSpacing,
            }}
          >
            {monthName}
          </span>
          <span
            style={{
              fontSize: 11,
              color: faintColor,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            {stoneCaption} · {flowerCaption}
          </span>
        </div>
        <div className="flex items-start" style={{ gap: 20 }}>
          <Pair art={<GemSVG size={68} c={artColors} />} name={stoneName} meaning={stoneMeaning} />
          <div style={{ width: 1, alignSelf: "stretch", backgroundColor: `#${isDark ? colors.borderStrong : colors.border}` }} />
          <Pair art={<FlowerSVG size={68} petals={data.petals} c={artColors} />} name={flowerName} meaning={flowerMeaning} />
        </div>
      </div>
    </WidgetShell>
  );
}
