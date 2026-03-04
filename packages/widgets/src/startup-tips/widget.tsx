"use client";

import { WidgetShell } from "../widget-shell";
import type { StartupTipsParams } from "./schema";
import { getPrinciplesByCategory, type Principle } from "./principles";

function getDailyPrinciple(items: Principle[]): Principle {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return items[dayOfYear % items.length];
}

function getRandomPrinciple(items: Principle[]): Principle {
  return items[Math.floor(Math.random() * items.length)];
}

const fontSizeMap = {
  sm: { name: "text-base", explanation: "text-xs" },
  md: { name: "text-lg", explanation: "text-sm" },
  lg: { name: "text-xl", explanation: "text-base" },
} as const;

export function StartupTipsWidget({ params }: { params: StartupTipsParams }) {
  const accentColor = "#" + params.color;

  const items = getPrinciplesByCategory(params.category);
  const principle = params.mode === "random" ? getRandomPrinciple(items) : getDailyPrinciple(items);

  const lang = params.locale.slice(0, 2);
  const name = lang === "ko" ? principle.name.ko : principle.name.en;
  const explanation = lang === "ko" ? principle.explanation.ko : principle.explanation.en;
  const sizes = fontSizeMap[params.fontSize];

  return (
    <WidgetShell params={params}>
      <div className="text-center px-8 max-w-md mx-auto">
        <h2
          className={`${sizes.name} font-bold mb-3`}
          style={{
            color: accentColor,
            textShadow: "var(--w-text-shadow)",
          }}
        >
          {name}
        </h2>
        <p
          className={`${sizes.explanation} leading-relaxed mb-4`}
          style={{ color: accentColor, opacity: 0.85 }}
        >
          {explanation}
        </p>
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-6 h-px"
            style={{ backgroundColor: accentColor, opacity: 0.3 }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: accentColor, opacity: 0.45 }}
          >
            {principle.source}
          </span>
          <div
            className="w-6 h-px"
            style={{ backgroundColor: accentColor, opacity: 0.3 }}
          />
        </div>
      </div>
    </WidgetShell>
  );
}
