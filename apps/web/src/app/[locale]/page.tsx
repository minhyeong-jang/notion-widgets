import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Hero } from "@/components/landing/hero";
import { WidgetGallery } from "@/components/landing/widget-gallery";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-[family-name:var(--font-geist-sans)]">
      <Hero dict={dict} />
      <WidgetGallery dict={dict} locale={locale as Locale} showViewAll />
      <HowItWorks dict={dict} />
      <Footer dict={dict} locale={locale as Locale} />
    </main>
  );
}
