"use client";

import { WidgetShell } from "../widget-shell";
import type { DailyTipParams } from "./schema";
import { getTipsByCategory, type Tip } from "./tips";

function getDailyTip(items: Tip[]): Tip {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return items[dayOfYear % items.length];
}

function getRandomTip(items: Tip[]): Tip {
  return items[Math.floor(Math.random() * items.length)];
}

const fontSizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

const categoryLabels: Record<string, { en: string; ko: string }> = {
  productivity: { en: "Productivity", ko: "\uC0DD\uC0B0\uC131" },
  mindset: { en: "Mindset", ko: "\uB9C8\uC778\uB4DC\uC14B" },
  tech: { en: "Tech", ko: "\uAE30\uC220" },
  life: { en: "Life", ko: "\uC0DD\uD65C" },
};

export function DailyTipWidget({ params }: { params: DailyTipParams }) {
  const accentColor = "#" + params.color;

  const items = getTipsByCategory(params.category);
  const tip = params.mode === "random" ? getRandomTip(items) : getDailyTip(items);

  const lang = params.locale.slice(0, 2);
  const text = lang === "ko" ? tip.text.ko : tip.text.en;
  const categoryLabel = lang === "ko"
    ? categoryLabels[tip.category].ko
    : categoryLabels[tip.category].en;

  return (
    <WidgetShell params={params}>
      <div className="text-center px-8 max-w-md mx-auto">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 uppercase tracking-wider"
          style={{
            backgroundColor: accentColor + "20",
            color: accentColor,
          }}
        >
          {categoryLabel}
        </div>

        <div className="flex items-start justify-center gap-3 mb-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-1 opacity-60"
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          <p
            className={`${fontSizeMap[params.fontSize]} leading-relaxed text-left`}
            style={{
              color: accentColor,
              opacity: 0.9,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </WidgetShell>
  );
}
