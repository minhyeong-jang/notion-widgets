"use client";

import { useState, useMemo } from "react";
import { getAllWidgets } from "@nw/widget-core";
import "@nw/widgets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";
import { WidgetCard } from "@/components/shared/widget-card";
import { Footer } from "@/components/shared/footer";

const CATEGORIES = [
  { id: "all", labelKo: "전체", labelEn: "All" },
  { id: "time", labelKo: "시간", labelEn: "Time" },
  { id: "productivity", labelKo: "생산성", labelEn: "Productivity" },
  { id: "lifestyle", labelKo: "라이프스타일", labelEn: "Lifestyle" },
  { id: "utility", labelKo: "유틸리티", labelEn: "Utility" },
];

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function WidgetGalleryPage({ locale, dict }: Props) {
  const allWidgets = useMemo(() => getAllWidgets(), []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return allWidgets.filter((w) => {
      if (activeCategory !== "all" && w.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = getWidgetName(w, locale).toLowerCase();
        const desc = getWidgetDescription(w, locale).toLowerCase();
        if (!name.includes(q) && !desc.includes(q) && !w.meta.id.includes(q)) return false;
      }
      return true;
    });
  }, [allWidgets, activeCategory, search, locale]);

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return allWidgets.length;
    return allWidgets.filter((w) => w.category === catId).length;
  };

  const isKo = locale === "ko";

  return (
    <main>
      {/* Header */}
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        <div style={{ padding: "56px 0 30px" }}>
          <div
            className="font-mono text-xs font-bold tracking-wider uppercase"
            style={{ color: "var(--accent)", marginBottom: 14 }}
          >
            GALLERY &middot; {allWidgets.length} WIDGETS
          </div>
          <h1
            className="font-extrabold"
            style={{ fontSize: 42, letterSpacing: "-0.03em", color: "var(--text)" }}
          >
            {isKo ? "모든 위젯" : "All Widgets"}
          </h1>
          <p
            className="max-w-[520px]"
            style={{ marginTop: 12, fontSize: "16.5px", color: "var(--text-dim)" }}
          >
            {isKo
              ? "Notion에 임베드할 수 있는 모든 위젯을 둘러보세요. 가입 없이 URL 하나로 바로 사용할 수 있습니다."
              : "Browse all widgets you can embed in Notion. Use instantly with just a URL, no sign-up needed."}
          </p>
        </div>
      </div>

      {/* Sticky filter toolbar */}
      <div
        className="sticky z-30"
        style={{
          top: 60,
          backgroundColor: "color-mix(in srgb, var(--bg) 90%, transparent)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-4 flex-wrap"
          style={{ maxWidth: "var(--maxw)", padding: "16px 32px 18px" }}
        >
          {/* Category chips */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="font-semibold whitespace-nowrap rounded-full transition-colors"
                style={{
                  fontSize: "13.5px",
                  padding: "8px 15px",
                  border: `1px solid ${activeCategory === cat.id ? "var(--accent)" : "var(--border)"}`,
                  backgroundColor: activeCategory === cat.id ? "var(--accent)" : "var(--surface)",
                  color: activeCategory === cat.id ? "var(--btn-text)" : "var(--text-dim)",
                  cursor: "pointer",
                }}
              >
                {isKo ? cat.labelKo : cat.labelEn}
                <span className="font-mono opacity-65 ml-1.5" style={{ fontSize: 10 }}>
                  {getCategoryCount(cat.id)}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ fontSize: 13, color: "var(--text-faint)" }}
            >
              &#x2315;
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isKo ? "위젯 검색..." : "Search widgets..."}
              className="focus:outline-none transition-[width]"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                padding: "9px 14px 9px 34px",
                width: 220,
                borderRadius: 10,
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.width = "250px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.width = "220px";
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20 pt-4">
          {filtered.map((w) => (
            <WidgetCard
              key={w.meta.id}
              widgetId={w.meta.id}
              name={getWidgetName(w, locale)}
              description={getWidgetDescription(w, locale)}
              locale={locale}
              recommendedSize={w.recommendedSize}
              category={w.category}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: "var(--text-faint)" }}>
            <div className="font-mono text-3xl mb-2" style={{ color: "var(--text-dim)" }}>
              {"¯\\_(ツ)_/¯"}
            </div>
            <p>{isKo ? "검색 결과가 없습니다" : "No results found"}</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
