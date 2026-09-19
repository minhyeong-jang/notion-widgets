"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { PriorityMatrixParams } from "./schema";
import { computeQuadrants, type Quadrant, type QuadrantId } from "./compute";

/* ─── i18n strings ─── */

interface Strings {
  q: Record<QuadrantId, string>;
  urgent: string;
  notUrgent: string;
  important: string;
  notImportant: string;
  empty: string;
  more: (n: number) => string;
}

const STRINGS: Record<string, Strings> = {
  en: {
    q: { q1: "Do first", q2: "Schedule", q3: "Delegate", q4: "Eliminate" },
    urgent: "Urgent", notUrgent: "Not urgent", important: "Important", notImportant: "Not important",
    empty: "No tasks yet", more: (n) => `+${n}`,
  },
  ko: {
    q: { q1: "지금 하기", q2: "계획하기", q3: "위임하기", q4: "줄이기" },
    urgent: "긴급", notUrgent: "여유", important: "중요", notImportant: "덜 중요",
    empty: "할 일이 없어요", more: (n) => `+${n}`,
  },
  ja: {
    q: { q1: "今すぐ", q2: "計画", q3: "委任", q4: "削減" },
    urgent: "緊急", notUrgent: "非緊急", important: "重要", notImportant: "重要でない",
    empty: "タスクなし", more: (n) => `+${n}`,
  },
  zh: {
    q: { q1: "立即做", q2: "计划做", q3: "委托", q4: "减少" },
    urgent: "紧急", notUrgent: "不紧急", important: "重要", notImportant: "不重要",
    empty: "暂无任务", more: (n) => `+${n}`,
  },
  de: {
    q: { q1: "Sofort", q2: "Planen", q3: "Delegieren", q4: "Weglassen" },
    urgent: "Dringend", notUrgent: "Nicht dringend", important: "Wichtig", notImportant: "Unwichtig",
    empty: "Keine Aufgaben", more: (n) => `+${n}`,
  },
  fr: {
    q: { q1: "À faire", q2: "Planifier", q3: "Déléguer", q4: "Éliminer" },
    urgent: "Urgent", notUrgent: "Non urgent", important: "Important", notImportant: "Peu important",
    empty: "Aucune tâche", more: (n) => `+${n}`,
  },
  es: {
    q: { q1: "Hacer ya", q2: "Planificar", q3: "Delegar", q4: "Eliminar" },
    urgent: "Urgente", notUrgent: "No urgente", important: "Importante", notImportant: "Poco importante",
    empty: "Sin tareas", more: (n) => `+${n}`,
  },
};

function getStrings(locale: string): Strings {
  return STRINGS[locale.slice(0, 2)] ?? STRINGS.en;
}

/* ─── palette ─── */

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

interface QuadStyle {
  title: string;
  bg: string;
  border: string;
  accentLine: string;
}

function quadStyle(q: Quadrant, p: Palette): QuadStyle {
  if (q.important) {
    const strong = q.level === 3; // q1
    return {
      title: p.isDark ? p.accentBright : p.accent,
      bg: p.isGlass
        ? `${p.accent}${strong ? "28" : "18"}`
        : `${p.accent}${strong ? "18" : "0e"}`,
      border: `${p.accent}${strong ? "4a" : "30"}`,
      accentLine: p.accent,
    };
  }
  const mid = q.level === 1; // q3
  return {
    title: mid ? p.text : p.textDim,
    bg: p.isGlass ? `${p.text}12` : `${p.text}09`,
    border: p.border,
    accentLine: mid ? p.textDim : p.textFaint,
  };
}

/* ─── shared bits ─── */

function Header({ title, color }: { title: string; color: string }) {
  if (!title) return null;
  return (
    <div
      className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 w-full text-center"
      style={{ color, opacity: 0.75 }}
    >
      {title}
    </div>
  );
}

function CountBadge({ n, color, bg }: { n: number; color: string; bg: string }) {
  if (n <= 0) return null;
  return (
    <span
      className="text-[10px] font-bold tabular-nums px-1.5 py-[1px] rounded-full shrink-0"
      style={{ color, backgroundColor: bg }}
    >
      {n}
    </span>
  );
}

