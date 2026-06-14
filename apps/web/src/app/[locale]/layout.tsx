import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Header } from "@/components/shared/header";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = await getDictionary(locale);
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

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem("nw-mode-v1");if(!m){m=window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"}if(m==="light"){var d=document.documentElement.style;d.setProperty("--bg","#faf9f7");d.setProperty("--bg-soft","#f1efe9");d.setProperty("--surface","#ffffff");d.setProperty("--surface-2","#f6f4ef");d.setProperty("--inset","#f3f1ea");d.setProperty("--border","#e6e3da");d.setProperty("--border-soft","#eeebe3");d.setProperty("--border-strong","#d6d2c7");d.setProperty("--track","#e4e0d5");d.setProperty("--text","#1a1814");d.setProperty("--text-dim","#57524a");d.setProperty("--text-faint","#847e73");d.setProperty("--heat-empty","rgba(0,0,0,0.06)");d.setProperty("--shadow","rgba(0,0,0,0.14)");d.setProperty("--accent","#3d8f5a");d.setProperty("--accent-bright","#357a4d");d.setProperty("--accent-deep","#52b07a");d.setProperty("--accent-dim","#bfe0c8");d.setProperty("--accent-tint","rgba(61,143,90,0.14)");d.setProperty("--btn-text","#ffffff")}}catch(e){}})();`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Header locale={locale} />
        {children}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
