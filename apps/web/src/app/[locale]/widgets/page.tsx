import type { Metadata } from "next";
import { getAllWidgets } from "@nw/widget-core";
import "@nw/widgets";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";
import { JsonLd } from "@/components/seo/json-ld";
import { WidgetGalleryPage } from "@/components/gallery/widget-gallery-page";
import { Footer } from "@/components/landing/footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.meta.galleryTitle,
    description: dict.meta.galleryDescription,
    alternates: {
      canonical: `/${locale}/widgets/`,
      languages: {
        ko: "/ko/widgets/",
        en: "/en/widgets/",
      },
    },
    openGraph: {
      locale,
      title: dict.meta.galleryTitle,
      description: dict.meta.galleryDescription,
    },
  };
}

const BASE_URL = "https://widgets.doriri.dev";

export default async function WidgetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const widgets = getAllWidgets();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.meta.galleryTitle,
    description: dict.meta.galleryDescription,
    numberOfItems: widgets.length,
    itemListElement: widgets.map((widget, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getWidgetName(widget, locale as Locale),
      description: getWidgetDescription(widget, locale as Locale),
      url: `${BASE_URL}/${locale}/widget/${widget.meta.id}/`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <WidgetGalleryPage dict={dict} locale={locale as Locale} />
      <Footer dict={dict} locale={locale as Locale} />
    </>
  );
}
