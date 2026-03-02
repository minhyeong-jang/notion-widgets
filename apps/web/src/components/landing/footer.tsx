import { Github } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface FooterProps {
  dict: Dictionary;
  locale: Locale;
}

export function Footer({ dict, locale }: FooterProps) {
  return (
    <footer className="relative px-6 py-12 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Top: branding + nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-zinc-200 tracking-tight">
              Notion Widgets
            </span>
            <span className="text-sm text-zinc-500">
              {dict.footer.madeWith}
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6 text-sm text-zinc-500">
            <a
              href={`/${locale}/`}
              className="hover:text-zinc-300 transition-colors"
            >
              {dict.common.home}
            </a>
            <a
              href={`/${locale}/widgets/`}
              className="hover:text-zinc-300 transition-colors"
            >
              {dict.common.widgets}
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>
        </div>

        {/* Bottom: copyright */}
        <div className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Notion Widgets
        </div>
      </div>
    </footer>
  );
}
