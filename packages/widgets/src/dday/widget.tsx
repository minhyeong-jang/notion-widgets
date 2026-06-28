"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { DdayParams } from "./schema";
import { computeEvents, MAX_EVENTS, type DdayEvent } from "./compute";

/* ─── i18n strings ─── */

interface Strings {
  tracker: string;
  empty: string;
  more: (n: number) => string;
}

const STRINGS: Record<string, Strings> = {
  en: { tracker: "D-Day", empty: "Add an event", more: (n) => `+${n} more` },
  ko: { tracker: "디데이", empty: "이벤트를 추가하세요", more: (n) => `외 ${n}개` },
  ja: { tracker: "カウントダウン", empty: "イベントを追加", more: (n) => `他${n}件` },
  zh: { tracker: "倒数日", empty: "添加事件", more: (n) => `还有${n}个` },
  de: { tracker: "Countdown", empty: "Ereignis hinzufügen", more: (n) => `+${n} weitere` },
  fr: { tracker: "Compte à rebours", empty: "Ajouter un événement", more: (n) => `+${n} de plus` },
  es: { tracker: "Cuenta atrás", empty: "Añadir evento", more: (n) => `+${n} más` },
};

function getStrings(locale: string): Strings {
  return STRINGS[locale.slice(0, 2)] ?? STRINGS.en;
}

