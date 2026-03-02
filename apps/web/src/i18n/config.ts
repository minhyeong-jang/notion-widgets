export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
