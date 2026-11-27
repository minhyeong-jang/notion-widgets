// Deterministic generative geometry for the Mandala widget.
// Every curve is pure math on a 200×200 viewBox centered at (100,100),
// so the same params always render the same art — no randomness, no state.

export type MandalaVariant = "rose" | "spiro" | "star" | "web";
export type Complexity = "low" | "med" | "high";

/** A single stroked path plus which accent shade / weight to draw it with. */
export interface MandalaLayer {
  d: string;
  shade: "bright" | "base" | "deep" | "dim";
  width: number;
  opacity: number;
}

const C = 100; // center
const RMAX = 86; // outer radius

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function polyToPath(pts: Array<[number, number]>, closed = true): string {
  let d = "";
  pts.forEach((p, i) => {
    d += `${i === 0 ? "M" : "L"}${p[0].toFixed(2)} ${p[1].toFixed(2)} `;
  });
  return closed ? `${d}Z` : d.trim();
}

// --- rose / rhodonea: r = R·cos(kθ) ------------------------------------
function rose(k: number, R: number, phase = 0, steps = 1440): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = R * Math.cos(k * t);
    pts.push([C + r * Math.cos(t + phase), C + r * Math.sin(t + phase)]);
  }
  return polyToPath(pts, true);
}

// --- hypotrochoid (spirograph) -----------------------------------------
function hypotrochoid(bigR: number, r: number, d: number): string {
  const turns = r / gcd(bigR, r);
  const steps = Math.ceil(turns) * 360;
  const maxR = bigR - r + d;
  const scale = RMAX / maxR;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = (bigR - r) * Math.cos(t) + d * Math.cos(((bigR - r) / r) * t);
    const y = (bigR - r) * Math.sin(t) - d * Math.sin(((bigR - r) / r) * t);
    pts.push([C + x * scale, C + y * scale]);
  }
  return polyToPath(pts, true);
}

// --- star polygon {n/m} -------------------------------------------------
function starPolygon(n: number, m: number, R: number, rot = 0): string {
  const pts: Array<[number, number]> = [];
  let idx = 0;
  for (let i = 0; i <= n; i++) {
    const ang = (idx / n) * Math.PI * 2 - Math.PI / 2 + rot;
    pts.push([C + R * Math.cos(ang), C + R * Math.sin(ang)]);
    idx = (idx + m) % n;
  }
  return polyToPath(pts, false);
}

function polygon(n: number, R: number, rot = 0): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2 + rot;
    pts.push([C + R * Math.cos(ang), C + R * Math.sin(ang)]);
  }
  return polyToPath(pts, true);
}

function spokes(n: number, rInner: number, rOuter: number, rot = 0): string {
  let d = "";
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2 + rot;
    const x1 = C + rInner * Math.cos(ang);
    const y1 = C + rInner * Math.sin(ang);
    const x2 = C + rOuter * Math.cos(ang);
    const y2 = C + rOuter * Math.sin(ang);
    d += `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} `;
  }
  return d.trim();
}

function circle(R: number): string {
  return `M${C - R} ${C} a${R} ${R} 0 1 0 ${R * 2} 0 a${R} ${R} 0 1 0 ${-R * 2} 0`;
}

// --- config per variant / complexity -----------------------------------
const ROSE_K: Record<Complexity, number> = { low: 3, med: 5, high: 7 };
const SPIRO: Record<Complexity, [number, number, number]> = {
  low: [5, 3, 5],
  med: [7, 3, 4],
  high: [9, 4, 6],
};
const STAR: Record<Complexity, [number, number]> = {
  low: [8, 3],
  med: [12, 5],
  high: [16, 7],
};
const WEB_N: Record<Complexity, number> = { low: 6, med: 9, high: 12 };

export function buildMandala(
  variant: MandalaVariant,
  complexity: Complexity,
): MandalaLayer[] {
  switch (variant) {
    case "rose": {
      const k = ROSE_K[complexity];
      return [
        { d: circle(RMAX), shade: "dim", width: 0.6, opacity: 0.35 },
        { d: rose(k, RMAX, Math.PI / (2 * k)), shade: "dim", width: 0.8, opacity: 0.5 },
        { d: rose(k, RMAX), shade: "base", width: 1.1, opacity: 0.95 },
        { d: rose(k, RMAX * 0.62), shade: "bright", width: 1, opacity: 0.8 },
        { d: rose(k, RMAX * 0.3), shade: "deep", width: 0.9, opacity: 0.65 },
      ];
    }
    case "spiro": {
      const [R, r, d] = SPIRO[complexity];
      return [
        { d: circle(RMAX), shade: "dim", width: 0.6, opacity: 0.3 },
        { d: hypotrochoid(R, r, d), shade: "base", width: 1, opacity: 0.95 },
        { d: hypotrochoid(R, r, d * 0.55), shade: "bright", width: 0.9, opacity: 0.7 },
      ];
    }
    case "star": {
      const [n, m] = STAR[complexity];
      return [
        { d: circle(RMAX), shade: "dim", width: 0.6, opacity: 0.3 },
        { d: starPolygon(n, m, RMAX), shade: "base", width: 1.1, opacity: 0.95 },
        { d: starPolygon(n, m, RMAX * 0.82, Math.PI / n), shade: "bright", width: 0.9, opacity: 0.72 },
        { d: starPolygon(n, m, RMAX * 0.5), shade: "deep", width: 0.9, opacity: 0.6 },
      ];
    }
    case "web":
    default: {
      const n = WEB_N[complexity];
      return [
        { d: circle(RMAX), shade: "dim", width: 0.6, opacity: 0.4 },
        { d: spokes(n, 0, RMAX, 0), shade: "dim", width: 0.6, opacity: 0.4 },
        { d: polygon(n, RMAX), shade: "base", width: 1.1, opacity: 0.95 },
        { d: polygon(n, RMAX * 0.68, Math.PI / n), shade: "bright", width: 1, opacity: 0.8 },
        { d: polygon(n, RMAX * 0.38), shade: "deep", width: 0.9, opacity: 0.7 },
      ];
    }
  }
}
