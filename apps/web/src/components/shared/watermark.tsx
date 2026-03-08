"use client";

import { useSearchParams } from "next/navigation";

export function Watermark() {
  const searchParams = useSearchParams();
  const color = searchParams.get("color") || "ffffff";

  return (
    <div
      className="fixed bottom-1.5 right-2 pointer-events-none"
      aria-hidden="true"
    >
      <a
        href="https://widgets.doriri.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto text-[10px] transition-opacity hover:opacity-40"
        style={{ color: `#${color}`, opacity: 0.2 }}
      >
        Made with doriri
      </a>
    </div>
  );
}
