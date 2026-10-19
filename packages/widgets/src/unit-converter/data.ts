export type CategoryId = "length" | "weight" | "temperature" | "volume";

export interface UnitDef {
  id: string;
  /** Short symbol shown in the UI, e.g. "km", "°C". */
  symbol: string;
  /** Multiplier to the category base unit (ignored for temperature). */
  factor: number;
}

export interface CategoryDef {
  id: CategoryId;
  nameEn: string;
  nameKo: string;
  units: UnitDef[];
}

/** Linear categories convert via a shared base unit (factor). */
export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  length: {
    id: "length",
    nameEn: "Length",
    nameKo: "길이",
    units: [
      { id: "km", symbol: "km", factor: 1000 },
      { id: "m", symbol: "m", factor: 1 },
      { id: "cm", symbol: "cm", factor: 0.01 },
      { id: "mi", symbol: "mi", factor: 1609.344 },
      { id: "ft", symbol: "ft", factor: 0.3048 },
      { id: "in", symbol: "in", factor: 0.0254 },
    ],
  },
  weight: {
    id: "weight",
    nameEn: "Weight",
    nameKo: "무게",
    units: [
      { id: "kg", symbol: "kg", factor: 1000 },
      { id: "g", symbol: "g", factor: 1 },
      { id: "lb", symbol: "lb", factor: 453.59237 },
      { id: "oz", symbol: "oz", factor: 28.349523 },
    ],
  },
  temperature: {
    id: "temperature",
    nameEn: "Temp",
    nameKo: "온도",
    units: [
      { id: "c", symbol: "°C", factor: 1 },
      { id: "f", symbol: "°F", factor: 1 },
      { id: "k", symbol: "K", factor: 1 },
    ],
  },
  volume: {
    id: "volume",
    nameEn: "Volume",
    nameKo: "부피",
    units: [
      { id: "l", symbol: "L", factor: 1 },
      { id: "ml", symbol: "mL", factor: 0.001 },
      { id: "gal", symbol: "gal", factor: 3.785411784 },
      { id: "cup", symbol: "cup", factor: 0.2365882365 },
    ],
  },
};

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export function getUnit(category: CategoryId, id: string): UnitDef | undefined {
  return CATEGORIES[category].units.find((u) => u.id === id);
}

function toCelsius(value: number, unit: string): number {
  if (unit === "f") return (value - 32) * (5 / 9);
  if (unit === "k") return value - 273.15;
  return value;
}

function fromCelsius(c: number, unit: string): number {
  if (unit === "f") return c * (9 / 5) + 32;
  if (unit === "k") return c + 273.15;
  return c;
}

/** Convert `value` from one unit to another within a category. */
export function convert(
  category: CategoryId,
  value: number,
  from: string,
  to: string,
): number {
  if (category === "temperature") {
    return fromCelsius(toCelsius(value, from), to);
  }
  const f = getUnit(category, from);
  const t = getUnit(category, to);
  if (!f || !t) return value;
  return (value * f.factor) / t.factor;
}

/** Format a number compactly: trims trailing zeros, caps significant digits. */
export function formatResult(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  let out: string;
  if (abs >= 1e9 || abs < 1e-4) {
    out = n.toExponential(3);
  } else {
    // Up to 6 significant figures, then strip trailing zeros.
    const digits = Math.max(0, 6 - Math.floor(Math.log10(abs)) - 1);
    out = n.toFixed(Math.min(6, digits));
    if (out.includes(".")) out = out.replace(/\.?0+$/, "");
  }
  return out;
}
