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
            __html: `(function(){try{var d=document.documentElement.style,s=function(k,v){d.setProperty(k,v)};var m=localStorage.getItem("nw-mode-v1");if(!m){m=window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"}if(m==="light"){s("--bg","#faf9f7");s("--bg-soft","#f1efe9");s("--surface","#ffffff");s("--surface-2","#f6f4ef");s("--inset","#f3f1ea");s("--border","#e6e3da");s("--border-soft","#eeebe3");s("--border-strong","#d6d2c7");s("--track","#e4e0d5");s("--text","#1a1814");s("--text-dim","#57524a");s("--text-faint","#847e73");s("--heat-empty","rgba(0,0,0,0.06)");s("--shadow","rgba(0,0,0,0.14)")}var A={green:{dark:["#7fb686","#98cc9f","#52b07a","#2c5b3e","rgba(127,182,134,0.12)","#0e1a10"],light:["#3d8f5a","#357a4d","#52b07a","#bfe0c8","rgba(61,143,90,0.14)","#ffffff"]},red:{dark:["#ef4444","#f87171","#c93636","#5e2222","rgba(239,68,68,0.12)","#1a0d0d"],light:["#dc2626","#b91c1c","#ef4444","#f3c4c4","rgba(220,38,38,0.13)","#ffffff"]},blue:{dark:["#3b82f6","#60a5fa","#2f68c8","#21345e","rgba(59,130,246,0.12)","#08111f"],light:["#2563eb","#1d4ed8","#3b82f6","#c2d5f7","rgba(37,99,235,0.12)","#ffffff"]},ocean:{dark:["#06b6d4","#38d0ea","#0794ac","#134e5a","rgba(6,182,212,0.12)","#03141a"],light:["#0891b2","#0e7490","#06b6d4","#b6e6ef","rgba(8,145,178,0.13)","#ffffff"]},sunset:{dark:["#f97316","#fb923c","#c85e12","#5e3216","rgba(249,115,22,0.12)","#1a0d05"],light:["#ea580c","#c2410c","#f97316","#fbd9b8","rgba(234,88,12,0.13)","#ffffff"]},purple:{dark:["#a855f7","#c084fc","#8a3fd4","#3b2358","rgba(168,85,247,0.12)","#120819"],light:["#9333ea","#7e22ce","#a855f7","#e3cdf7","rgba(147,51,234,0.13)","#ffffff"]}};var a=localStorage.getItem("nw-accent-v1")||"green";var c=A[a]&&A[a][m]?A[a][m]:A.green[m];if(c){s("--accent",c[0]);s("--accent-bright",c[1]);s("--accent-deep",c[2]);s("--accent-dim",c[3]);s("--accent-tint",c[4]);s("--btn-text",c[5])}}catch(e){}})();`,
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
