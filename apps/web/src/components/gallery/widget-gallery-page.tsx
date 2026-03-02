"use client";

import { useEffect, useRef, useState } from "react";
import { getAllWidgets } from "@nw/widget-core";
import type { WidgetDefinition } from "@nw/widget-core";
import "@nw/widgets";
import {
  ArrowRight,
  Maximize2,
  Plus,
  ArrowLeft,
  TerminalSquare,
  Globe,
  ChevronDown,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/ko";
import type { Locale } from "@/i18n/config";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";

const categories = ["all", "time", "productivity", "lifestyle", "utility"] as const;
type Category = (typeof categories)[number];

const categoryColors: Record<string, string> = {
  time: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  productivity: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lifestyle: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  utility: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function getCategoryLabel(cat: string, dict: Dictionary): string {
  if (cat === "all") return dict.gallery.filterAll;
  return dict.categories[cat as keyof typeof dict.categories] ?? cat;
}

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

  const category = widget.category ?? "utility";
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
        {/* Category badge */}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            categoryColors[category] ?? categoryColors.utility
          }`}
        >
          {getCategoryLabel(category, dict)}
        </span>

        {/* Widget visual preview */}
        <div className="mt-5 mb-5 h-32 rounded-xl bg-zinc-800/50 border border-zinc-800/40 flex items-center justify-center overflow-hidden">
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

/* ─── Language Switcher (inline) ─── */

function LanguageSwitcher({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const otherLocale = locale === "ko" ? "en" : "ko";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
      >
        <Globe className="w-4 h-4" />
        {dict.language[locale]}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl z-50 overflow-hidden">
          <a
            href={`/${otherLocale}/widgets/`}
            className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            {dict.language[otherLocale]}
          </a>
        </div>
      )}
    </div>
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
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  useEffect(() => {
    setWidgets(getAllWidgets());
  }, []);

  const filtered =
    activeCategory === "all"
      ? widgets
      : widgets.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-[family-name:var(--font-geist-sans)]">
      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <a
              href={`/${locale}/`}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {dict.common.home}
            </a>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 font-medium">{dict.common.widgets}</span>
          </nav>

          <LanguageSwitcher locale={locale} dict={dict} />
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 tracking-tight mb-4">
            {dict.gallery.pageTitle}
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            {dict.gallery.pageDescription}
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                  : "bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {getCategoryLabel(cat, dict)}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((widget) => (
            <WidgetCard
              key={widget.meta.id}
              widget={widget}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>

        {/* Coming soon hint */}
        {filtered.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-center gap-4 py-6 border border-dashed border-zinc-800 rounded-2xl text-zinc-600">
              <Plus className="w-5 h-5" />
              <span className="text-sm">{dict.gallery.comingSoon}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
