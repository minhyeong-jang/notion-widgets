"use client";

import { useCallback, useEffect, useState } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { MoodTrackerParams } from "./schema";

/** 5-level mood scale (index 0 = lowest, 4 = highest) per emoji set. */
const EMOJI_SETS: Record<string, string[]> = {
  faces: ["😔", "😕", "😐", "🙂", "😄"],
  weather: ["⛈️", "🌧️", "☁️", "⛅", "☀️"],
  nature: ["🥀", "🍂", "🌱", "🌿", "🌸"],
};

const STRINGS: Record<
  string,
  { title: string; week: string; empty: string; logged: (n: number) => string }
> = {
  ko: {
    title: "오늘 기분 어때요?",
    week: "이번 주",
    empty: "오늘 기분을 골라보세요",
    logged: (n) => `이번 주 ${n}일 기록`,
  },
  en: {
    title: "How are you feeling?",
    week: "This week",
    empty: "Pick your mood for today",
    logged: (n) => `${n} ${n === 1 ? "day" : "days"} logged this week`,
  },
  ja: {
    title: "今日の気分は？",
    week: "今週",
    empty: "今日の気分を選んでください",
    logged: (n) => `今週 ${n}日記録`,
  },
  zh: {
    title: "今天心情如何？",
    week: "本周",
    empty: "选择今天的心情",
    logged: (n) => `本周记录 ${n} 天`,
  },
  de: {
    title: "Wie fühlst du dich?",
    week: "Diese Woche",
    empty: "Wähle deine Stimmung für heute",
    logged: (n) => `${n} ${n === 1 ? "Tag" : "Tage"} diese Woche`,
  },
  fr: {
    title: "Comment te sens-tu ?",
    week: "Cette semaine",
    empty: "Choisis ton humeur du jour",
    logged: (n) => `${n} ${n === 1 ? "jour" : "jours"} cette semaine`,
  },
  es: {
    title: "¿Cómo te sientes?",
    week: "Esta semana",
    empty: "Elige tu ánimo de hoy",
    logged: (n) => `${n} ${n === 1 ? "día" : "días"} esta semana`,
  },
};

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Monday (local midnight) of the week containing `d`. */
function startOfWeekMonday(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (r.getDay() + 6) % 7; // Mon = 0 … Sun = 6
  r.setDate(r.getDate() - dow);
  return r;
}

type MoodMap = Record<string, number>;

/** Hydration-safe localStorage map of dateKey → mood index (0-4). */
function useMoodStore(storageKey: string) {
  const [moods, setMoods] = useState<MoodMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as MoodMap;
        if (parsed && typeof parsed === "object") setMoods(parsed);
      }
    } catch {
      // localStorage unavailable — stay in-memory.
    }
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      try {
        setMoods(e.newValue ? (JSON.parse(e.newValue) as MoodMap) : {});
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const setMood = useCallback(
    (key: string, value: number) => {
      setMoods((prev) => {
        // Toggle off when re-selecting the same mood.
        const next: MoodMap = { ...prev };
        if (next[key] === value) delete next[key];
        else next[key] = value;

        // Prune entries older than ~70 days to keep storage small.
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 70);
        const cutoffKey = dateKey(cutoff);
        for (const k of Object.keys(next)) {
          if (k < cutoffKey) delete next[k];
        }

        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* ignore write failures */
        }
        return next;
      });
    },
    [storageKey],
  );

  return { moods, hydrated, setMood };
}

