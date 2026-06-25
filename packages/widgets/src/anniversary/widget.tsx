"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { resolveColors, formatDate } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { AnniversaryParams } from "./schema";
import { computeAnniversary, type AnniversaryInfo } from "./compute";

interface Strings {
  since: string;
  days: string;
  weeks: string;
  months: string;
  years: string;
  /** "{n} days left" → next 100-day mark */
  toMark: (n: number, target: number) => string;
  /** "{n} days to {y}th anniversary" */
  toAnniv: (n: number, y: number) => string;
  /** future: "{n} days to go" */
  toGo: (n: number) => string;
  today: string;
}

const STRINGS: Record<string, Strings> = {
  en: {
    since: "since",
    days: "Days",
    weeks: "Weeks",
    months: "Months",
    years: "Years",
    toMark: (n, t) => `${n} ${n === 1 ? "day" : "days"} to D+${t}`,
    toAnniv: (n, y) => `${n} ${n === 1 ? "day" : "days"} to ${y} ${y === 1 ? "year" : "years"} 🎉`,
    toGo: (n) => `${n} ${n === 1 ? "day" : "days"} to go`,
    today: "Today!",
  },
  ko: {
    since: "부터",
    days: "일",
    weeks: "주",
    months: "개월",
    years: "년",
    toMark: (n, t) => `D+${t}까지 ${n}일`,
    toAnniv: (n, y) => `${y}주년까지 ${n}일 🎉`,
    toGo: (n) => `${n}일 남음`,
    today: "오늘이에요!",
  },
  ja: {
    since: "から",
    days: "日",
    weeks: "週",
    months: "ヶ月",
    years: "年",
    toMark: (n, t) => `D+${t}まであと${n}日`,
    toAnniv: (n, y) => `${y}周年まであと${n}日 🎉`,
    toGo: (n) => `あと${n}日`,
    today: "今日です！",
  },
  zh: {
    since: "起",
    days: "天",
    weeks: "周",
    months: "个月",
    years: "年",
    toMark: (n, t) => `距 D+${t} 还有 ${n} 天`,
    toAnniv: (n, y) => `距 ${y} 周年还有 ${n} 天 🎉`,
    toGo: (n) => `还有 ${n} 天`,
    today: "就是今天！",
  },
  de: {
    since: "seit",
    days: "Tage",
    weeks: "Wochen",
    months: "Monate",
    years: "Jahre",
    toMark: (n, t) => `${n} Tage bis D+${t}`,
    toAnniv: (n, y) => `${n} Tage bis ${y} Jahre 🎉`,
    toGo: (n) => `noch ${n} Tage`,
    today: "Heute!",
  },
  fr: {
    since: "depuis",
    days: "Jours",
    weeks: "Semaines",
    months: "Mois",
    years: "Ans",
    toMark: (n, t) => `${n} jours avant D+${t}`,
    toAnniv: (n, y) => `${n} jours avant ${y} ans 🎉`,
    toGo: (n) => `${n} jours restants`,
    today: "Aujourd'hui !",
  },
  es: {
    since: "desde",
    days: "Días",
    weeks: "Semanas",
    months: "Meses",
    years: "Años",
    toMark: (n, t) => `${n} días para D+${t}`,
    toAnniv: (n, y) => `${n} días para ${y} años 🎉`,
    toGo: (n) => `faltan ${n} días`,
    today: "¡Hoy!",
  },
};

function milestoneText(t: Strings, info: AnniversaryInfo): string | null {
  const m = info.nextMilestone;
  if (!m) return null;
  if (m.remaining === 0) return t.today;
  if (m.kind === "anniversary" && m.years) return t.toAnniv(m.remaining, m.years);
  return t.toMark(m.remaining, m.targetCount);
}

