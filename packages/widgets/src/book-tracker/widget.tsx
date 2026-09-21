"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { BookTrackerParams } from "./schema";

/* ─── i18n strings ─── */

interface Strings {
  nowReading: string;
  pages: string;
  finished: string;
  toGo: (n: number) => string;
}

const STRINGS: Record<string, Strings> = {
  en: { nowReading: "Now Reading", pages: "pages", finished: "Finished!", toGo: (n) => `${n} pages to go` },
  ko: { nowReading: "읽는 중", pages: "쪽", finished: "완독!", toGo: (n) => `${n}쪽 남음` },
  ja: { nowReading: "読書中", pages: "ページ", finished: "読了！", toGo: (n) => `残り${n}ページ` },
  zh: { nowReading: "阅读中", pages: "页", finished: "已读完！", toGo: (n) => `还剩${n}页` },
  de: { nowReading: "Aktuell", pages: "Seiten", finished: "Fertig!", toGo: (n) => `noch ${n} Seiten` },
  fr: { nowReading: "En lecture", pages: "pages", finished: "Terminé !", toGo: (n) => `${n} pages restantes` },
  es: { nowReading: "Leyendo", pages: "páginas", finished: "¡Terminado!", toGo: (n) => `${n} páginas restantes` },
};

function getStrings(locale: string): Strings {
  return STRINGS[locale.slice(0, 2)] ?? STRINGS.en;
}

/* ─── palette ─── */

interface Palette {
  accent: string;
  accentBright: string;
  accentDeep: string;
  accentDim: string;
  onAccent: string;
  text: string;
  textDim: string;
  textFaint: string;
  track: string;
  border: string;
  surface: string;
  isGlass: boolean;
  isDark: boolean;
}

interface Reading {
  pct: number; // 0..1
  current: number; // clamped to total
  total: number;
  remaining: number;
  done: boolean;
}

function computeReading(current: number, total: number): Reading {
  const safeTotal = Math.max(1, Math.round(total));
  const clamped = Math.min(Math.max(0, Math.round(current)), safeTotal);
  const pct = clamped / safeTotal;
  return {
    pct,
    current: clamped,
    total: safeTotal,
    remaining: safeTotal - clamped,
    done: clamped >= safeTotal,
  };
}

/* ─── shared progress bar ─── */

