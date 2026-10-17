/** Minimal per-locale strings for the Counter widget. */
interface CounterStrings {
  reset: string;
  /** Fallback labels for the multi variant when the user hasn't set any. */
  fallback: [string, string, string];
}

const STRINGS: Record<string, CounterStrings> = {
  en: { reset: "Reset", fallback: ["A", "B", "C"] },
  ko: { reset: "초기화", fallback: ["A", "B", "C"] },
  ja: { reset: "リセット", fallback: ["A", "B", "C"] },
  zh: { reset: "重置", fallback: ["A", "B", "C"] },
  de: { reset: "Zurücksetzen", fallback: ["A", "B", "C"] },
  fr: { reset: "Réinitialiser", fallback: ["A", "B", "C"] },
  es: { reset: "Reiniciar", fallback: ["A", "B", "C"] },
};

export function getCounterStrings(locale: string): CounterStrings {
  const lang = (locale || "en").slice(0, 2).toLowerCase();
  return STRINGS[lang] ?? STRINGS.en;
}
