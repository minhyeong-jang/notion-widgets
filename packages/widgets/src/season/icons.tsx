import type { SeasonKey } from "./season";

interface IconProps {
  size?: number;
  color: string;
  /** Extra filter (e.g. neon glow). */
  glow?: string;
  strokeWidth?: number;
}

/**
 * Stroke-based seasonal glyphs (24×24 viewBox). Color comes from the accent so
 * the icons stay on-theme in every style — we never hardcode a season color.
 */
export function SeasonIcon({
  season,
  size = 24,
  color,
  glow,
  strokeWidth = 1.9,
}: IconProps & { season: SeasonKey }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: glow ? { filter: glow } : undefined,
  };

  if (season === "summer") {
    // Sun
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="4.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 12 + Math.cos(rad) * 7.4;
          const y1 = 12 + Math.sin(rad) * 7.4;
          const x2 = 12 + Math.cos(rad) * 9.6;
          const y2 = 12 + Math.sin(rad) * 9.6;
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </svg>
    );
  }

  if (season === "autumn") {
    // Leaf
    return (
      <svg {...common} aria-hidden>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    );
  }

  if (season === "winter") {
    // Snowflake
    return (
      <svg {...common} aria-hidden>
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="m20 16-4-4 4-4" />
        <path d="m4 8 4 4-4 4" />
        <path d="m16 4-4 4-4-4" />
        <path d="m8 20 4-4 4 4" />
      </svg>
    );
  }

  // Spring — flower
  return (
    <svg {...common} aria-hidden>
      <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1" />
      <circle cx="12" cy="8" r="2" />
      <path d="M12 10v12" />
      <path d="M12 22c4.2 0 7-1.67 7-5-4.2 0-7 1.67-7 5Z" />
      <path d="M12 22c-4.2 0-7-1.67-7-5 4.2 0 7 1.67 7 5Z" />
    </svg>
  );
}
