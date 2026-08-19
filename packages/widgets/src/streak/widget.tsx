"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { StreakParams } from "./schema";
import { useStreak, dateKey, addDays } from "./streak";

// The app's inherited sans font ships monochrome glyphs for some emoji;
// force a color-emoji stack so the flame always renders in color.
const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji",sans-serif';

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

interface Strings {
  streak: string; // label under the number
  check: string;
  checked: string;
  best: string;
  none: string; // shown when current streak is 0
}

const STRINGS: Record<string, Strings> = {
  en: { streak: "day streak", check: "Check in today", checked: "Checked in", best: "Best", none: "Start your streak" },
  ko: { streak: "일 연속", check: "오늘 체크인", checked: "체크인 완료", best: "최고", none: "연속 기록을 시작하세요" },
  ja: { streak: "日連続", check: "今日チェックイン", checked: "チェックイン済み", best: "最高", none: "連続記録を始めよう" },
  zh: { streak: "天连续", check: "今日打卡", checked: "已打卡", best: "最佳", none: "开始你的连续记录" },
  de: { streak: "Tage-Serie", check: "Heute eintragen", checked: "Eingetragen", best: "Rekord", none: "Starte deine Serie" },
  fr: { streak: "jours d'affilée", check: "Valider aujourd'hui", checked: "Validé", best: "Record", none: "Commencez votre série" },
  es: { streak: "días seguidos", check: "Marcar hoy", checked: "Marcado", best: "Récord", none: "Empieza tu racha" },
};

interface DayCell {
  key: string;
  checked: boolean;
  isToday: boolean;
}

