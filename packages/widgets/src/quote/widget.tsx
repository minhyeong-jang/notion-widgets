"use client";

import { resolveColors } from "@nw/widget-core";
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
  const c = resolveColors(params);
  const bgStyle = c.bg === "transparent" ? undefined : { backgroundColor: c.bg };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="text-center px-8 max-w-lg mx-auto">
        <div
          className="text-6xl font-serif leading-none mb-4 opacity-30"
          style={{ color: c.accent }}
        >
          &ldquo;
        </div>
        <p
          className={`${fontSizeMap[params.fontSize]} font-medium leading-relaxed`}
          style={{ color: c.text, opacity: 0.9 }}
        >
          {quote.text}
        </p>
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: c.accent }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: c.accent }}
            >
              {quote.author}
            </span>
            <div
              className="w-8 h-px"
              style={{ backgroundColor: c.accent }}
            />
          </div>
          {quote.title && (
            <span className="text-xs" style={{ color: c.text, opacity: 0.4 }}>
              {quote.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
