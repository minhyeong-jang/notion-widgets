"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { LifeWeeksParams } from "./schema";

const WEEK_MS = 1000 * 60 * 60 * 24 * 7;
const WEEKS_PER_YEAR = 52;

type DictEntry = {
  weeks: string;
  years: string;
  lived: string;
  left: string;
  title: string;
  thisYear: string;
};

const DICT: Record<string, DictEntry> = {
  en: {
    weeks: "weeks",
    years: "years",
    lived: "lived",
    left: "left",
    title: "Life in Weeks",
    thisYear: "weeks into this year",
  },
  ko: {
    weeks: "주",
    years: "년",
    lived: "지남",
    left: "남음",
    title: "인생 달력",
    thisYear: "주째 보내는 중",
  },
  ja: {
    weeks: "週",
    years: "年",
    lived: "経過",
    left: "残り",
    title: "人生カレンダー",
    thisYear: "週目",
  },
};

function getDict(locale: string): DictEntry {
  const lang = (locale || "en").slice(0, 2).toLowerCase();
  return DICT[lang] ?? DICT.en;
}

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function lastBirthday(birth: Date, now: Date): Date {
  const d = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (d.getTime() > now.getTime()) d.setFullYear(now.getFullYear() - 1);
  return d;
}

function fullYears(birth: Date, now: Date): number {
  let years = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) years -= 1;
  return Math.max(0, years);
}

type GridConfig = {
  count: number;
  filled: number;
  current: number;
  cols: number;
  gap: number;
  radius: string;
  maxWidth: number;
  stats: string;
};

export function LifeWeeksWidget({ params }: { params: LifeWeeksParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const dict = getDict(params.locale);
  const isNeon = params.style === "neon";

  const birth = parseLocalDate(params.birthdate);
  const now = new Date();

  const totalWeeks = Math.round(params.lifespan * WEEKS_PER_YEAR);
  const livedWeeks = Math.floor((now.getTime() - birth.getTime()) / WEEK_MS);
  const clampedLivedWeeks = Math.min(Math.max(0, livedWeeks), totalWeeks);
  const weekPct = totalWeeks > 0 ? (clampedLivedWeeks / totalWeeks) * 100 : 0;

  const totalYears = Math.max(1, Math.round(params.lifespan));
  const livedYears = Math.min(fullYears(birth, now), totalYears);
  const yearPct = (livedYears / totalYears) * 100;

  const lastBd = lastBirthday(birth, now);
  const weeksThisYear = Math.min(
    51,
    Math.max(0, Math.floor((now.getTime() - lastBd.getTime()) / WEEK_MS)),
  );

  let cfg: GridConfig;
  if (params.variant === "year") {
    cfg = {
      count: 52,
      filled: weeksThisYear,
      current: weeksThisYear,
      cols: 13,
      gap: 6,
      radius: "50%",
      maxWidth: 238,
      stats: `${weeksThisYear + 1} ${dict.thisYear}`,
    };
  } else if (params.variant === "years") {
    cfg = {
      count: totalYears,
      filled: livedYears,
      current: livedYears,
      cols: 10,
      gap: 6,
      radius: "4px",
      maxWidth: 320,
      stats: `${livedYears} / ${totalYears} ${dict.years} · ${Math.round(yearPct)}%`,
    };
  } else {
    cfg = {
      count: totalWeeks,
      filled: clampedLivedWeeks,
      current: clampedLivedWeeks,
      cols: 52,
      gap: 2,
      radius: "1.5px",
      maxWidth: 384,
      stats: `${clampedLivedWeeks.toLocaleString()} / ${totalWeeks.toLocaleString()} ${dict.weeks} · ${Math.round(weekPct)}%`,
    };
  }

  const dotStyle = (state: "filled" | "empty" | "current"): CSSProperties => {
    const base: CSSProperties = { aspectRatio: "1", borderRadius: cfg.radius };
    if (isNeon) {
      if (state === "empty") {
        return {
          ...base,
          backgroundColor: "transparent",
          border: `1px solid #${colors.accentDim}`,
        };
      }
      if (state === "current") {
        return {
          ...base,
          backgroundColor: `#${colors.accentBright}`,
          boxShadow: `0 0 7px #${colors.accent}, 0 0 14px #${colors.accent}`,
          animation: "lw-pulse 1.5s ease-in-out infinite",
        };
      }
      return {
        ...base,
        backgroundColor: `#${colors.accent}`,
        boxShadow: `0 0 5px #${colors.accent}80`,
      };
    }
    if (state === "empty") {
      return { ...base, backgroundColor: `#${colors.track}` };
    }
    if (state === "current") {
      return {
        ...base,
        backgroundColor: `#${colors.accentBright}`,
        animation: "lw-pulse 1.5s ease-in-out infinite",
      };
    }
    return { ...base, backgroundColor: `#${colors.accent}` };
  };

  const title = params.title || dict.title;
  const titleColor = isNeon ? `#${colors.accent}` : `#${colors.text}`;
  const statColor = isNeon ? `#${colors.accentBright}` : `#${colors.textDim}`;
  const hasCurrent = cfg.current < cfg.count;

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes lw-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
      <div className="flex flex-col items-center w-full px-4" style={{ maxWidth: cfg.maxWidth + 32 }}>
        {title && (
          <h2
            className="text-sm font-semibold tracking-wide mb-3 text-center"
            style={{ color: titleColor, textShadow: "var(--w-text-shadow)" }}
          >
            {isNeon ? `> ${title}` : title}
          </h2>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cfg.cols}, 1fr)`,
            gap: cfg.gap,
            width: "100%",
            maxWidth: cfg.maxWidth,
          }}
        >
          {Array.from({ length: cfg.count }, (_, i) => {
            const state =
              i < cfg.filled
                ? "filled"
                : hasCurrent && i === cfg.current
                  ? "current"
                  : "empty";
            return <div key={i} style={dotStyle(state)} />;
          })}
        </div>
        {params.showStats && (
          <p
            className="text-xs mt-4 text-center tabular-nums"
            style={{ color: statColor, fontVariantNumeric: "tabular-nums" }}
          >
            {cfg.stats}
          </p>
        )}
      </div>
    </WidgetShell>
  );
}
