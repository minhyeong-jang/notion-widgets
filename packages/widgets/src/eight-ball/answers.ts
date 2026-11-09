/**
 * Classic Magic 8-Ball oracle answers (20), tagged by tone.
 * English + Korean are fully localized; other locales fall back to English.
 */

export type Tone = "yes" | "maybe" | "no";

export interface Answer {
  text: string;
  tone: Tone;
}

const EN: Answer[] = [
  { text: "It is certain", tone: "yes" },
  { text: "It is decidedly so", tone: "yes" },
  { text: "Without a doubt", tone: "yes" },
  { text: "Yes, definitely", tone: "yes" },
  { text: "You may rely on it", tone: "yes" },
  { text: "As I see it, yes", tone: "yes" },
  { text: "Most likely", tone: "yes" },
  { text: "Outlook good", tone: "yes" },
  { text: "Yes", tone: "yes" },
  { text: "Signs point to yes", tone: "yes" },
  { text: "Reply hazy, try again", tone: "maybe" },
  { text: "Ask again later", tone: "maybe" },
  { text: "Better not tell you now", tone: "maybe" },
  { text: "Cannot predict now", tone: "maybe" },
  { text: "Concentrate and ask again", tone: "maybe" },
  { text: "Don't count on it", tone: "no" },
  { text: "My reply is no", tone: "no" },
  { text: "My sources say no", tone: "no" },
  { text: "Outlook not so good", tone: "no" },
  { text: "Very doubtful", tone: "no" },
];

const KO: Answer[] = [
  { text: "확실해요", tone: "yes" },
  { text: "틀림없어요", tone: "yes" },
  { text: "의심할 여지가 없어요", tone: "yes" },
  { text: "네, 분명해요", tone: "yes" },
  { text: "믿어도 좋아요", tone: "yes" },
  { text: "제가 보기엔 그래요", tone: "yes" },
  { text: "그럴 가능성이 높아요", tone: "yes" },
  { text: "전망이 밝아요", tone: "yes" },
  { text: "네", tone: "yes" },
  { text: "긍정적인 신호예요", tone: "yes" },
  { text: "흐릿하네요, 다시 물어봐요", tone: "maybe" },
  { text: "나중에 다시 물어봐요", tone: "maybe" },
  { text: "지금은 말 안 할래요", tone: "maybe" },
  { text: "지금은 예측할 수 없어요", tone: "maybe" },
  { text: "집중해서 다시 물어봐요", tone: "maybe" },
  { text: "기대하지 마세요", tone: "no" },
  { text: "제 대답은 아니오예요", tone: "no" },
  { text: "아닌 것 같아요", tone: "no" },
  { text: "전망이 좋지 않아요", tone: "no" },
  { text: "매우 의심스러워요", tone: "no" },
];

const ANSWERS: Record<string, Answer[]> = {
  "en-US": EN,
  "ko-KR": KO,
};

export function getAnswers(locale: string): Answer[] {
  return ANSWERS[locale] ?? EN;
}

/** Deterministic answer for the current day — keeps SSR and first paint in sync. */
export function getDailyAnswer(answers: Answer[]): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / 86400000,
  );
  return dayOfYear % answers.length;
}

interface EightBallStrings {
  title: string;
  ask: string;
  tones: Record<Tone, string>;
}

const STRINGS: Record<string, EightBallStrings> = {
  "ko-KR": {
    title: "매직 8볼",
    ask: "다시 물어보기",
    tones: { yes: "예", maybe: "글쎄", no: "아니오" },
  },
  "ja-JP": {
    title: "マジック8ボール",
    ask: "もう一度",
    tones: { yes: "はい", maybe: "たぶん", no: "いいえ" },
  },
  "zh-CN": {
    title: "神奇8号球",
    ask: "再问一次",
    tones: { yes: "是", maybe: "也许", no: "否" },
  },
};

const DEFAULT_STRINGS: EightBallStrings = {
  title: "Magic 8-Ball",
  ask: "Ask again",
  tones: { yes: "Yes", maybe: "Maybe", no: "No" },
};

export function getEightBallStrings(locale: string): EightBallStrings {
  return STRINGS[locale] ?? DEFAULT_STRINGS;
}
