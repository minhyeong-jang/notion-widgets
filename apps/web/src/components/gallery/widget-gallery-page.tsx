"use client";

import { useEffect, useRef, useState } from "react";
import { getAllWidgets } from "@nw/widget-core";
import type { WidgetDefinition } from "@nw/widget-core";
import "@nw/widgets";
import {
  ArrowRight,
  Maximize2,
  Plus,
  TerminalSquare,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/ko";
import type { Locale } from "@/i18n/config";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";

const categoryOrder = ["time", "productivity", "lifestyle", "utility"] as const;

const categoryIcons: Record<string, string> = {
  time: "text-sky-400",
  productivity: "text-emerald-400",
  lifestyle: "text-violet-400",
  utility: "text-amber-400",
};

/* ─── Widget Preview Components ─── */

function FlipClockPreview() {
  return (
    <div className="flex items-center gap-1.5 font-mono">
      {["1", "2"].map((d, i) => (
        <div
          key={`h${i}`}
          className="w-9 h-12 rounded-lg bg-zinc-900 border border-zinc-700/50 flex items-center justify-center text-xl font-bold text-zinc-200 shadow-inner"
        >
          {d}
        </div>
      ))}
      <div className="flex flex-col gap-1.5 mx-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>
      {["3", "4"].map((d, i) => (
        <div
          key={`m${i}`}
          className="w-9 h-12 rounded-lg bg-zinc-900 border border-zinc-700/50 flex items-center justify-center text-xl font-bold text-zinc-200 shadow-inner"
        >
          {d}
        </div>
      ))}
    </div>
  );
}

function LifeProgressPreview() {
  const bars = [
    { label: "2026", pct: 16, color: "from-emerald-500 to-emerald-400" },
    { label: "Mar", pct: 3, color: "from-sky-500 to-sky-400" },
    { label: "Q1", pct: 66, color: "from-violet-500 to-violet-400" },
  ];
  return (
    <div className="w-full px-4 space-y-2.5">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
            <span>{b.label}</span>
            <span>{b.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
              style={{ width: `${b.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CountdownPreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl font-bold text-rose-400">D-42</span>
      <div className="flex items-center gap-3 text-zinc-400">
        {[
          { v: "1", l: "mon" },
          { v: "12", l: "day" },
          { v: "06", l: "hr" },
        ].map((d) => (
          <div key={d.l} className="flex flex-col items-center">
            <span className="text-lg font-mono font-semibold text-zinc-200">
              {d.v}
            </span>
            <span className="text-[10px] text-zinc-500">{d.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuotePreview() {
  return (
    <div className="px-5 flex flex-col items-center gap-2 text-center">
      <span className="text-emerald-400/60 text-2xl leading-none">{"\u201C"}</span>
      <p className="text-sm text-zinc-300 leading-relaxed">
        The only way to do great work is to love what you do.
      </p>
      <span className="text-[10px] text-zinc-500">— Steve Jobs</span>
    </div>
  );
}

function PomodoroPreview() {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.65;
  return (
    <div className="flex items-center gap-4">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="4"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
        <text
          x="50" y="54"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontFamily="monospace"
          fontWeight="bold"
          transform="rotate(90 50 50)"
        >
          16:22
        </text>
      </svg>
      <div className="flex flex-col gap-1 text-zinc-400 text-[10px]">
        <span className="text-red-400 font-medium text-xs">Focus</span>
        <span>1/4 sessions</span>
      </div>
    </div>
  );
}

function AnalogClockPreview() {
  const cx = 50, cy = 50, r = 38;
  const hourAngle = 300;
  const minuteAngle = 120;
  return (
    <svg className="w-24 h-24" viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + (r - 4) * Math.sin(rad);
        const y1 = cy - (r - 4) * Math.cos(rad);
        const x2 = cx + (r - 8) * Math.sin(rad);
        const y2 = cy - (r - 8) * Math.cos(rad);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        );
      })}
      <line
        x1={cx} y1={cy}
        x2={cx + 18 * Math.sin((hourAngle * Math.PI) / 180)}
        y2={cy - 18 * Math.cos((hourAngle * Math.PI) / 180)}
        stroke="white" strokeWidth="2.5" strokeLinecap="round"
      />
      <line
        x1={cx} y1={cy}
        x2={cx + 26 * Math.sin((minuteAngle * Math.PI) / 180)}
        y2={cy - 26 * Math.cos((minuteAngle * Math.PI) / 180)}
        stroke="white" strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="2.5" fill="#7fb686" />
    </svg>
  );
}

function WeatherPreview() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl">☀️</span>
      <span className="text-2xl font-bold text-zinc-200">18°C</span>
      <span className="text-[10px] text-zinc-500">Seoul</span>
    </div>
  );
}

function WorldClockPreview() {
  return (
    <div className="flex items-center gap-4">
      {[{ city: "NYC", time: "10:30" }, { city: "London", time: "15:30" }, { city: "Seoul", time: "00:30" }].map((tz) => (
        <div key={tz.city} className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-mono font-bold text-zinc-200">{tz.time}</span>
          <span className="text-[10px] text-zinc-500">{tz.city}</span>
        </div>
      ))}
    </div>
  );
}

function MiniCalendarPreview() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const cells = Array.from({ length: 35 }, (_, i) => i - 3); // offset for month start
  return (
    <div className="w-full px-4">
      <div className="text-center text-xs text-zinc-400 mb-2 font-medium">March 2026</div>
      <div className="grid grid-cols-7 gap-0.5 text-[9px]">
        {days.map((d) => (
          <div key={d} className="text-center text-zinc-600 font-medium">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`text-center py-0.5 rounded ${
              d === 5 ? "bg-emerald-500/30 text-emerald-400 font-bold" : d > 0 && d <= 31 ? "text-zinc-400" : "text-zinc-700"
            }`}
          >
            {d > 0 && d <= 31 ? d : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function MoonPhasePreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg className="w-16 h-16" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#fafafa" opacity="0.9" />
        <ellipse cx="50" cy="50" rx="15" ry="40" fill="#18181b" />
      </svg>
      <span className="text-xs text-zinc-400">Waxing Gibbous</span>
    </div>
  );
}

function HabitHeatmapPreview() {
  const weeks = 10;
  return (
    <div className="px-4 w-full">
      <div className="text-[10px] text-zinc-500 mb-1.5">Year Progress</div>
      <div className="flex gap-[2px]">
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-[2px]">
            {Array.from({ length: 7 }, (_, d) => {
              const filled = w < 7 || (w === 7 && d < 3);
              const intensity = filled ? [0.2, 0.35, 0.5, 0.7][(w * 7 + d) % 4] : 0;
              return (
                <div
                  key={d}
                  className="w-2.5 h-2.5 rounded-[2px]"
                  style={{ backgroundColor: filled ? `rgba(127, 182, 134, ${intensity})` : "rgba(255,255,255,0.05)" }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function BreathingPreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30" />
        <div className="w-14 h-14 rounded-full bg-emerald-400/20 flex items-center justify-center">
          <span className="text-emerald-400 text-xs font-medium">Inhale</span>
        </div>
      </div>
      <span className="text-[10px] text-zinc-500">4-7-8</span>
    </div>
  );
}

function DailyTarotPreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-24 rounded-lg border border-violet-500/30 bg-violet-500/10 flex flex-col items-center justify-center gap-1">
        <span className="text-violet-400 text-lg">★</span>
        <span className="text-[9px] text-violet-300 font-medium">XVII</span>
      </div>
      <span className="text-xs text-zinc-400">The Star</span>
    </div>
  );
}

function StartupTipsPreview() {
  return (
    <div className="px-5 flex flex-col items-center gap-2 text-center">
      <span className="text-emerald-400 text-sm font-bold">80/20 Rule</span>
      <p className="text-[11px] text-zinc-400 leading-relaxed">
        Focus on the 20% of efforts that produce 80% of results.
      </p>
      <span className="text-[9px] text-zinc-600">— Pareto Principle</span>
    </div>
  );
}

function FocusWordPreview() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold tracking-widest text-zinc-100 uppercase">Focus</span>
      <span className="text-[10px] text-zinc-600 tracking-wider">TODAY&apos;S WORD</span>
    </div>
  );
}

function DailyTipPreview() {
  return (
    <div className="px-5 flex flex-col items-center gap-2 text-center">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        productivity
      </span>
      <p className="text-sm text-zinc-300 leading-relaxed">
        Start your day with the hardest task first.
      </p>
    </div>
  );
}

function WidgetPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-zinc-600">
      <TerminalSquare className="w-8 h-8" strokeWidth={1} />
      <span className="text-xs">{name}</span>
    </div>
  );
}

function WidgetPreview({ widgetId, name }: { widgetId: string; name: string }) {
  switch (widgetId) {
    case "flip-clock": return <FlipClockPreview />;
    case "life-progress": return <LifeProgressPreview />;
    case "countdown": return <CountdownPreview />;
    case "quote": return <QuotePreview />;
    case "pomodoro": return <PomodoroPreview />;
    case "analog-clock": return <AnalogClockPreview />;
    case "weather": return <WeatherPreview />;
    case "world-clock": return <WorldClockPreview />;
    case "mini-calendar": return <MiniCalendarPreview />;
    case "moon-phase": return <MoonPhasePreview />;
    case "habit-heatmap": return <HabitHeatmapPreview />;
    case "breathing": return <BreathingPreview />;
    case "daily-tarot": return <DailyTarotPreview />;
    case "startup-tips": return <StartupTipsPreview />;
    case "focus-word": return <FocusWordPreview />;
    case "daily-tip": return <DailyTipPreview />;
    default: return <WidgetPlaceholder name={name} />;
  }
}

/* ─── Widget Card ─── */

function WidgetCard({
  widget,
  locale,
  dict,
}: {
  widget: WidgetDefinition;
  locale: Locale;
  dict: Dictionary;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const name = getWidgetName(widget, locale);
  const description = getWidgetDescription(widget, locale);

  return (
    <a
      ref={cardRef}
      href={`/${locale}/widget/${widget.meta.id}/`}
      className={`group relative block rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Widget visual preview */}
        <div className="mb-5 h-32 rounded-xl bg-zinc-800/50 border border-zinc-800/40 flex items-center justify-center overflow-hidden">
          <WidgetPreview widgetId={widget.meta.id} name={name} />
        </div>

        {/* Name and description */}
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">{name}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          {description}
        </p>

        {/* Action row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
            {widget.recommendedSize && (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>
                  {widget.recommendedSize.width} x {widget.recommendedSize.height}
                </span>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {dict.gallery.customize}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─── Main Gallery Page ─── */

export function WidgetGalleryPage({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>([]);

  useEffect(() => {
    setWidgets(getAllWidgets());
  }, []);

  const grouped = new Map<string, WidgetDefinition[]>();
  for (const cat of categoryOrder) {
    const items = widgets.filter((w) => w.category === cat);
    if (items.length > 0) grouped.set(cat, items);
  }
  // Catch any uncategorized widgets
  const uncategorized = widgets.filter(
    (w) => !categoryOrder.includes((w.category ?? "") as typeof categoryOrder[number]),
  );
  if (uncategorized.length > 0) grouped.set("utility", [...(grouped.get("utility") ?? []), ...uncategorized]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        {/* Title */}
        <div className="mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 tracking-tight mb-4">
            {dict.gallery.pageTitle}
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            {dict.gallery.pageDescription}
          </p>
        </div>

        {/* Category sections */}
        <div className="space-y-16">
          {categoryOrder.map((cat) => {
            const items = grouped.get(cat);
            if (!items || items.length === 0) return null;
            const label = dict.categories[cat as keyof typeof dict.categories] ?? cat;

            return (
              <section key={cat}>
                <h2 className={`text-xl font-semibold mb-6 ${categoryIcons[cat] ?? "text-zinc-300"}`}>
                  {label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((widget) => (
                    <WidgetCard
                      key={widget.meta.id}
                      widget={widget}
                      locale={locale}
                      dict={dict}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Coming soon hint */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-4 py-6 border border-dashed border-zinc-800 rounded-2xl text-zinc-600">
            <Plus className="w-5 h-5" />
            <span className="text-sm">{dict.gallery.comingSoon}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