export function AnniversaryWidget({ params }: { params: AnniversaryParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  // Compute against the client's "today" after mount to stay hydration-safe.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const info = computeAnniversary(params.startDate, params.countFromOne, now ?? new Date(2024, 0, 1));

  const lang = params.locale.slice(0, 2);
  const t = STRINGS[lang] ?? STRINGS.en;

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;

  const isNeon = params.style === "neon";
  const mono = isNeon ? "monospace" : undefined;

  const prefix = info.isFuture ? "D-" : "D+";
  const bigNumber = `${prefix}${info.dayCount.toLocaleString()}`;
  const ms = milestoneText(t, info);

  const startStr = formatDate(info.startDate, lang === "ko" ? "iso" : "long", params.locale);
  const sinceLine =
    lang === "ko" || lang === "ja" || lang === "zh"
      ? `${startStr} ${t.since}`
      : `${t.since} ${startStr}`;

  const labelStyle: CSSProperties = {
    color: isNeon ? accentBright : textDim,
    textShadow: "var(--w-text-shadow)",
    fontFamily: mono,
    letterSpacing: isNeon ? "3px" : "0.12em",
    textTransform: "uppercase",
  };

  const numberStyle: CSSProperties = {
    color: isNeon ? accentBright : text,
    textShadow: isNeon ? `0 0 14px ${accentBright}, 0 0 30px ${accent}88` : "var(--w-text-shadow)",
    fontFamily: mono,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: isNeon ? "1px" : "-0.02em",
    fontVariantNumeric: "tabular-nums",
  };

  const renderLabel = () =>
    params.label ? (
      <div className="text-[12px] font-semibold" style={labelStyle}>
        {isNeon ? `> ${params.label}` : params.label}
      </div>
    ) : null;

  const renderMilestone = () =>
    params.showMilestone && ms ? (
      <div
        className="text-[12px] font-medium mt-0.5"
        style={{
          color: isNeon ? accent : accent,
          opacity: isNeon ? 0.85 : 0.92,
          fontFamily: mono,
        }}
      >
        {isNeon ? `// ${ms}` : ms}
      </div>
    ) : null;

  const renderDate = () =>
    params.showDate ? (
      <div
        className="text-[12px] mt-1"
        style={{ color: isNeon ? accent : textFaint, opacity: isNeon ? 0.6 : 1, fontFamily: mono }}
      >
        {isNeon ? sinceLine.replace(/ /g, "_") : sinceLine}
      </div>
    ) : null;

  // ─── Variant: ring ───
  if (params.variant === "ring") {
    const SIZE = 184;
    const STROKE = isNeon ? 9 : 13;
    const r = (SIZE - STROKE) / 2 - 2;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const circ = 2 * Math.PI * r;
    const pct = info.isFuture ? 0 : info.centuryProgress;
    const gradId = `anniv-grad-${params.accent}-${mode}`;
    const trackColor = isNeon ? `${accent}26` : track;
    const arcGlow = isNeon ? `drop-shadow(0 0 6px ${accentBright})` : undefined;

    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center" style={{ padding: "8px 16px", gap: 12 }}>
          {renderLabel()}
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={accent} />
                  <stop offset="100%" stopColor={accentBright} />
                </linearGradient>
              </defs>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={STROKE} />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct / 100)}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: arcGlow, transition: "stroke-dashoffset 0.7s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div style={{ ...numberStyle, fontSize: info.dayCount >= 10000 ? 34 : 42 }}>{bigNumber}</div>
              {!info.isFuture && params.showMilestone && (
                <div
                  className="text-[11px] font-medium mt-1.5 tabular-nums"
                  style={{ color: isNeon ? accent : textFaint, opacity: isNeon ? 0.7 : 1, fontFamily: mono }}
                >
                  {`→ D+${info.centuryTarget.toLocaleString()}`}
                </div>
              )}
            </div>
          </div>
          {renderDate()}
        </div>
      </WidgetShell>
    );
  }

  // ─── Variant: stat ───
  if (params.variant === "stat") {
    const stats: { value: number; label: string }[] = [
      { value: info.weeks, label: t.weeks },
      { value: info.months, label: t.months },
      { value: info.years, label: t.years },
    ];
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center" style={{ padding: "8px 20px", gap: 14 }}>
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            {renderLabel()}
            <div style={{ ...numberStyle, fontSize: info.dayCount >= 10000 ? 46 : 56 }}>{bigNumber}</div>
            {renderMilestone()}
          </div>
          {!info.isFuture && (
            <div className="flex items-stretch" style={{ gap: 0 }}>
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  {i > 0 && (
                    <div
                      style={{
                        width: 1,
                        height: 28,
                        background: isNeon ? `${accent}40` : `#${colors.border}`,
                        margin: "0 18px",
                      }}
                    />
                  )}
                  <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
                    <div
                      className="font-bold tabular-nums leading-none"
                      style={{ fontSize: 22, color: isNeon ? accentBright : text, fontFamily: mono, textShadow: isNeon ? `0 0 8px ${accent}99` : undefined }}
                    >
                      {s.value.toLocaleString()}
                    </div>
                    <div
                      className="text-[10px] mt-1.5 font-medium"
                      style={{ color: isNeon ? accent : textFaint, opacity: isNeon ? 0.7 : 1, fontFamily: mono, letterSpacing: "0.08em", textTransform: "uppercase" }}
                    >
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {renderDate()}
        </div>
      </WidgetShell>
    );
  }

  // ─── Variant: plus (default) ───
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center text-center" style={{ padding: "8px 24px", gap: 6 }}>
        {renderLabel()}
        <div style={{ ...numberStyle, fontSize: info.dayCount >= 10000 ? 64 : 76 }}>{bigNumber}</div>
        {renderMilestone()}
        {renderDate()}
      </div>
    </WidgetShell>
  );
}