function TaskLine({
  text,
  dot,
  color,
  size = "text-[12px]",
}: {
  text: string;
  dot: string;
  color: string;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: dot }} />
      <span className={`${size} truncate`} style={{ color }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Quadrant variant (2×2 matrix) ─── */

function QuadrantCell({
  q,
  p,
  s,
  taskLimit,
}: {
  q: Quadrant;
  p: Palette;
  s: Strings;
  taskLimit: number;
}) {
  const qs = quadStyle(q, p);
  const shown = q.tasks.slice(0, taskLimit);
  const hidden = q.tasks.length - shown.length + q.hiddenCount;
  const total = q.tasks.length + q.hiddenCount;
  return (
    <div
      className="flex flex-col gap-1.5 p-2.5 min-h-[94px]"
      style={{
        backgroundColor: qs.bg,
        border: `1px solid ${qs.border}`,
        borderRadius: "var(--w-radius)",
      }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span
          className="text-[12px] font-bold truncate"
          style={{ color: qs.title, textShadow: q.level === 3 ? "var(--w-text-shadow)" : undefined }}
        >
          {s.q[q.id]}
        </span>
        <CountBadge n={total} color={qs.title} bg={`${qs.accentLine}22`} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        {shown.length === 0 ? (
          <span className="text-[11px]" style={{ color: p.textFaint }}>
            —
          </span>
        ) : (
          <>
            {shown.map((t, i) => (
              <TaskLine key={i} text={t} dot={qs.accentLine} color={p.text} />
            ))}
            {hidden > 0 && (
              <span className="text-[10px] font-medium pl-2.5" style={{ color: p.textFaint }}>
                {s.more(hidden)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AxisLabel({ text, color, vertical }: { text: string; color: string; vertical?: boolean }) {
  const style: CSSProperties = vertical
    ? { writingMode: "vertical-rl", transform: "rotate(180deg)" }
    : {};
  return (
    <span
      className="text-[9px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap"
      style={{ color, opacity: 0.65, ...style }}
    >
      {text}
    </span>
  );
}

function QuadrantVariant({
  quadrants,
  p,
  s,
  title,
  showAxis,
}: {
  quadrants: Quadrant[];
  p: Palette;
  s: Strings;
  title: string;
  showAxis: boolean;
}) {
  const AXIS_W = showAxis ? 16 : 0;
  return (
    <div className="w-full max-w-[460px] mx-auto px-2">
      <Header title={title} color={p.textDim} />
      {showAxis && (
        <div className="flex mb-1.5">
          <div style={{ width: AXIS_W }} className="shrink-0" />
          <div className="flex-1 grid grid-cols-2 gap-2 pl-2">
            <div className="flex justify-center">
              <AxisLabel text={s.urgent} color={p.textDim} />
            </div>
            <div className="flex justify-center">
              <AxisLabel text={s.notUrgent} color={p.textDim} />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {showAxis && (
          <div className="flex flex-col shrink-0" style={{ width: AXIS_W }}>
            <div className="flex-1 flex items-center justify-center">
              <AxisLabel text={s.important} color={p.textDim} vertical />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <AxisLabel text={s.notImportant} color={p.textFaint} vertical />
            </div>
          </div>
        )}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
          {quadrants.map((q) => (
            <QuadrantCell key={q.id} q={q} p={p} s={s} taskLimit={3} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── List variant (stacked sections) ─── */

function ListVariant({
  quadrants,
  p,
  s,
  title,
}: {
  quadrants: Quadrant[];
  p: Palette;
  s: Strings;
  title: string;
}) {
  return (
    <div className="w-full max-w-[400px] mx-auto px-1">
      <Header title={title} color={p.textDim} />
      <div className="flex flex-col gap-2.5">
        {quadrants.map((q) => {
          const qs = quadStyle(q, p);
          const total = q.tasks.length + q.hiddenCount;
          return (
            <div
              key={q.id}
              className="flex gap-2.5 p-2.5"
              style={{
                backgroundColor: qs.bg,
                border: `1px solid ${qs.border}`,
                borderRadius: "var(--w-radius)",
              }}
            >
              <span
                className="w-[3px] self-stretch rounded-full shrink-0"
                style={{ backgroundColor: qs.accentLine }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-bold" style={{ color: qs.title }}>
                    {s.q[q.id]}
                  </span>
                  <CountBadge n={total} color={qs.title} bg={`${qs.accentLine}22`} />
                </div>
                {q.tasks.length === 0 ? (
                  <span className="text-[11px]" style={{ color: p.textFaint }}>
                    —
                  </span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {q.tasks.map((t, i) => (
                      <TaskLine key={i} text={t} dot={qs.accentLine} color={p.text} size="text-[13px]" />
                    ))}
                    {q.hiddenCount > 0 && (
                      <span className="text-[10px] font-medium pl-2.5" style={{ color: p.textFaint }}>
                        {s.more(q.hiddenCount)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Focus variant (Q1 hero + compact rest) ─── */

function FocusVariant({
  quadrants,
  p,
  s,
  title,
}: {
  quadrants: Quadrant[];
  p: Palette;
  s: Strings;
  title: string;
}) {
  const hero = quadrants[0];
  const rest = quadrants.slice(1);
  const heroStyle = quadStyle(hero, p);
  const heroTotal = hero.tasks.length + hero.hiddenCount;

  return (
    <div className="w-full max-w-[400px] mx-auto px-2">
      <Header title={title} color={p.textDim} />
      <div
        className="flex flex-col gap-2 p-3.5 mb-2.5"
        style={{
          backgroundColor: heroStyle.bg,
          border: `1px solid ${heroStyle.border}`,
          borderRadius: "var(--w-radius)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-bold uppercase tracking-wide"
            style={{ color: heroStyle.title, textShadow: "var(--w-text-shadow)" }}
          >
            {s.q.q1}
          </span>
          <CountBadge n={heroTotal} color={heroStyle.title} bg={`${p.accent}22`} />
        </div>
        {hero.tasks.length === 0 ? (
          <span className="text-[12px]" style={{ color: p.textFaint }}>
            —
          </span>
        ) : (
          <div className="flex flex-col gap-1.5">
            {hero.tasks.map((t, i) => (
              <TaskLine key={i} text={t} dot={p.accent} color={p.text} size="text-[14px]" />
            ))}
            {hero.hiddenCount > 0 && (
              <span className="text-[11px] font-medium pl-2.5" style={{ color: p.textFaint }}>
                {s.more(hero.hiddenCount)}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {rest.map((q) => {
          const qs = quadStyle(q, p);
          const total = q.tasks.length + q.hiddenCount;
          return (
            <div
              key={q.id}
              className="flex flex-col gap-1 p-2.5"
              style={{
                backgroundColor: qs.bg,
                border: `1px solid ${qs.border}`,
                borderRadius: "var(--w-radius)",
              }}
            >
              <span className="text-[11px] font-bold truncate" style={{ color: qs.title }}>
                {s.q[q.id]}
              </span>
              <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: qs.accentLine }}>
                {total}
              </span>
              {q.tasks[0] && (
                <span className="text-[10px] truncate" style={{ color: p.textDim }}>
                  {q.tasks[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Neon variant (terminal) ─── */

function NeonVariant({
  quadrants,
  accentColor,
  title,
  s,
}: {
  quadrants: Quadrant[];
  accentColor: string;
  title: string;
  s: Strings;
}) {
  const WIDTH = 30;
  const active = quadrants.filter((q) => q.tasks.length > 0);
  const glow: CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    color: accentColor,
    textShadow: `0 0 8px ${accentColor}, 0 0 18px ${accentColor}55`,
  };
  const topLine = `┌${"─".repeat(WIDTH)}┐`;
  const bottomLine = `└${"─".repeat(WIDTH)}┘`;
  const heading = (title || "Priorities").toUpperCase();

  return (
    <div style={{ ...glow, letterSpacing: "0.06em" }} className="flex flex-col items-center gap-[2px] px-6 py-4">
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre" }}>{topLine}</div>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.28em", opacity: 0.6, margin: "6px 0 10px" }}>
        {heading}
      </div>
      {active.length === 0 ? (
        <div style={{ fontSize: "0.85rem", opacity: 0.6, margin: "4px 0" }}>{`> ${s.empty}`}</div>
      ) : (
        <div className="flex flex-col gap-2 w-full" style={{ maxWidth: "23rem" }}>
          {active.map((q, qi) => (
            <div key={q.id} style={{ opacity: q.level === 0 ? 0.55 : 1 }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", opacity: 0.7 }}>
                {`[ ${qi + 1}. ${s.q[q.id].toUpperCase()} ]`}
              </div>
              {q.tasks.map((t, j) => {
                const name = t.length > 24 ? t.slice(0, 23) + "…" : t;
                return (
                  <div key={j} style={{ fontSize: "0.9rem", whiteSpace: "pre" }}>
                    {`  > ${name}`}
                  </div>
                );
              })}
              {q.hiddenCount > 0 && (
                <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{`  ${s.more(q.hiddenCount)}`}</div>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: "0.7rem", opacity: 0.4, whiteSpace: "pre", marginTop: "10px" }}>{bottomLine}</div>
    </div>
  );
}

/* ─── Empty state ─── */

function EmptyState({ p, s }: { p: Palette; s: Strings }) {
  return (
    <div className="flex flex-col items-center gap-2 px-8 text-center">
      <span className="text-3xl" style={{ color: p.accent, opacity: 0.5 }}>
        ▦
      </span>
      <span className="text-sm" style={{ color: p.textDim }}>
        {s.empty}
      </span>
    </div>
  );
}

/* ─── Main ─── */

export function PriorityMatrixWidget({ params }: { params: PriorityMatrixParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const s = getStrings(params.locale);

  const quadrants = computeQuadrants(params.tasks);
  const hasAny = quadrants.some((q) => q.tasks.length > 0);

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
  if (params.style === "neon") {
    content = <NeonVariant quadrants={quadrants} accentColor={accentColor} title={params.title} s={s} />;
  } else if (!hasAny) {
    content = <EmptyState p={palette} s={s} />;
  } else if (params.variant === "list") {
    content = <ListVariant quadrants={quadrants} p={palette} s={s} title={params.title} />;
  } else if (params.variant === "focus") {
    content = <FocusVariant quadrants={quadrants} p={palette} s={s} title={params.title} />;
  } else {
    content = (
      <QuadrantVariant
        quadrants={quadrants}
        p={palette}
        s={s}
        title={params.title}
        showAxis={params.showAxis}
      />
    );
  }

  return <WidgetShell params={params}>{content}</WidgetShell>;
}
