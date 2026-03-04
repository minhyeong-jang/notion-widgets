import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Header } from "@/components/shared/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  const siteName = dict.meta.siteName;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: dict.meta.siteDescription,
    metadataBase: new URL("https://widgets.doriri.dev"),
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ko: "/ko/",
        en: "/en/",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      locale,
      title: siteName,
      description: dict.meta.siteDescription,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header locale={locale as Locale} />
        {children}
      </body>
    </html>
  );
}
