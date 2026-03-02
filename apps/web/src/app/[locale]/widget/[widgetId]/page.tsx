import { Suspense } from "react";
import { getAllWidgets } from "@nw/widget-core";
import "@nw/widgets";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CustomizerPage } from "./customizer-page";

export function generateStaticParams() {
  const widgets = getAllWidgets();
  return locales.flatMap((locale) =>
    widgets.map((w) => ({ locale, widgetId: w.meta.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; widgetId: string }>;
}) {
  const { locale, widgetId } = await params;
  const widget = getAllWidgets().find((w) => w.meta.id === widgetId);
  const name = widget
    ? locale === "ko"
      ? (widget.nameKo ?? widget.meta.name)
      : widget.meta.name
    : widgetId;
  return {
    title: name,
    description: widget
      ? locale === "ko"
        ? (widget.descriptionKo ?? widget.meta.description)
        : widget.meta.description
      : "",
    alternates: {
      canonical: `/${locale}/widget/${widgetId}/`,
      languages: {
        ko: `/ko/widget/${widgetId}/`,
        en: `/en/widget/${widgetId}/`,
      },
    },
  };
}

export default async function WidgetCustomizerRoute({
  params,
}: {
  params: Promise<{ locale: string; widgetId: string }>;
}) {
  const { locale, widgetId } = await params;
  const dict = await getDictionary(locale as Locale);
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-zinc-950">
          <div className="text-zinc-500">Loading...</div>
        </div>
      }
    >
      <CustomizerPage widgetId={widgetId} locale={locale as Locale} dict={dict} />
    </Suspense>
  );
}
