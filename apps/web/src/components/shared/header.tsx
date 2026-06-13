"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

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
  const isWidgets =
    pathname.includes("/widgets") || pathname.includes("/widget/");
  const isFeedback = pathname.includes("/feedback");

  const navItems = [
    {
      href: `/${locale}/`,
      label: locale === "ko" ? "홈" : "Home",
      active: isHome,
    },
    {
      href: `/${locale}/widgets/`,
      label: locale === "ko" ? "위젯" : "Widgets",
      active: isWidgets,
    },
    {
      href: `/${locale}/feedback/`,
      label: locale === "ko" ? "제보" : "Feedback",
      active: isFeedback,
    },
  ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "color-mix(in srgb, var(--bg) 82%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1080, padding: "0 32px", height: 60 }}>
        {/* Logo */}
        <Link
          href={`/${locale}/`}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <svg viewBox="0 0 512 512" fill="none" width="22" height="22">
            <rect width="512" height="512" rx="108" fill="#18181b" />
            <rect x="72" y="72" width="164" height="164" rx="32" style={{ fill: "var(--accent)" }} />
            <rect x="276" y="72" width="164" height="164" rx="32" fill="#3f3f46" />
            <rect x="72" y="276" width="164" height="164" rx="32" fill="#3f3f46" />
            <rect x="276" y="276" width="164" height="164" rx="32" style={{ fill: "var(--accent-deep)" }} />
          </svg>
          <span className="text-text font-bold" style={{ fontSize: 15 }}>
            Notion Widgets
          </span>
        </Link>

        {/* Nav pill */}
        <nav className="hidden sm:flex items-center bg-surface border border-border rounded-full" style={{ padding: 3 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full transition-colors ${
                item.active
                  ? "bg-surface-2 text-text font-semibold"
                  : "text-text-faint hover:text-text-dim"
              }`}
              style={{ fontSize: 13.5, padding: "6px 16px" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="flex items-center gap-1 font-mono" style={{ fontSize: 11 }}>
          {locales.map((loc) => (
            <a
              key={loc}
              href={switchedPath(loc)}
              hrefLang={loc}
              className={`transition-colors ${
                loc === locale
                  ? "text-text font-semibold"
                  : "text-text-faint hover:text-text-dim"
              }`}
            >
              {loc.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
