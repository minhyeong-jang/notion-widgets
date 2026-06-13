import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { FeedbackPage } from "@/components/feedback/feedback-page";

export async function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: locale === "ko" ? "제보 · 피드백" : "Feedback",
    description:
      locale === "ko"
        ? "버그 제보, 기능 제안, 의견을 보내주세요."
        : "Report bugs, suggest features, or share feedback.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  return <FeedbackPage locale={locale as Locale} dict={dict} />;
}
