"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/i18n/config";

interface WidgetCardProps {
  widgetId: string;
  name: string;
  description: string;
  locale: Locale;
  recommendedSize?: { width: number; height: number };
  category?: string;
}

export function WidgetCard({
  widgetId,
  name,
  description,
  locale,
}: WidgetCardProps) {
  const [accent, setAccent] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    const savedAccent = localStorage.getItem("nw-accent-v1") || "green";
    setAccent(savedAccent);

    const systemMode = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const savedMode = localStorage.getItem("nw-mode-v1") || systemMode;
    setMode(savedMode);

    const accentHandler = (e: Event) => {
      const a = (e as CustomEvent).detail;
      if (a) setAccent(a);
    };
    const modeHandler = (e: Event) => {
      const m = (e as CustomEvent).detail;
      if (m) setMode(m);
    };
    window.addEventListener("nw-accent-change", accentHandler);
    window.addEventListener("nw-mode-change", modeHandler);
    return () => {
      window.removeEventListener("nw-accent-change", accentHandler);
      window.removeEventListener("nw-mode-change", modeHandler);
    };
  }, []);

  return (
    <a
      href={`/${locale}/widget/${widgetId}/`}
      className="group block bg-surface border border-border p-4 transition-all duration-200 hover:border-border-strong hover:bg-surface-2"
      style={{
        borderRadius: 14,
        transform: "translateY(0)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Canvas / iframe preview */}
      <div
        className="flex items-center justify-center overflow-hidden bg-inset border border-border-soft mb-4"
        style={{ height: 116, borderRadius: 9 }}
      >
        {accent && mode && (
          <iframe
            src={`/embed/${widgetId}?accent=${accent}&mode=${mode}`}
            className="pointer-events-none w-full h-full"
            style={{ border: "none" }}
            loading="lazy"
            tabIndex={-1}
            title={`${name} preview`}
          />
        )}
      </div>

      {/* Name */}
      <h3 className="text-text font-bold" style={{ fontSize: 15.5 }}>
        {name}
      </h3>

      {/* Description */}
      <p className="text-text-faint mt-1.5" style={{ fontSize: 13, minHeight: 38 }}>
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
        <span className="text-text-faint font-mono" style={{ fontSize: 11 }}>
          {widgetId}
        </span>
        <span className="text-accent font-semibold" style={{ fontSize: 12.5 }}>
          {locale === "ko" ? "커스터마이즈" : "Customize"}{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
