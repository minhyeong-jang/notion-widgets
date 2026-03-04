"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { Globe } from "lucide-react";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();

  function switchedPath(targetLocale: Locale): string {
    const withoutLocale = pathname.replace(/^\/(ko|en)/, "");
    return `/${targetLocale}${withoutLocale || "/"}`;
  }

  const isHome =
    pathname === `/${locale}` || pathname === `/${locale}/`;
  const isWidgets = pathname.includes("/widgets") || pathname.includes("/widget/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/40 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href={`/${locale}/`}
          className="flex items-center gap-2 text-lg font-semibold text-zinc-200 tracking-tight hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 512 512" fill="none">
            <rect width="512" height="512" rx="108" fill="#18181b"/>
            <rect x="72" y="72" width="164" height="164" rx="32" fill="#7fb686"/>
            <rect x="276" y="72" width="164" height="164" rx="32" fill="#3f3f46"/>
            <rect x="72" y="276" width="164" height="164" rx="32" fill="#3f3f46"/>
            <rect x="276" y="276" width="164" height="164" rx="32" fill="#52b07a"/>
          </svg>
          Notion Widgets
        </Link>

        {/* Center: Nav */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/60 rounded-full px-1 py-1">
          <Link
            href={`/${locale}/`}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              isHome
                ? "text-zinc-100 bg-zinc-800 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {locale === "ko" ? "홈" : "Home"}
          </Link>
          <Link
            href={`/${locale}/widgets/`}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              isWidgets
                ? "text-zinc-100 bg-zinc-800 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {locale === "ko" ? "위젯" : "Widgets"}
          </Link>
        </nav>

        {/* Right: Language Switcher */}
        <div className="flex items-center gap-1 text-sm bg-zinc-900/60 border border-zinc-800/60 rounded-full px-2 py-1">
          <Globe className="w-3.5 h-3.5 text-zinc-500 mr-1" />
          {locales.map((loc) => (
            <a
              key={loc}
              href={switchedPath(loc)}
              hrefLang={loc}
              className={`px-2.5 py-1 rounded-full transition-colors text-xs font-medium ${
                loc === locale
                  ? "text-zinc-100 bg-zinc-700/80"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {loc === "ko" ? "KO" : "EN"}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
