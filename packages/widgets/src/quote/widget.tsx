"use client";

import { WidgetShell } from "../widget-shell";
import type { QuoteParams } from "./schema";
import { getQuotes, type Quote } from "./quotes";

function getDailyQuote(quotes: Quote[]): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}

function getRandomQuote(quotes: Quote[]): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

const fontSizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

export function QuoteWidget({ params }: { params: QuoteParams }) {
  const quotes = getQuotes(params.locale);
  const quote = params.mode === "random" ? getRandomQuote(quotes) : getDailyQuote(quotes);
  const accentColor = "#" + params.color;

  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <style>{`
          @keyframes neon-blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
        `}</style>
        <div className="text-left px-8 max-w-lg mx-auto" style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)" }}>
          <p
            className={`${fontSizeMap[params.fontSize]} leading-relaxed`}
            style={{ color: accentColor, opacity: 0.9 }}
          >
            <span style={{ opacity: 0.5 }}>&gt; </span>
            {quote.text}
            <span
              style={{
                animation: "neon-blink 1s step-end infinite",
                marginLeft: "2px",
              }}
            >
              _
            </span>
          </p>
          <div className="mt-4" style={{ color: accentColor, opacity: 0.6 }}>
            <span className="text-sm">
              -- {quote.author.replace(/ /g, "_")}
            </span>
            {quote.title && (
              <span className="text-xs ml-2" style={{ opacity: 0.4 }}>
                [{quote.title}]
              </span>
            )}
          </div>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell params={params}>
      <div className="text-center px-8 max-w-lg mx-auto">
        <div
          className="text-6xl font-serif leading-none mb-4 opacity-30"
          style={{ color: accentColor }}
        >
          &ldquo;
        </div>
        <p
          className={`${fontSizeMap[params.fontSize]} font-medium leading-relaxed`}
          style={{ color: "#fafafa", opacity: 0.9 }}
        >
          {quote.text}
        </p>
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: accentColor, textShadow: "var(--w-text-shadow)" }}
            >
              {quote.author}
            </span>
            <div
              className="w-8 h-px"
              style={{ backgroundColor: accentColor }}
            />
          </div>
          {quote.title && (
            <span className="text-xs" style={{ color: "#fafafa", opacity: 0.4 }}>
              {quote.title}
            </span>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
