export function Watermark() {
  return (
    <div
      className="fixed bottom-1.5 right-2 pointer-events-none"
      aria-hidden="true"
    >
      <a
        href="https://widgets.doriri.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto text-white/20 text-[10px] hover:text-white/40 transition-colors"
      >
        Made with doriri
      </a>
    </div>
  );
}
