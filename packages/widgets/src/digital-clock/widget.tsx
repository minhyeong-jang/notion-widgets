"use client";

import { useEffect, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { DigitalClockParams } from "./schema";

type Greeting = { morning: string; afternoon: string; evening: string; night: string };

const GREETINGS: Record<string, Greeting> = {
  en: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening", night: "Good night" },
  ko: { morning: "좋은 아침이에요", afternoon: "좋은 오후예요", evening: "좋은 저녁이에요", night: "편안한 밤 되세요" },
  ja: { morning: "おはようございます", afternoon: "こんにちは", evening: "こんばんは", night: "おやすみなさい" },
  zh: { morning: "早上好", afternoon: "下午好", evening: "晚上好", night: "晚安" },
  de: { morning: "Guten Morgen", afternoon: "Guten Tag", evening: "Guten Abend", night: "Gute Nacht" },
  fr: { morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir", night: "Bonne nuit" },
  es: { morning: "Buenos días", afternoon: "Buenas tardes", evening: "Buenas noches", night: "Buenas noches" },
};

function greetingFor(hour: number, locale: string): string {
  const g = GREETINGS[locale.slice(0, 2)] ?? GREETINGS.en;
  if (hour >= 5 && hour < 12) return g.morning;
  if (hour >= 12 && hour < 18) return g.afternoon;
  if (hour >= 18 && hour < 22) return g.evening;
  return g.night;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function DigitalClockWidget({ params }: { params: DigitalClockParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;

  const isNeon = params.style === "neon";

  // Gate on mount so SSR (build-time) and first client render match, avoiding
  // any hydration mismatch on the constantly-changing time text.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let hours = now ? now.getHours() : 0;
  const minutes = now ? now.getMinutes() : 0;
  const seconds = now ? now.getSeconds() : 0;

  let period = "";
  if (params.hour12) {
    period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const hh = params.hour12 ? String(hours) : pad(hours);
  const mm = pad(minutes);
  const ss = pad(seconds);

  let dateStr = "";
  if (params.showDate && now) {
    try {
      dateStr = now.toLocaleDateString(params.locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch {
      dateStr = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    }
  }

  const placeholder = now === null;
  const greeting = params.variant === "greeting" && now ? greetingFor(now.getHours(), params.locale) : "";

  const timeColor = isNeon ? accentBright : text;
  const colonColor = isNeon ? accentBright : accent;
  const monoFont = "var(--font-geist-mono, ui-monospace, 'SF Mono', 'Courier New', monospace)";

  const colonStyle: React.CSSProperties = {
    color: colonColor,
    // Gentle pulse that never fully hides the colon, so it reads at any frame.
    animation: "nw-clock-colon 1.4s ease-in-out infinite",
    textShadow: isNeon ? `0 0 12px ${accentBright}` : undefined,
  };

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes nw-clock-colon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
      <div
        className="flex flex-col items-center"
        style={{ padding: "10px 20px", gap: params.variant === "greeting" ? 8 : 6 }}
      >
        {params.variant === "greeting" && (
          <div
            className="font-medium text-center"
            style={{
              color: isNeon ? accent : textDim,
              fontSize: 15,
              letterSpacing: isNeon ? "1.5px" : "0.01em",
              fontFamily: isNeon ? monoFont : undefined,
              textShadow: "var(--w-text-shadow)",
              minHeight: 20,
              opacity: placeholder ? 0 : 1,
            }}
          >
            {isNeon ? `> ${greeting}` : greeting}
          </div>
        )}

        <div
          className="flex items-end justify-center"
          style={{
            gap: 2,
            fontFamily: isNeon ? monoFont : "inherit",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          <span
            className="font-bold tabular-nums"
            style={{
              color: timeColor,
              fontSize: 62,
              textShadow: isNeon ? `0 0 18px ${accentBright}88` : "var(--w-text-shadow)",
            }}
          >
            {hh}
          </span>
          <span className="font-bold tabular-nums" style={{ ...colonStyle, fontSize: 58, paddingBottom: 3 }}>
            :
          </span>
          <span
            className="font-bold tabular-nums"
            style={{
              color: timeColor,
              fontSize: 62,
              textShadow: isNeon ? `0 0 18px ${accentBright}88` : "var(--w-text-shadow)",
            }}
          >
            {mm}
          </span>

          {params.showSeconds && (
            <span
              className="font-semibold tabular-nums"
              style={{
                color: isNeon ? accentBright : accent,
                fontSize: 24,
                paddingBottom: 6,
                paddingLeft: 4,
                opacity: 0.9,
                textShadow: isNeon ? `0 0 10px ${accentBright}66` : undefined,
              }}
            >
              {ss}
            </span>
          )}

          {params.hour12 && (
            <span
              className="font-semibold"
              style={{
                color: isNeon ? accent : accent,
                fontSize: 15,
                paddingBottom: 9,
                paddingLeft: 6,
                letterSpacing: "0.08em",
                fontFamily: isNeon ? monoFont : undefined,
              }}
            >
              {period}
            </span>
          )}
        </div>

        {params.showDate && (
          <div
            className="font-medium text-center"
            style={{
              color: isNeon ? accent : textDim,
              fontSize: 14,
              letterSpacing: isNeon ? "1.5px" : "0.02em",
              textTransform: isNeon ? "uppercase" : undefined,
              fontFamily: isNeon ? monoFont : undefined,
              textShadow: "var(--w-text-shadow)",
              minHeight: 20,
              opacity: placeholder ? 0 : 1,
            }}
          >
            {dateStr}
          </div>
        )}

        {/* Accent underline detail (hidden in neon which relies on glow) */}
        {!isNeon && (
          <div
            style={{
              width: 46,
              height: 3,
              borderRadius: 2,
              backgroundColor: accent,
              opacity: 0.85,
              marginTop: 2,
            }}
          />
        )}
        {isNeon && <div style={{ height: 1 }} />}

        {/* Placeholder colon-dots hint while mounting (kept invisible-ish) */}
        {placeholder && <span style={{ position: "absolute", opacity: 0 }} aria-hidden>--:--</span>}
      </div>
    </WidgetShell>
  );
}
