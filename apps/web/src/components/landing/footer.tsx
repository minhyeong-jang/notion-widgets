import { Heart, Github } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

interface FooterProps {
  dict: Dictionary;
  locale: Locale;
}

export function Footer({ dict, locale }: FooterProps) {
  return (
    <footer className="relative px-6 py-12 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-zinc-200 tracking-tight">
            Notion Widgets
          </span>
          <span className="text-zinc-700">|</span>
          <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
            {dict.footer.madeWith.split("love").length > 1 ? (
              <>
                {dict.footer.madeWith.split("love")[0]}
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                {dict.footer.madeWith.split("love")[1]}
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />{" "}
                {dict.footer.madeWith}
              </>
            )}
          </span>
        </div>

        {/* Right: links + language + year */}
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <LanguageSwitcher currentLocale={locale} />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
