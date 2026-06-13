"use client";

import { useEffect, useState } from "react";
import { getAllWidgets } from "@nw/widget-core";
import type { WidgetDefinition } from "@nw/widget-core";
import "@nw/widgets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { WidgetCard } from "@/components/shared/widget-card";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";

const FEATURED_IDS = [
  "world-clock",
  "life-progress",
  "countdown",
  "habit-heatmap",
  "quote",
  "weather",
];

interface FeaturedProps {
  dict: Dictionary;
  locale: Locale;
}

export function Featured({ dict, locale }: FeaturedProps) {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>([]);

  useEffect(() => {
    const all = getAllWidgets();
    const featured = FEATURED_IDS.map((id) =>
      all.find((w) => w.meta.id === id)
    ).filter(Boolean) as WidgetDefinition[];
    setWidgets(featured);
  }, []);

  const totalCount = getAllWidgets().length;

  return (
    <section id="gallery" style={{ padding: "90px 0" }}>
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        {/* Header row */}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6"
          style={{ marginBottom: 32 }}
        >
          <div>
            <div
              className="text-accent font-bold uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Featured
            </div>
            <h2
              className="text-text"
              style={{
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                marginBottom: 8,
              }}
            >
              자주 쓰는 위젯
            </h2>
            <p className="text-text-dim" style={{ fontSize: 15 }}>
              가장 사랑받는 위젯들을 추렸어요. 전체 목록은 갤러리에서.
            </p>
          </div>
          <a
            href={`/${locale}/widgets`}
            className="inline-flex items-center gap-2 whitespace-nowrap text-text-dim font-semibold border border-border-strong transition-colors duration-200 hover:text-text hover:border-text-faint"
            style={{
              fontSize: 14,
              padding: "9px 16px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            전체 {totalCount}개 보기{" "}
            <span className="font-mono inline-block transition-transform duration-200 group-hover:translate-x-[3px]">
              →
            </span>
          </a>
        </div>

        {/* Widget grid */}
        <div
          className="grid gap-5"
          style={{ marginBottom: 28 }}
        >
          <style>{`
            @media (min-width: 921px) {
              .feat-grid { grid-template-columns: repeat(3, 1fr) !important; }
            }
            @media (min-width: 561px) and (max-width: 920px) {
              .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 560px) {
              .feat-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
          <div className="grid gap-5 feat-grid">
            {widgets.map((widget) => (
              <WidgetCard
                key={widget.meta.id}
                widgetId={widget.meta.id}
                name={getWidgetName(widget, locale)}
                description={getWidgetDescription(widget, locale)}
                locale={locale}
                recommendedSize={widget.recommendedSize}
                category={widget.category}
              />
            ))}
          </div>
        </div>

        {/* Gallery CTA bar */}
        <a
          href={`/${locale}/widgets`}
          className="flex items-center justify-between gap-5 bg-surface border border-border transition-all duration-200 hover:border-border-strong hover:bg-surface-2"
          style={{
            padding: "20px 26px",
            borderRadius: 14,
            textDecoration: "none",
          }}
        >
          <span className="text-text-dim" style={{ fontSize: 14 }}>
            시계 · 진행률 · D-Day · 날씨 · 명언 외 {totalCount - 5}개 더
          </span>
          <span
            className="inline-flex items-center gap-[9px] whitespace-nowrap text-accent font-bold"
            style={{ fontSize: 14.5 }}
          >
            전체 위젯 갤러리{" "}
            <span className="font-mono inline-block transition-transform duration-200">
              →
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