function ProgressBar({ pct, p, height = 8 }: { pct: number; p: Palette; height?: number }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height,
        borderRadius: height,
        backgroundColor: p.track,
      }}
    >
      <div
        className="h-full"
        style={{
          width: `${Math.max(pct * 100, pct > 0 ? 3 : 0)}%`,
          borderRadius: height,
          background: `linear-gradient(90deg, ${p.accentDeep}, ${p.accent})`,
          boxShadow: p.isGlass ? `0 0 12px ${p.accent}66` : undefined,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

/* ─── book cover graphic ─── */

function BookCover({ p, r, title, size = 1 }: { p: Palette; r: Reading; title: string; size?: number }) {
  const w = 66 * size;
  const h = 92 * size;
  const spineW = 7 * size;
  // A closed book seen from the front, with a filling bookmark ribbon.
  return (
    <div
      className="relative shrink-0"
      style={{
        width: w,
        height: h,
        borderRadius: `3px ${8 * size}px ${8 * size}px 3px`,
        background: `linear-gradient(135deg, ${p.accent}, ${p.accentBright})`,
        boxShadow: p.isDark
          ? `0 6px 16px rgba(0,0,0,0.4)`
          : `0 6px 16px ${p.accent}44`,
        overflow: "hidden",
      }}
    >
      {/* spine */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{ width: spineW, background: p.accentDeep, opacity: 0.9 }}
      />
      {/* inner page edge highlight */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: spineW,
          width: 2 * size,
          background: "rgba(255,255,255,0.25)",
        }}
      />
      {/* title lettering on the cover */}
      <div
        className="absolute font-semibold leading-tight"
        style={{
          left: spineW + 8 * size,
          right: 7 * size,
          top: 12 * size,
          color: p.onAccent,
          fontSize: 8.5 * size,
          opacity: 0.92,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </div>
      {/* small author rule */}
      <div
        className="absolute"
        style={{
          left: spineW + 8 * size,
          bottom: 12 * size,
          width: 20 * size,
          height: 2,
          background: p.onAccent,
          opacity: 0.6,
          borderRadius: 2,
        }}
      />
      {/* bookmark ribbon: length grows with progress */}
      <div
        className="absolute"
        style={{
          right: 12 * size,
          top: 0,
          width: 6 * size,
          height: `${Math.max(18, r.pct * 100)}%`,
          background: p.onAccent,
          opacity: 0.85,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
        }}
      />
    </div>
  );
}

/* ─── Cover variant ─── */

function CoverVariant({
  p,
  r,
  s,
  title,
  author,
  showPages,
}: {
  p: Palette;
  r: Reading;
  s: Strings;
  title: string;
  author: string;
  showPages: boolean;
}) {
  const pctLabel = Math.round(r.pct * 100);
  return (
    <div className="flex items-center gap-5 px-6 w-full max-w-[400px] mx-auto">
      <BookCover p={p} r={r} title={title} />
      <div className="min-w-0 flex-1 flex flex-col">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
          style={{ color: p.accent }}
        >
          {r.done ? s.finished : s.nowReading}
        </span>
        <span
          className="text-lg font-bold leading-snug truncate"
          style={{ color: p.text }}
        >
          {title}
        </span>
        {author && (
          <span className="text-[13px] truncate mb-3" style={{ color: p.textDim }}>
            {author}
          </span>
        )}
        <ProgressBar pct={r.pct} p={p} />
        <div className="flex items-center justify-between mt-2">
          {showPages ? (
            <span className="text-[12px] tabular-nums" style={{ color: p.textDim }}>
              {r.current} / {r.total} {s.pages}
            </span>
          ) : (
            <span />
          )}
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: p.accent, textShadow: "var(--w-text-shadow)" }}
          >
            {pctLabel}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Bar variant ─── */

function BarVariant({
  p,
  r,
  s,
  title,
  author,
  showPages,
}: {
  p: Palette;
  r: Reading;
  s: Strings;
  title: string;
  author: string;
  showPages: boolean;
}) {
  const pctLabel = Math.round(r.pct * 100);
  return (
    <div className="flex flex-col items-center text-center px-8 w-full max-w-[400px] mx-auto">
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
        style={{ color: p.accent }}
      >
        {r.done ? s.finished : s.nowReading}
      </span>
      <span
        className="text-xl font-bold leading-snug"
        style={{ color: p.text }}
      >
        {title}
      </span>
      {author && (
        <span className="text-sm mb-4" style={{ color: p.textDim }}>
          {author}
        </span>
      )}
      <div className="flex items-baseline gap-1 mb-3">
        <span
          className="text-5xl font-bold tabular-nums leading-none"
          style={{ color: p.accent, textShadow: "var(--w-text-shadow)" }}
        >
          {pctLabel}
        </span>
        <span className="text-xl font-semibold" style={{ color: p.accent, opacity: 0.7 }}>
          %
        </span>
      </div>
      <ProgressBar pct={r.pct} p={p} height={10} />
      {showPages && (
        <span className="text-[12px] tabular-nums mt-2.5" style={{ color: p.textDim }}>
          {r.done ? `${r.total} ${s.pages}` : `${r.current} / ${r.total} ${s.pages}`}
        </span>
      )}
    </div>
  );
}

/* ─── Spine variant ─── */

function SpineVariant({
  p,
  r,
  s,
  title,
  author,
  showPages,
}: {
  p: Palette;
  r: Reading;
  s: Strings;
  title: string;
  author: string;
  showPages: boolean;
}) {
  const pctLabel = Math.round(r.pct * 100);
  const spineH = 132;
  const spineW = 40;
  const fillH = Math.max(r.pct * spineH, r.pct > 0 ? 6 : 0);
  return (
    <div className="flex items-center gap-6 px-6 w-full max-w-[380px] mx-auto">
      {/* vertical book spine filling from the bottom */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: spineW,
          height: spineH,
          borderRadius: 6,
          background: p.track,
          border: `1px solid ${p.border}`,
        }}
      >
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: fillH,
            background: `linear-gradient(180deg, ${p.accentBright}, ${p.accentDeep})`,
            boxShadow: p.isGlass ? `0 0 16px ${p.accent}77` : undefined,
            transition: "height 0.4s ease",
          }}
        />
        {/* decorative spine bands */}
        <div
          className="absolute left-1.5 right-1.5"
          style={{ top: 14, height: 2, background: p.text, opacity: 0.12, borderRadius: 2 }}
        />
        <div
          className="absolute left-1.5 right-1.5"
          style={{ bottom: 14, height: 2, background: p.text, opacity: 0.12, borderRadius: 2 }}
        />
      </div>

      <div className="min-w-0 flex-1 flex flex-col">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
          style={{ color: p.accent }}
        >
          {r.done ? s.finished : s.nowReading}
        </span>
        <span className="text-lg font-bold leading-snug" style={{ color: p.text }}>
          {title}
        </span>
        {author && (
          <span className="text-[13px] truncate" style={{ color: p.textDim }}>
            {author}
          </span>
        )}
        <div className="flex items-baseline gap-1 mt-3">
          <span
            className="text-4xl font-bold tabular-nums leading-none"
            style={{ color: p.accent, textShadow: "var(--w-text-shadow)" }}
          >
            {pctLabel}
          </span>
          <span className="text-base font-semibold" style={{ color: p.accent, opacity: 0.7 }}>
            %
          </span>
        </div>
        {showPages && (
          <span className="text-[12px] tabular-nums mt-1.5" style={{ color: p.textDim }}>
            {r.done ? `${r.total} ${s.pages}` : s.toGo(r.remaining)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Neon variant (terminal reading log) ─── */

function NeonVariant({
  accentColor,
  r,
  s,
  title,
  author,
  showPages,
}: {
  accentColor: string;
  r: Reading;
  s: Strings;
  title: string;
  author: string;
  showPages: boolean;
}) {
  const WIDTH = 22;
  const BAR = 18;
  const filled = Math.round(r.pct * BAR);
  const bar = "█".repeat(filled) + "░".repeat(BAR - filled);
  const pctLabel = Math.round(r.pct * 100);
  const glow: CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: accentColor,
    textShadow: `0 0 8px ${accentColor}, 0 0 18px ${accentColor}55`,
  };
  const clip = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
  return (
    <div
      style={{ ...glow, letterSpacing: "0.06em" }}
      className="flex flex-col items-start gap-[3px] px-7 py-4"
    >
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre" }}>
        {`┌${"─".repeat(WIDTH)}┐`}
      </div>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.28em", opacity: 0.6, margin: "6px 0 8px" }}>
        {(r.done ? s.finished : s.nowReading).toUpperCase()}
      </div>
      <div style={{ fontSize: "0.98rem", fontWeight: 700 }}>{`> ${clip(title, 20)}`}</div>
      {author && (
        <div style={{ fontSize: "0.72rem", opacity: 0.6, marginBottom: 6 }}>
          {`  ${clip(author, 22)}`}
        </div>
      )}
      <div style={{ fontSize: "0.92rem", letterSpacing: "0.02em", whiteSpace: "pre", marginTop: 4 }}>
        {`[${bar}]`}
      </div>
      <div className="flex items-center justify-between w-full" style={{ marginTop: 6 }}>
        {showPages ? (
          <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>
            {`${r.current}/${r.total} ${s.pages}`}
          </span>
        ) : (
          <span />
        )}
        <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{`${pctLabel}%`}</span>
      </div>
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre", marginTop: 8 }}>
        {`└${"─".repeat(WIDTH)}┘`}
      </div>
    </div>
  );
}

/* ─── Main ─── */

export function BookTrackerWidget({ params }: { params: BookTrackerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const s = getStrings(params.locale);
  const r = computeReading(params.current, params.total);

  const p: Palette = {
    accent: `#${colors.accent}`,
    accentBright: `#${colors.accentBright}`,
    accentDeep: `#${colors.accentDeep}`,
    accentDim: `#${colors.accentDim}`,
    onAccent: `#${colors.btnText}`,
    text: `#${colors.text}`,
    textDim: `#${colors.textDim}`,
    textFaint: `#${colors.textFaint}`,
    track: `#${colors.track}`,
    border: `#${colors.border}`,
    surface: `#${colors.surface}`,
    isGlass: params.style === "glass",
    isDark: mode === "dark",
  };

  let content;
  if (params.style === "neon") {
    content = (
      <NeonVariant
        accentColor={p.accent}
        r={r}
        s={s}
        title={params.title}
        author={params.author}
        showPages={params.showPages}
      />
    );
  } else if (params.variant === "bar") {
    content = (
      <BarVariant p={p} r={r} s={s} title={params.title} author={params.author} showPages={params.showPages} />
    );
  } else if (params.variant === "spine") {
    content = (
      <SpineVariant p={p} r={r} s={s} title={params.title} author={params.author} showPages={params.showPages} />
    );
  } else {
    content = (
      <CoverVariant p={p} r={r} s={s} title={params.title} author={params.author} showPages={params.showPages} />
    );
  }

  return <WidgetShell params={params}>{content}</WidgetShell>;
}
