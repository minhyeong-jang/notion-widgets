import Link from "next/link";

export function Watermark() {
  return (
    <div
      className="fixed bottom-2 right-2 pointer-events-none"
      aria-hidden="true"
    >
      <Link
        href="/"
        className="pointer-events-auto text-white/30 text-xs hover:text-white/50 transition-colors"
      >
        Made with NW
      </Link>
    </div>
  );
}
