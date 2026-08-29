/** Common English words used to build the random typing streams. */
export const COMMON_WORDS: string[] = [
  "the", "and", "for", "you", "that", "with", "this", "have", "from", "they",
  "will", "what", "when", "make", "like", "time", "just", "know", "take", "into",
  "year", "your", "good", "some", "them", "other", "than", "then", "look", "only",
  "come", "over", "think", "also", "back", "after", "work", "first", "well", "way",
  "even", "want", "because", "these", "give", "most", "day", "find", "here", "thing",
  "many", "such", "long", "keep", "same", "seem", "next", "part", "turn", "world",
  "hand", "high", "place", "small", "large", "right", "great", "still", "every", "life",
  "under", "never", "leave", "while", "mean", "start", "open", "walk", "learn", "change",
  "light", "point", "build", "reach", "story", "water", "music", "quiet", "focus", "clear",
  "dream", "smile", "brave", "spark", "grow", "shine", "steady", "gentle", "simple", "bright",
];

/** Short, clean passages for the quote variant (no tricky punctuation). */
export const PASSAGES: string[] = [
  "The quick brown fox jumps over the lazy dog while the sun sets behind the hills.",
  "Small steps every single day add up to something you will be proud of later.",
  "A calm mind and steady hands can turn a hard problem into a simple one.",
  "Focus on the work in front of you and let the rest of the noise fade away.",
  "Good habits are built quietly, one honest day at a time, without any shortcuts.",
  "Type each word with care and speed will follow you all on its own in time.",
  "The best way to predict the future is to build it with your own two hands.",
  "Keep it simple, keep it kind, and keep moving forward even when it feels slow.",
];

/** Deterministic daily passage so server and client render the same text. */
export function getDailyPassage(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return PASSAGES[dayOfYear % PASSAGES.length];
}

/** Build a random word stream of `count` words. */
export function makeWordStream(count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  }
  return out.join(" ");
}

export const WORD_COUNTS: Record<string, number> = { short: 15, medium: 25, long: 40 };

interface TypingStrings {
  hintIdle: string;
  hintFocus: string;
  restart: string;
  wpm: string;
  acc: string;
  time: string;
  done: string;
  live: string;
}

const STRINGS: Record<string, TypingStrings> = {
  en: {
    hintIdle: "Click here and start typing",
    hintFocus: "Start typing to begin",
    restart: "Restart",
    wpm: "WPM",
    acc: "Accuracy",
    time: "Time",
    done: "Nice typing!",
    live: "WPM",
  },
  ko: {
    hintIdle: "여기를 클릭하고 입력을 시작하세요",
    hintFocus: "입력하면 시작됩니다",
    restart: "다시 하기",
    wpm: "타/분",
    acc: "정확도",
    time: "시간",
    done: "잘 쳤어요!",
    live: "타/분",
  },
  ja: {
    hintIdle: "ここをクリックして入力を開始",
    hintFocus: "入力すると開始します",
    restart: "もう一度",
    wpm: "WPM",
    acc: "正確さ",
    time: "時間",
    done: "お見事！",
    live: "WPM",
  },
  zh: {
    hintIdle: "点击这里开始输入",
    hintFocus: "开始输入即可开始",
    restart: "重新开始",
    wpm: "WPM",
    acc: "准确率",
    time: "用时",
    done: "打得不错！",
    live: "WPM",
  },
  de: {
    hintIdle: "Hier klicken und lostippen",
    hintFocus: "Tippe los, um zu starten",
    restart: "Neu starten",
    wpm: "WPM",
    acc: "Genauigkeit",
    time: "Zeit",
    done: "Gut getippt!",
    live: "WPM",
  },
  fr: {
    hintIdle: "Cliquez ici et commencez à taper",
    hintFocus: "Tapez pour commencer",
    restart: "Recommencer",
    wpm: "MPM",
    acc: "Précision",
    time: "Temps",
    done: "Bien joué !",
    live: "MPM",
  },
  es: {
    hintIdle: "Haz clic aquí y empieza a escribir",
    hintFocus: "Escribe para empezar",
    restart: "Reiniciar",
    wpm: "PPM",
    acc: "Precisión",
    time: "Tiempo",
    done: "¡Bien escrito!",
    live: "PPM",
  },
};

export function getTypingStrings(locale: string): TypingStrings {
  return STRINGS[locale.slice(0, 2)] ?? STRINGS.en;
}