function formatEventDate(date: string, locale: string): string {
  const d = new Date(date + "T00:00:00");
  try {
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

/* ─── color tokens per status ─── */

interface Palette {
  accent: string;
  accentBright: string;
  text: string;
  textDim: string;
  textFaint: string;
  border: string;
  isGlass: boolean;
  isDark: boolean;
}

function labelColor(ev: DdayEvent, p: Palette): string {
  if (ev.status === "today") return p.accentBright;
  if (ev.status === "past") return p.textFaint;
  return p.accent;
}

/* ─── shared header ─── */

function Header({ title, color }: { title: string; color: string }) {
  if (!title) return null;
  return (
    <div
      className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 w-full text-center"
      style={{ color, opacity: 0.7 }}
    >
      {title}
    </div>
  );
}

/* ─── List variant ─── */

function ListVariant({
  events,
  hiddenCount,
  p,
  title,
  showDate,
  locale,
}: {
  events: DdayEvent[];
  hiddenCount: number;
  p: Palette;
  title: string;
  showDate: boolean;
  locale: string;
}) {
  const s = getStrings(locale);
  return (
    <div className="w-full max-w-[400px] mx-auto px-1">
      <Header title={title} color={p.textDim} />
      <div className="flex flex-col gap-2">
        {events.map((ev, i) => {
          const highlight = i === 0 && ev.status !== "past";
          const lc = labelColor(ev, p);
          const rowBg = highlight
            ? p.isGlass
              ? `${p.accent}1f`
              : `${p.accent}14`
            : p.isGlass
              ? `${p.text}0a`
              : `${p.text}07`;
          const rowBorder = highlight ? `${p.accent}3a` : p.border;
          return (
            <div
              key={`${ev.name}-${ev.date}-${i}`}
              className="flex items-center gap-3 py-2.5 pl-3 pr-3.5"
              style={{
                backgroundColor: rowBg,
                border: `1px solid ${rowBorder}`,
                borderRadius: "var(--w-radius)",
              }}
            >
              <span
                className="w-[3px] self-stretch rounded-full shrink-0"
                style={{
                  backgroundColor: lc,
                  opacity: ev.status === "past" ? 0.5 : 1,
                }}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="text-sm font-semibold truncate"
                  style={{ color: p.text, opacity: ev.status === "past" ? 0.6 : 1 }}
                >
                  {ev.name}
                </div>
                {showDate && (
                  <div className="text-[11px] mt-0.5 truncate" style={{ color: p.textDim }}>
                    {formatEventDate(ev.date, locale)}
                  </div>
                )}
              </div>
              <span
                className="text-xl font-bold tabular-nums shrink-0"
                style={{ color: lc, textShadow: highlight ? "var(--w-text-shadow)" : undefined }}
              >
                {ev.label}
              </span>
            </div>
          );
        })}
      </div>
      {hiddenCount > 0 && (
        <div className="text-[11px] text-center mt-2.5" style={{ color: p.textFaint }}>
          {s.more(hiddenCount)}
        </div>
      )}
    </div>
  );
}

/* ─── Cards variant ─── */

function CardsVariant({
  events,
  hiddenCount,
  p,
  title,
  showDate,
  locale,
}: {
  events: DdayEvent[];
  hiddenCount: number;
  p: Palette;
  title: string;
  showDate: boolean;
  locale: string;
}) {
  const s = getStrings(locale);
  return (
    <div className="w-full max-w-[400px] mx-auto px-1">
      <Header title={title} color={p.textDim} />
      <div className="grid grid-cols-2 gap-2.5">
        {events.map((ev, i) => {
          const highlight = i === 0 && ev.status !== "past";
          const lc = labelColor(ev, p);
          const cardBg = highlight
            ? p.isGlass
              ? `${p.accent}22`
              : `${p.accent}14`
            : p.isGlass
              ? `${p.text}0a`
              : `${p.text}07`;
          const cardBorder = highlight ? `${p.accent}45` : p.border;
          return (
            <div
              key={`${ev.name}-${ev.date}-${i}`}
              className="flex flex-col gap-1 p-3.5"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "var(--w-radius)",
              }}
            >
              <span
                className="text-2xl font-bold tabular-nums leading-none"
                style={{
                  color: lc,
                  textShadow: highlight ? "var(--w-text-shadow)" : undefined,
                }}
              >
                {ev.label}
              </span>
              <span
                className="text-[13px] font-semibold truncate mt-1.5"
                style={{ color: p.text, opacity: ev.status === "past" ? 0.6 : 1 }}
              >
                {ev.name}
              </span>
              {showDate && (
                <span className="text-[10px] truncate" style={{ color: p.textDim }}>
                  {formatEventDate(ev.date, locale)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {hiddenCount > 0 && (
        <div className="text-[11px] text-center mt-2.5" style={{ color: p.textFaint }}>
          {s.more(hiddenCount)}
        </div>
      )}
    </div>
  );
}

/* ─── Featured variant ─── */

function FeaturedVariant({
  events,
  hiddenCount,
  p,
  title,
  showDate,
  locale,
}: {
  events: DdayEvent[];
  hiddenCount: number;
  p: Palette;
  title: string;
  showDate: boolean;
  locale: string;
}) {
  const s = getStrings(locale);
  const [hero, ...rest] = events;
  const heroColor = labelColor(hero, p);
  return (
    <div className="w-full max-w-[380px] mx-auto px-2 flex flex-col items-center">
      <div
        className="text-[11px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: p.textDim, opacity: 0.8 }}
      >
        {title || hero.name}
      </div>
      <div
        className="text-[15px] font-semibold mt-1.5 text-center truncate max-w-full"
        style={{ color: p.text }}
      >
        {hero.name}
      </div>
      <div
        className="text-6xl font-bold tabular-nums tracking-tight mt-1"
        style={{ color: heroColor, textShadow: "var(--w-text-shadow)" }}
      >
        {hero.label}
      </div>
      {showDate && (
        <div className="text-xs mt-1" style={{ color: p.textDim }}>
          {formatEventDate(hero.date, locale)}
        </div>
      )}

      {rest.length > 0 && (
        <div
          className="w-full mt-5 pt-4 flex flex-col gap-2.5"
          style={{ borderTop: `1px solid ${p.border}` }}
        >
          {rest.map((ev, i) => {
            const lc = labelColor(ev, p);
            return (
              <div
                key={`${ev.name}-${ev.date}-${i}`}
                className="flex items-center justify-between gap-3"
              >
                <span
                  className="text-[13px] font-medium truncate"
                  style={{ color: p.text, opacity: ev.status === "past" ? 0.55 : 0.9 }}
                >
                  {ev.name}
                </span>
                <span
                  className="text-sm font-bold tabular-nums shrink-0"
                  style={{ color: lc }}
                >
                  {ev.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {hiddenCount > 0 && (
        <div className="text-[11px] mt-2.5" style={{ color: p.textFaint }}>
          {s.more(hiddenCount)}
        </div>
      )}
    </div>
  );
}

/* ─── Neon variant (terminal style) ─── */

function NeonVariant({
  events,
  hiddenCount,
  accentColor,
  title,
  locale,
}: {
  events: DdayEvent[];
  hiddenCount: number;
  accentColor: string;
  title: string;
  locale: string;
}) {
  const s = getStrings(locale);
  const WIDTH = 26;
  const glow: CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: accentColor,
    textShadow: `0 0 8px ${accentColor}, 0 0 18px ${accentColor}55`,
  };
  const topLine = `┌${"─".repeat(WIDTH)}┐`;
  const bottomLine = `└${"─".repeat(WIDTH)}┘`;
  const heading = (title || s.tracker).toUpperCase();
  const hasToday = events.some((e) => e.status === "today");

  return (
    <div
      style={{ ...glow, letterSpacing: "0.08em" }}
      className="flex flex-col items-center gap-[2px] px-6 py-4"
    >
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre" }}>{topLine}</div>
      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          opacity: 0.6,
          margin: "6px 0 10px",
        }}
      >
        {heading}
      </div>
      <div className="flex flex-col gap-1.5 w-full" style={{ maxWidth: "21rem" }}>
        {events.map((ev, i) => {
          const name = ev.name.length > 14 ? ev.name.slice(0, 13) + "…" : ev.name;
          const isPast = ev.status === "past";
          const isToday = ev.status === "today";
          return (
            <div
              key={`${ev.name}-${ev.date}-${i}`}
              className="flex items-center justify-between gap-4"
              style={{
                fontSize: "0.95rem",
                opacity: isPast ? 0.45 : 1,
                animation: isToday ? "dday-neon-blink 1s steps(1) infinite" : undefined,
              }}
            >
              <span style={{ whiteSpace: "pre" }}>{`> ${name}`}</span>
              <span style={{ fontWeight: 700, letterSpacing: "0.05em" }}>{ev.label}</span>
            </div>
          );
        })}
      </div>
      {hiddenCount > 0 && (
        <div style={{ fontSize: "0.65rem", opacity: 0.45, marginTop: "6px" }}>
          {`[ +${hiddenCount} ]`}
        </div>
      )}
      <div
        style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre", marginTop: "10px" }}
      >
        {bottomLine}
      </div>
      {hasToday && (
        <style>{`
          @keyframes dday-neon-blink {
            0%, 70% { opacity: 1; }
            71%, 100% { opacity: 0.35; }
          }
        `}</style>
      )}
    </div>
  );
}

/* ─── Empty state ─── */

function EmptyState({ p, locale }: { p: Palette; locale: string }) {
  const s = getStrings(locale);
  return (
    <div className="flex flex-col items-center gap-2 px-8 text-center">
      <span className="text-3xl" style={{ color: p.accent, opacity: 0.5 }}>
        ◷
      </span>
      <span className="text-sm" style={{ color: p.textDim }}>
        {s.empty}
      </span>
    </div>
  );
}

/* ─── Main ─── */

export function DdayWidget({ params }: { params: DdayParams }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const all = computeEvents(params.events, now ?? new Date(2026, 0, 1), params.sort);
  const events = all.slice(0, MAX_EVENTS);
  const hiddenCount = all.length - events.length;

  const accentColor = `#${colors.accent}`;
  const palette: Palette = {
    accent: accentColor,
    accentBright: `#${colors.accentBright}`,
    text: `#${colors.text}`,
    textDim: `#${colors.textDim}`,
    textFaint: `#${colors.textFaint}`,
    border: `#${colors.border}`,
    isGlass: params.style === "glass",
    isDark: mode === "dark",
  };

  let content;
  if (events.length === 0) {
    content = <EmptyState p={palette} locale={params.locale} />;
  } else if (params.style === "neon") {
    content = (
      <NeonVariant
        events={events}
        hiddenCount={hiddenCount}
        accentColor={accentColor}
        title={params.title}
        locale={params.locale}
      />
    );
  } else if (params.variant === "cards") {
    content = (
      <CardsVariant
        events={events}
        hiddenCount={hiddenCount}
        p={palette}
        title={params.title}
        showDate={params.showDate}
        locale={params.locale}
      />
    );
  } else if (params.variant === "featured") {
    content = (
      <FeaturedVariant
        events={events}
        hiddenCount={hiddenCount}
        p={palette}
        title={params.title}
        showDate={params.showDate}
        locale={params.locale}
      />
    );
  } else {
    content = (
      <ListVariant
        events={events}
        hiddenCount={hiddenCount}
        p={palette}
        title={params.title}
        showDate={params.showDate}
        locale={params.locale}
      />
    );
  }

  return <WidgetShell params={params}>{content}</WidgetShell>;
}
