"use client";

import { WidgetShell } from "../widget-shell";
import type { DailyTarotParams } from "./schema";
import { getDailyCard } from "./tarot-cards";

function CardArt({
  number,
  accent,
  isMajor,
}: {
  number: string;
  accent: string;
  isMajor: boolean;
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size * 1.4} viewBox={`0 0 ${size} ${size * 1.4}`}>
      {/* Card border */}
      <rect
        x="4"
        y="4"
        width={size - 8}
        height={size * 1.4 - 8}
        rx="12"
        ry="12"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Inner border */}
      <rect
        x="12"
        y="12"
        width={size - 24}
        height={size * 1.4 - 24}
        rx="8"
        ry="8"
        fill={accent + "08"}
        stroke={accent}
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* Decorative elements */}
      {isMajor ? (
        <>
          {/* Star pattern for major arcana */}
          <circle cx={cx} cy={cy * 1.1} r="45" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" />
          <circle cx={cx} cy={cy * 1.1} r="30" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.2" />
          <circle cx={cx} cy={cy * 1.1} r="15" fill={accent} opacity="0.15" />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = cx + Math.cos(rad) * 20;
            const y1 = cy * 1.1 + Math.sin(rad) * 20;
            const x2 = cx + Math.cos(rad) * 55;
            const y2 = cy * 1.1 + Math.sin(rad) * 55;
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={accent}
                strokeWidth="0.5"
                opacity="0.2"
              />
            );
          })}
        </>
      ) : (
        <>
          {/* Diamond pattern for minor arcana */}
          <rect
            x={cx - 30}
            y={cy * 1.1 - 30}
            width="60"
            height="60"
            rx="4"
            fill="none"
            stroke={accent}
            strokeWidth="1"
            opacity="0.3"
            transform={`rotate(45, ${cx}, ${cy * 1.1})`}
          />
          <rect
            x={cx - 18}
            y={cy * 1.1 - 18}
            width="36"
            height="36"
            rx="2"
            fill={accent}
            opacity="0.1"
            transform={`rotate(45, ${cx}, ${cy * 1.1})`}
          />
        </>
      )}

      {/* Card number - top */}
      <text
        x="24"
        y="36"
        fill={accent}
        fontSize="16"
        fontWeight="bold"
        fontFamily="serif"
        opacity="0.7"
      >
        {number}
      </text>

      {/* Card number - bottom (inverted) */}
      <text
        x={size - 24}
        y={size * 1.4 - 20}
        fill={accent}
        fontSize="16"
        fontWeight="bold"
        fontFamily="serif"
        opacity="0.7"
        textAnchor="end"
        transform={`rotate(180, ${size - 24}, ${size * 1.4 - 28})`}
      >
        {number}
      </text>

      {/* Corner decorations */}
      <circle cx="24" cy={size * 1.4 - 24} r="3" fill={accent} opacity="0.2" />
      <circle cx={size - 24} cy="24" r="3" fill={accent} opacity="0.2" />
    </svg>
  );
}

export function DailyTarotWidget({ params }: { params: DailyTarotParams }) {
  const accentColor = "#" + params.color;

  const card = getDailyCard(params.deck);
  const isKo = params.locale.startsWith("ko");
  const name = isKo ? card.nameKo : card.name;
  const meaning = isKo ? card.meaningKo : card.meaning;
  const keywords = isKo ? card.keywordsKo : card.keywords;
  const todayLabel = isKo ? "\uC624\uB298\uC758 \uCE74\uB4DC" : "Today's Card";

  if (params.style === "detailed") {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center gap-4 px-6 py-4 max-w-xs">
          <div className="text-xs font-medium opacity-50" style={{ color: accentColor }}>
            {todayLabel}
          </div>
          <CardArt number={card.number} accent={accentColor} isMajor={card.isMajor} />
          <div className="text-center">
            <div
              className="text-lg font-bold"
              style={{
                color: accentColor,
                textShadow: "var(--w-text-shadow)",
              }}
            >
              {name}
            </div>
            <div className="text-sm mt-2 leading-relaxed opacity-70" style={{ color: accentColor }}>
              {meaning}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {keywords.split(", ").map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: accentColor + "1a",
                    color: accentColor,
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // Minimal style
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-3 px-6">
        <div className="text-xs font-medium opacity-50" style={{ color: accentColor }}>
          {todayLabel}
        </div>
        <div
          className="text-3xl font-bold font-serif"
          style={{
            color: accentColor,
            textShadow: "var(--w-text-shadow)",
          }}
        >
          {card.number}
        </div>
        <div className="text-lg font-medium" style={{ color: accentColor }}>
          {name}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
          {keywords.split(", ").map((kw, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: accentColor + "1a",
                color: accentColor,
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
}
