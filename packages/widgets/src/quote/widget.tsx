"use client";

import type { QuoteParams } from "./schema";

interface Quote {
  text: string;
  author: string;
}

const quotesKo: Quote[] = [
  { text: "시작이 반이다.", author: "한국 속담" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
  { text: "꿈을 이루고자 하는 의지가 있는 곳에 길이 있다.", author: "에이브러햄 링컨" },
  { text: "천 리 길도 한 걸음부터.", author: "노자" },
  { text: "배움에는 왕도가 없다.", author: "유클리드" },
  { text: "실패는 성공의 어머니다.", author: "한국 속담" },
  { text: "위대한 일은 작은 일들의 연속이다.", author: "빈센트 반 고흐" },
  { text: "인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다.", author: "알베르트 아인슈타인" },
  { text: "행복은 습관이다. 그것을 몸에 지니라.", author: "허버드" },
  { text: "노력 없이 얻어지는 것은 없다.", author: "한국 속담" },
  { text: "가장 큰 영광은 한 번도 실패하지 않음이 아니라, 실패할 때마다 일어서는 데에 있다.", author: "공자" },
  { text: "현재를 즐겨라. 미래는 아직 오지 않았다.", author: "호라티우스" },
  { text: "작은 기회로부터 종종 위대한 업적이 시작된다.", author: "데모스테네스" },
  { text: "아는 것이 힘이다.", author: "프랜시스 베이컨" },
  { text: "될 때까지 하면 안 될 일이 없다.", author: "정주영" },
  { text: "모든 성취의 출발점은 갈망이다.", author: "나폴레온 힐" },
];

const quotesEn: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
];

function getDailyQuote(quotes: Quote[]): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}

const fontSizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

export function QuoteWidget({ params }: { params: QuoteParams }) {
  const quotes = params.language === "ko" ? quotesKo : quotesEn;
  const quote = getDailyQuote(quotes);

  const bgStyle =
    params.bg === "transparent"
      ? undefined
      : { backgroundColor: "#" + params.bg };

  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${params.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="text-center px-8 max-w-lg mx-auto">
        <div
          className="text-6xl font-serif leading-none mb-4 opacity-30"
          style={{ color: "#" + params.color }}
        >
          &ldquo;
        </div>
        <p
          className={`${fontSizeMap[params.fontSize]} font-medium leading-relaxed text-white/90`}
        >
          {quote.text}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div
            className="w-8 h-px"
            style={{ backgroundColor: "#" + params.color }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "#" + params.color }}
          >
            {quote.author}
          </span>
          <div
            className="w-8 h-px"
            style={{ backgroundColor: "#" + params.color }}
          />
        </div>
      </div>
    </div>
  );
}
