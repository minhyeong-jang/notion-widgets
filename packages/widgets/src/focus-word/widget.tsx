"use client";

import { WidgetShell } from "../widget-shell";
import type { FocusWordParams } from "./schema";
import { focusWords } from "./words";

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDailyWord(): { en: string; ko: string } {
  const dayOfYear = getDayOfYear();
  return focusWords[dayOfYear % focusWords.length];
}

export function FocusWordWidget({ params }: { params: FocusWordParams }) {
  const accentColor = "#" + params.color;

  const hasCustomWord = params.word.trim().length > 0;
  const displayWord = hasCustomWord ? params.word.trim() : getDailyWord().en;

  return (
    <WidgetShell params={params}>
      <div className="text-center px-8 w-full">
        {params.style === "minimal" && (
          <h1
            className="text-5xl sm:text-6xl font-light tracking-widest uppercase"
            style={{
              color: accentColor,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {displayWord}
          </h1>
        )}

        {params.style === "gradient" && (
          <h1
            className="text-5xl sm:text-6xl font-semibold tracking-wide"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {displayWord}
          </h1>
        )}

        {params.style === "bold" && (
          <h1
            className="text-6xl sm:text-7xl font-black tracking-tight uppercase"
            style={{
              color: accentColor,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {displayWord}
          </h1>
        )}

        {!hasCustomWord && (
          <div
            className="mt-3 w-8 h-px mx-auto"
            style={{ backgroundColor: accentColor, opacity: 0.4 }}
          />
        )}
      </div>
    </WidgetShell>
  );
}
