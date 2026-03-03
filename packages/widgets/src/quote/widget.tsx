"use client";

import type { QuoteParams } from "./schema";
import { quotesKo, quotesEn, type Quote } from "./quotes";

function getDailyQuote(quotes: Quote[]): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}

const fontSizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

export function QuoteWidget({ params }: { params: QuoteParams }) {
  const quotes = params.language === "ko" ? quotesKo : quotesEn;
  const quote = getDailyQuote(quotes);

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="text-center px-8 max-w-lg mx-auto">
        <div
          className="text-6xl font-serif leading-none mb-4 opacity-30"
          style={{ color: "#" + params.color }}
        >
          &ldquo;
        </div>
        <p
          className={`${fontSizeMap[params.fontSize]} font-medium leading-relaxed text-white/90`}
        >
          {quote.text}
        </p>
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: "#" + params.color }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "#" + params.color }}
            >
              {quote.author}
            </span>
            <div
              className="w-8 h-px"
              style={{ backgroundColor: "#" + params.color }}
            />
          </div>
          {quote.title && (
            <span className="text-xs text-white/40">
              {quote.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