export function StreakWidget({ params }: { params: StreakParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  const storageKey = `nw:streak:${(params.label || "streak").trim().toLowerCase()}`;
  const { checked, stats, checkedToday, today, hydrated, toggleToday } = useStreak(storageKey);

  const isNeon = params.style === "neon";
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const track = `#${colors.track}`;
  const btnText = `#${colors.btnText}`;
  const font = isNeon ? "monospace" : undefined;

  const active = stats.current > 0;
  const numColor = active ? (isNeon ? accentBright : accent) : textFaint;

  // Last `n` days ending today (oldest → newest).
  const recent = (n: number): DayCell[] => {
    if (!today) {
      return Array.from({ length: n }, (_, i) => ({ key: `ph-${i}`, checked: false, isToday: i === n - 1 }));
    }
    return Array.from({ length: n }, (_, i) => {
      const d = addDays(today, -(n - 1 - i));
      const key = dateKey(d);
      return { key, checked: checked.has(key), isToday: i === n - 1 };
    });
  };

  const renderLabel = () =>
    params.label ? (
      <div
        className="text-[11px] font-semibold uppercase"
        style={{ color: isNeon ? accentBright : textDim, letterSpacing: isNeon ? "2px" : "0.08em", textShadow: "var(--w-text-shadow)", fontFamily: font }}
      >
        {isNeon ? `> ${params.label}` : params.label}
      </div>
    ) : null;

  const renderBig = (size: number) => (
    <div className="flex items-baseline justify-center" style={{ gap: 6 }}>
      <span
        className="font-bold tabular-nums leading-none"
        style={{ fontSize: size, color: numColor, textShadow: "var(--w-text-shadow)", fontFamily: font }}
      >
        {hydrated ? stats.current : 0}
      </span>
    </div>
  );

  const renderSub = () => (
    <div className="text-xs font-medium" style={{ color: active ? textDim : textFaint, fontFamily: font }}>
      {active ? t.streak : t.none}
    </div>
  );

  const renderBest = () =>
    hydrated && stats.best > 0 ? (
      <div className="text-[11px] font-medium" style={{ color: isNeon ? accent : textFaint, opacity: isNeon ? 0.7 : 1, fontFamily: font }}>
        {isNeon ? "// " : ""}
        {t.best} · {stats.best}
      </div>
    ) : null;

  // Small circular dot for the 7-day row.
  const dot = (c: DayCell) => (
    <span
      key={c.key}
      title={c.key}
      style={{
        width: 11,
        height: 11,
        borderRadius: "50%",
        background: c.checked ? accent : track,
        boxShadow: c.checked && isNeon ? `0 0 6px ${accent}` : undefined,
        outline: c.isToday ? `2px solid ${hexToRgba(colors.accent, 0.9)}` : undefined,
        outlineOffset: 1,
        opacity: c.checked ? 1 : 0.7,
      }}
    />
  );

  // Rounded square for the 14-day chain.
  const link = (c: DayCell) => (
    <span
      key={c.key}
      title={c.key}
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        background: c.checked ? hexToRgba(colors.accent, isNeon ? 0.9 : 1) : `#${colors.inset}`,
        border: `1.5px solid ${c.checked ? accent : `#${colors.border}`}`,
        boxShadow: c.checked && isNeon ? `0 0 6px ${accent}` : c.isToday ? `0 0 0 2px ${hexToRgba(colors.accent, 0.5)}` : undefined,
      }}
    />
  );

  const checkButton = () => {
    const done = checkedToday;
    const bg = done ? "transparent" : isNeon ? "transparent" : accent;
    const bd = done ? `#${colors.border}` : isNeon ? accent : accent;
    const fg = done ? textDim : isNeon ? accentBright : btnText;
    return (
      <button
        type="button"
        disabled={!hydrated}
        onClick={toggleToday}
        className="transition-transform active:scale-95 hover:-translate-y-px"
        style={{
          marginTop: 2,
          padding: "8px 18px",
          borderRadius: isNeon ? 6 : 999,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: font,
          letterSpacing: isNeon ? "1px" : undefined,
          color: fg,
          background: bg,
          border: `1.5px solid ${bd}`,
          cursor: hydrated ? "pointer" : "default",
          boxShadow: !done && !isNeon ? `0 4px 14px ${hexToRgba(colors.accent, 0.3)}` : !done && isNeon ? `0 0 14px ${hexToRgba(colors.accent, 0.5)}` : undefined,
          whiteSpace: "nowrap",
        }}
      >
        {done ? `${t.checked} ✓` : isNeon ? `> ${t.check}` : t.check}
      </button>
    );
  };

  let inner: React.ReactNode;

  if (params.variant === "chain") {
    const days = recent(14);
    inner = (
      <div className="flex flex-col items-center" style={{ gap: 12, padding: "4px 10px" }}>
        {renderLabel()}
        {renderBig(56)}
        {renderSub()}
        <div className="grid" style={{ gridTemplateColumns: "repeat(7, 18px)", gap: 6, justifyContent: "center" }}>
          {days.map(link)}
        </div>
        {checkButton()}
        {renderBest()}
      </div>
    );
  } else if (params.variant === "minimal") {
    const days = recent(7);
    inner = (
      <div className="flex flex-col items-center" style={{ gap: 12, padding: "4px 10px" }}>
        {renderLabel()}
        {renderBig(64)}
        {renderSub()}
        <div className="flex items-center" style={{ gap: 8 }}>
          {days.map(dot)}
        </div>
        {checkButton()}
        {renderBest()}
      </div>
    );
  } else {
    // flame (default) — emoji hero
    const days = recent(7);
    inner = (
      <div className="flex flex-col items-center" style={{ gap: 10, padding: "4px 10px" }}>
        {renderLabel()}
        <div style={{ fontSize: 44, lineHeight: 1, fontFamily: EMOJI_FONT, filter: active && isNeon ? `drop-shadow(0 0 10px ${accent})` : undefined, opacity: active ? 1 : 0.45 }}>
          🔥
        </div>
        {renderBig(52)}
        {renderSub()}
        <div className="flex items-center" style={{ gap: 8, marginTop: 2 }}>
          {days.map(dot)}
        </div>
        {checkButton()}
        {renderBest()}
      </div>
    );
  }

  return <WidgetShell params={params}>{inner}</WidgetShell>;
}
