"use client";

import { resolveColors } from "@nw/widget-core";
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
  const colors = resolveColors(params.accent);
  const accentColor = `#${colors.accent}`;

  const hasCustomWord = params.word.trim().length > 0;
  const displayWord = hasCustomWord ? params.word.trim() : getDailyWord().en;

  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <div
          className="text-center px-8 w-full"
          style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)" }}
        >
          <h1
            className="text-5xl sm:text-7xl font-bold uppercase"
            style={{
              color: accentColor,
              letterSpacing: "0.3em",
              textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}, 0 0 40px ${accentColor}80, 0 0 80px ${accentColor}40`,
            }}
          >
            {displayWord}
          </h1>
          {!hasCustomWord && (
            <div
              className="mt-4 text-xs uppercase tracking-widest"
              style={{ color: accentColor, opacity: 0.5 }}
            >
              <span style={{ opacity: 0.4 }}>&gt; </span>
              word of the day
            </div>
          )}
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell params={params}>
      <div className="text-center px-8 w-full">
        <h1
          className="text-5xl sm:text-6xl font-light tracking-widest uppercase"
          style={{
            color: accentColor,
            textShadow: "var(--w-text-shadow)",
          }}
        >
          {displayWord}
        </h1>

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
