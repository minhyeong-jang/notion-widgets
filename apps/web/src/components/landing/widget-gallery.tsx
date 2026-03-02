"use client";

import { useEffect, useState } from "react";
import { getAllWidgets } from "@nw/widget-core";
import type { WidgetDefinition } from "@nw/widget-core";
import "@nw/widgets";
import { Plus, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { WidgetCard } from "@/components/shared/widget-card";

interface WidgetGalleryProps {
  dict: Dictionary;
  locale: Locale;
  showViewAll?: boolean;
}

export function WidgetGallery({ dict, locale, showViewAll }: WidgetGalleryProps) {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>([]);

  useEffect(() => {
    setWidgets(getAllWidgets());
  }, []);

  return (
    <section id="gallery" className="relative px-6 py-32">
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 tracking-tight mb-4">
          {dict.gallery.title}
        </h2>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          {dict.gallery.description}
        </p>
      </div>

      {/* Card grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <WidgetCard
            key={widget.meta.id}
            widget={widget}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>

      {/* Coming soon hint */}
      {widgets.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-4 py-6 border border-dashed border-zinc-800 rounded-2xl text-zinc-600">
            <Plus className="w-5 h-5" />
            <span className="text-sm">{dict.gallery.comingSoon}</span>
          </div>
        </div>
      )}

      {/* View all link */}
      {showViewAll && (
        <div className="max-w-6xl mx-auto mt-6 text-center">
          <a
            href={`/${locale}/widgets/`}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {dict.gallery.viewAll}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </section>
  );
}
