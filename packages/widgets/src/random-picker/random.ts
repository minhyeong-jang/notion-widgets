/**
 * Deterministic RNG + helpers for the Random Picker widget.
 *
 * The widget renders on the server first, so the *initial* result must be
 * deterministic to avoid hydration mismatches. We derive a daily seed for the
 * first paint and re-seed with Math.random() after mount (random mode) or on
 * every tap — exactly the pattern used by the Color Palette widget.
 */

/** mulberry32 — small, fast, seedable PRNG. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a string hash → unsigned 32-bit int. */
export function strHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Day-of-year (1–366) for a stable "decision of the day". */
export function dayOfYear(d: Date = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export type Sentiment = "yes" | "no" | "maybe";

export interface Answer {
  text: string;
  sentiment: Sentiment;
}

/** Magic 8-ball style oracle answers, per language. */
const ANSWERS: Record<"en" | "ko", Answer[]> = {
  en: [
    { text: "It is certain", sentiment: "yes" },
    { text: "Without a doubt", sentiment: "yes" },
    { text: "Yes — definitely", sentiment: "yes" },
    { text: "You may rely on it", sentiment: "yes" },
    { text: "Most likely", sentiment: "yes" },
    { text: "Signs point to yes", sentiment: "yes" },
    { text: "Reply hazy, try again", sentiment: "maybe" },
    { text: "Ask again later", sentiment: "maybe" },
    { text: "Better not tell you now", sentiment: "maybe" },
    { text: "Cannot predict now", sentiment: "maybe" },
    { text: "Concentrate and ask again", sentiment: "maybe" },
    { text: "Don't count on it", sentiment: "no" },
    { text: "My reply is no", sentiment: "no" },
    { text: "Very doubtful", sentiment: "no" },
    { text: "Outlook not so good", sentiment: "no" },
  ],
  ko: [
    { text: "확실해요", sentiment: "yes" },
    { text: "의심의 여지 없어요", sentiment: "yes" },
    { text: "네 — 물론이죠", sentiment: "yes" },
    { text: "믿어도 좋아요", sentiment: "yes" },
    { text: "그럴 가능성이 높아요", sentiment: "yes" },
    { text: "좋은 징조예요", sentiment: "yes" },
    { text: "잘 모르겠어요, 다시 물어보세요", sentiment: "maybe" },
    { text: "나중에 다시 물어보세요", sentiment: "maybe" },
    { text: "지금은 말하기 어려워요", sentiment: "maybe" },
    { text: "지금은 예측할 수 없어요", sentiment: "maybe" },
    { text: "집중하고 다시 물어보세요", sentiment: "maybe" },
    { text: "기대하지 마세요", sentiment: "no" },
    { text: "제 대답은 아니오예요", sentiment: "no" },
    { text: "매우 의심스러워요", sentiment: "no" },
    { text: "전망이 좋지 않아요", sentiment: "no" },
  ],
};

export interface PickerStrings {
  answers: Answer[];
  heads: string;
  tails: string;
  coin: string;
  dice: string;
  oracle: string;
  picked: string;
  tapToRoll: string;
  rolling: string;
}

const STRINGS: Record<"en" | "ko", Omit<PickerStrings, "answers">> = {
  en: {
    heads: "HEADS",
    tails: "TAILS",
    coin: "Coin Flip",
    dice: "Dice Roll",
    oracle: "Magic Answer",
    picked: "Picked for you",
    tapToRoll: "Tap to roll again",
    rolling: "Rolling…",
  },
  ko: {
    heads: "앞면",
    tails: "뒷면",
    coin: "동전 던지기",
    dice: "주사위",
    oracle: "마법의 대답",
    picked: "당신을 위한 선택",
    tapToRoll: "탭하면 다시 굴려요",
    rolling: "굴리는 중…",
  },
};

/** Resolve a BCP-47 locale to our supported string pack (en fallback). */
export function getStrings(locale: string): PickerStrings {
  const lang = locale.toLowerCase().startsWith("ko") ? "ko" : "en";
  return { ...STRINGS[lang], answers: ANSWERS[lang] };
}

/** Split a comma-separated options string into a clean, deduped list. */
export function parseOptions(raw: string): string[] {
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : ["Yes", "No"];
}
