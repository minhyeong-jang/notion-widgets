"use client";

import { useCallback, useState } from "react";
import { getWidget, getColorTheme } from "@nw/widget-core";
import "@nw/widgets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";

import { ControlPanel } from "@/components/customizer/control-panel";
import { PreviewFrame } from "@/components/customizer/preview-frame";
import { UrlGenerator } from "@/components/customizer/url-generator";

interface CustomizerPageProps {
  widgetId: string;
  locale: Locale;
  dict: Dictionary;
}

export function CustomizerPage({ widgetId, locale, dict }: CustomizerPageProps) {
  const widget = getWidget(widgetId);

  const [currentParams, setCurrentParams] = useState<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    if (widget) {
      for (const control of widget.controls ?? []) {
        params[control.key] = String(control.defaultValue);
      }
    }
    return params;
  });

  const handleChange = useCallback(
    (key: string, value: string) => {
      setCurrentParams((prev) => {
        const next = { ...prev, [key]: value };

        if (key === "colorTheme" && value !== "default") {
          const ct = getColorTheme(value);
          if (ct) {
            next.color = ct.colors.accent;
            next.bg = ct.colors.bg;
          }
        }

        return next;
      });
    },
    [],
  );

  if (!widget) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">
          {dict.customizer.widgetNotFound}: {widgetId}
        </p>
      </div>
    );
  }

  const name = getWidgetName(widget, locale);
  const description = getWidgetDescription(widget, locale);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-zinc-100">{name}</h1>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls - left on desktop, below on mobile */}
          <div className="w-full lg:w-80 shrink-0 order-2 lg:order-1">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">
                {dict.customizer.customization}
              </h2>
              <ControlPanel
                controls={widget.controls ?? []}
                values={currentParams}
                onChange={handleChange}
                locale={locale}
                dict={dict}
              />
            </div>
          </div>

          {/* Preview - right on desktop, top on mobile */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-6 max-h-[60vh] lg:max-h-none">
              <PreviewFrame
                widgetId={widgetId}
                params={currentParams}
                recommendedSize={widget.recommendedSize}
                dict={dict}
              />
            </div>
          </div>
        </div>

        {/* URL Generator */}
        <div className="mt-8 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">
            {dict.customizer.embedUrl}
          </h2>
          <UrlGenerator widgetId={widgetId} params={currentParams} dict={dict} />
        </div>
      </main>
    </div>
  );
}
