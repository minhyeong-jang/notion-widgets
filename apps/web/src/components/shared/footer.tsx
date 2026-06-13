"use client";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-soft)",
        padding: "36px 0",
        marginTop: 30,
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: 1080, padding: "0 32px" }}
      >
        {/* Left: Logo + name */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 512 512" fill="none" width="18" height="18">
            <rect width="512" height="512" rx="108" fill="#18181b" />
            <rect x="72" y="72" width="164" height="164" rx="32" style={{ fill: "var(--accent)" }} />
            <rect x="276" y="72" width="164" height="164" rx="32" fill="#3f3f46" />
            <rect x="72" y="276" width="164" height="164" rx="32" fill="#3f3f46" />
            <rect x="276" y="276" width="164" height="164" rx="32" style={{ fill: "var(--accent-deep)" }} />
          </svg>
          <span className="text-text-dim font-medium" style={{ fontSize: 14 }}>
            Notion Widgets
          </span>
        </div>

        {/* Right: link + credit */}
        <div className="flex items-center gap-3">
          <a
            href="https://widgets.doriri.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dim hover:text-text transition-colors"
            style={{ fontSize: 13 }}
          >
            widgets.doriri.dev
          </a>
          <span className="text-text-faint font-mono" style={{ fontSize: 12 }}>
            made by doriri
          </span>
        </div>
      </div>
    </footer>
  );
}