export function MoodTrackerWidget({ params }: { params: MoodTrackerParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);

  const emojis = EMOJI_SETS[params.variant] ?? EMOJI_SETS.faces;
  const t = STRINGS[params.locale.slice(0, 2)] ?? STRINGS.en;

  const storageKey = `nw:mood-tracker:${params.variant}`;
  const { moods, hydrated, setMood } = useMoodStore(storageKey);

  // Compute "today" on the client only, to stay hydration-safe.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  const isNeon = params.style === "neon";
  const isDark = mode === "dark";

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentTint = `#${colors.accentTint}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;
  const textFaint = `#${colors.textFaint}`;
  const track = `#${colors.track}`;
  const border = `#${colors.border}`;
  const borderStrong = `#${colors.borderStrong}`;

  const glow = isNeon ? accentBright : undefined;

  const todayKey = today ? dateKey(today) : null;
  const todayMood = todayKey && todayKey in moods ? moods[todayKey] : null;

  // Localized weekday initials for Mon…Sun (deterministic reference week).
  const refMonday = new Date(2024, 0, 1); // a Monday
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(refMonday);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString(params.locale, { weekday: "short" }).slice(0, 3);
  });

  // The 7 dates of the current week (Mon…Sun).
  const weekDates = today
    ? Array.from({ length: 7 }, (_, i) => {
        const d = startOfWeekMonday(today);
        d.setDate(d.getDate() + i);
        return d;
      })
    : null;

  const loggedThisWeek = weekDates
    ? weekDates.filter((d) => dateKey(d) in moods).length
    : 0;

  const title = params.label.trim() || t.title;

  return (
    <WidgetShell params={params}>
      <style>{`
        .nw-mood-btn {
          cursor: pointer;
          transition: transform .14s ease, background-color .15s ease, border-color .15s ease, filter .15s ease, opacity .15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nw-mood-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.06); }
        .nw-mood-btn:active:not(:disabled) { transform: scale(0.94); }
        .nw-mood-btn:disabled { cursor: default; }
      `}</style>

      <div
        className="flex flex-col items-center"
        style={{ gap: 16, padding: "6px 14px", width: "100%", maxWidth: 320 }}
      >
        {/* Heading */}
        <div
          className="font-semibold text-center"
          style={{
            fontSize: 14,
            color: isNeon ? accentBright : text,
            textShadow: "var(--w-text-shadow)",
            fontFamily: isNeon ? "monospace" : undefined,
            letterSpacing: isNeon ? "1px" : "0.01em",
          }}
        >
          {isNeon ? `> ${title}` : title}
        </div>

        {/* Today's selected mood (big) */}
        <div
          className="flex items-center justify-center"
          style={{
            fontSize: 46,
            lineHeight: 1,
            height: 56,
            filter:
              todayMood !== null && isNeon
                ? `drop-shadow(0 0 10px ${accentBright}aa)`
                : undefined,
            opacity: todayMood !== null ? 1 : 0.35,
            transition: "opacity .2s ease",
          }}
          aria-hidden
        >
          {todayMood !== null ? emojis[todayMood] : emojis[2]}
        </div>

        {/* Mood picker */}
        <div className="flex items-center justify-center" style={{ gap: 8 }}>
          {emojis.map((emoji, i) => {
            const selected = todayMood === i;
            return (
              <button
                key={i}
                type="button"
                className="nw-mood-btn flex items-center justify-center"
                disabled={!hydrated || !todayKey}
                onClick={() => todayKey && setMood(todayKey, i)}
                aria-pressed={selected}
                aria-label={`Mood level ${i + 1}`}
                style={{
                  width: 42,
                  height: 42,
                  fontSize: 22,
                  lineHeight: 1,
                  borderRadius: isNeon ? 6 : 12,
                  background: selected ? accentTint : isDark ? track : track,
                  border: `1.5px solid ${selected ? accent : isNeon ? `${accent}44` : border}`,
                  boxShadow: selected
                    ? isNeon
                      ? `0 0 12px ${accent}66, inset 0 0 8px ${accent}22`
                      : `0 2px 10px ${accent}33`
                    : "none",
                  opacity: selected ? 1 : 0.72,
                }}
              >
                <span aria-hidden>{emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Week strip */}
        {params.showWeek && (
          <div className="flex flex-col items-center" style={{ gap: 8, width: "100%" }}>
            <div
              className="w-full"
              style={{ height: 1, background: isNeon ? `${accent}33` : border }}
            />
            <div
              className="text-[10px] font-semibold self-start"
              style={{
                color: isNeon ? accent : textFaint,
                letterSpacing: isNeon ? "2px" : "0.14em",
                textTransform: "uppercase",
                fontFamily: isNeon ? "monospace" : undefined,
              }}
            >
              {isNeon ? `[ ${t.week} ]` : t.week}
            </div>

            <div className="flex items-start justify-between" style={{ gap: 4, width: "100%" }}>
              {weekdayLabels.map((label, i) => {
                const d = weekDates?.[i] ?? null;
                const key = d ? dateKey(d) : null;
                const mood = key && key in moods ? moods[key] : null;
                const isToday = key !== null && key === todayKey;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ gap: 5, flex: 1, minWidth: 0 }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 30,
                        height: 30,
                        fontSize: 17,
                        lineHeight: 1,
                        borderRadius: isNeon ? 5 : 9,
                        background:
                          mood !== null
                            ? "transparent"
                            : isNeon
                              ? `${accent}0e`
                              : track,
                        border: isToday
                          ? `1.5px solid ${accent}`
                          : mood !== null
                            ? `1px solid transparent`
                            : `1px solid ${isNeon ? `${accent}22` : border}`,
                        boxShadow:
                          isToday && isNeon ? `0 0 8px ${accent}55` : "none",
                      }}
                    >
                      {mood !== null ? (
                        <span aria-hidden>{emojis[mood]}</span>
                      ) : (
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: isNeon ? `${accent}55` : borderStrong,
                            opacity: 0.7,
                          }}
                        />
                      )}
                    </div>
                    <div
                      className="text-[9px] font-medium"
                      style={{
                        color: isToday
                          ? isNeon
                            ? accentBright
                            : accent
                          : isNeon
                            ? `${accent}99`
                            : textFaint,
                        fontFamily: isNeon ? "monospace" : undefined,
                        letterSpacing: isNeon ? "0.5px" : undefined,
                        textShadow:
                          isToday && glow ? `0 0 6px ${accentBright}` : undefined,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div
              className="text-[11px] font-medium"
              style={{
                color: isNeon ? accent : textDim,
                fontFamily: isNeon ? "monospace" : undefined,
                opacity: isNeon ? 0.85 : 1,
                marginTop: 2,
              }}
            >
              {hydrated && today
                ? loggedThisWeek > 0
                  ? t.logged(loggedThisWeek)
                  : t.empty
                : " "}
            </div>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
