"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function switchedPath(targetLocale: Locale): string {
    const withoutLocale = pathname.replace(/^\/(ko|en)/, "");
    return `/${targetLocale}${withoutLocale || "/"}`;
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Globe className="w-4 h-4 text-zinc-500" />
      {locales.map((loc) => (
        <a
          key={loc}
          href={switchedPath(loc)}
          hrefLang={loc}
          className={`px-2 py-1 rounded transition-colors ${
            loc === currentLocale
              ? "text-zinc-100 bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {loc === "ko" ? "\ud55c\uad6d\uc5b4" : "English"}
        </a>
      ))}
    </div>
  );
}
