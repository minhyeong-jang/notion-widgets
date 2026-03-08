import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/ko";

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  ko: () => import("./dictionaries/ko"),
  en: () => import("./dictionaries/en"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.ko;
  const mod = await loader();
  return mod.default;
}

export type { Dictionary } from "./dictionaries/ko";
