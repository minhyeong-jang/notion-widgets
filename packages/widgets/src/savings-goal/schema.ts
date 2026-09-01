import { z } from "zod";

export const savingsGoalSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["jar", "coins", "card"]).default("jar"),
  label: z.string().default("Savings"),
  currency: z.string().default("USD"),
  goal: z.coerce.number().min(1).default(1000),
  deposit: z.coerce.number().min(1).default(50),
  period: z.enum(["persist", "weekly", "daily"]).default("persist"),
});

export type SavingsGoalParams = z.infer<typeof savingsGoalSchema>;

export const savingsGoalDefaults: SavingsGoalParams = savingsGoalSchema.parse({});

/** Extract a compact currency symbol (e.g. "$", "₩", "€") for coin faces. */
export function currencySymbol(currency: string, locale: string): string {
  const code = (currency || "USD").trim().toUpperCase();
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    const raw = parts.find((p) => p.type === "currency")?.value ?? "$";
    // Some locales render "US$" / "CA$" — keep just the symbol glyph.
    const glyph = raw.replace(/[A-Za-z]/g, "").trim();
    return glyph || raw[0] || "$";
  } catch {
    return "$";
  }
}

/** Format an amount as currency, falling back gracefully for odd currency codes. */
export function formatMoney(amount: number, currency: string, locale: string): string {
  const code = (currency || "USD").trim().toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${Math.round(amount).toLocaleString(locale)}`;
  }
}
