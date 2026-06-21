// Color math + harmony generation for the Color Palette widget.
// The palette is derived from the chosen accent hue so the accent system
// fully drives the generated colors, while UI chrome uses resolveColors.

export interface Hsl {
  h: number; // 0-360
  s: number; // 0-1
  l: number; // 0-1
}

export interface Swatch {
  hex: string; // "#rrggbb"
  hsl: Hsl;
  /** Readable text color ("#000000" | "#ffffff") for labels drawn on the swatch. */
  textOn: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function hexToHsl(hex: string): Hsl {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = clamp01(s);
  l = clamp01(l);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Relative luminance for picking black/white label text on a swatch. */
function readableText(hsl: Hsl): string {
  const hex = hslToHex(hsl.h, hsl.s, hsl.l).slice(1);
  const ch = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const lum = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  return lum > 0.45 ? "#101010" : "#ffffff";
}

/** Deterministic PRNG (mulberry32) for reproducible daily palettes. */
export function makeRng(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Evenly spaced ramp of `n` values from `lo` to `hi`. */
function ramp(n: number, lo: number, hi: number): number[] {
  if (n <= 1) return [(lo + hi) / 2];
  return Array.from({ length: n }, (_, i) => lo + (hi - lo) * (i / (n - 1)));
}

/**
 * Build a harmonious palette of `count` swatches, seeded by `rng`,
 * rooted at the accent's hue so each accent produces a distinct family.
 */
export function generatePalette(
  base: Hsl,
  harmony: string,
  count: number,
  rng: () => number,
): Swatch[] {
  // Seeded jitter keeps the base lively/daily-varying but accent-anchored.
  const baseH = base.h + (rng() - 0.5) * 36; // ±18°
  const baseS = clamp(base.s || 0.55, 0.46, 0.72);

  const hsls: Hsl[] = [];

  if (harmony === "monochrome") {
    const lights = ramp(count, 0.4, 0.76);
    lights.forEach((l, i) => {
      hsls.push({
        h: baseH + (rng() - 0.5) * 8,
        s: clamp(baseS - i * 0.015 + (rng() - 0.5) * 0.05, 0.4, 0.74),
        l,
      });
    });
  } else if (harmony === "complementary") {
    const lights = ramp(count, 0.42, 0.74);
    const split = Math.ceil(count / 2);
    lights.forEach((l, i) => {
      const anchor = i < split ? baseH : baseH + 180;
      hsls.push({
        h: anchor + (rng() - 0.5) * 16,
        s: clamp(baseS + (rng() - 0.5) * 0.08, 0.44, 0.74),
        l,
      });
    });
  } else if (harmony === "triad") {
    const anchors = [baseH, baseH + 120, baseH + 240];
    const lights = ramp(count, 0.44, 0.72);
    lights.forEach((l, i) => {
      hsls.push({
        h: anchors[i % 3] + (rng() - 0.5) * 14,
        s: clamp(baseS + (rng() - 0.5) * 0.08, 0.46, 0.74),
        l,
      });
    });
  } else {
    // analogous (default)
    const step = 22;
    const lights = ramp(count, 0.46, 0.7);
    lights.forEach((l, i) => {
      const offset = (i - (count - 1) / 2) * step;
      hsls.push({
        h: baseH + offset + (rng() - 0.5) * 6,
        s: clamp(baseS + (rng() - 0.5) * 0.06, 0.46, 0.72),
        l,
      });
    });
  }

  return hsls.map((hsl) => ({
    hsl,
    hex: hslToHex(hsl.h, hsl.s, hsl.l),
    textOn: readableText(hsl),
  }));
}

/** Simple stable hash so different accents diverge on the same day. */
export function strHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}
