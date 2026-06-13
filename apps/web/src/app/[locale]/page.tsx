import { getDictionary } from "@/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { Featured } from "@/components/landing/featured";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/shared/footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <main>
      <Hero dict={dict} locale={locale as Locale} />
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        <div className="h-px" style={{ backgroundColor: "var(--border-soft)" }} />
      </div>
      <Featured dict={dict} locale={locale as Locale} />
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        <div className="h-px" style={{ backgroundColor: "var(--border-soft)" }} />
      </div>
      <HowItWorks dict={dict} locale={locale as Locale} />
      <Footer />
    </main>
  );
}
