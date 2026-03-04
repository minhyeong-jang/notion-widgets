export interface Tip {
  text: { en: string; ko: string };
  category: "productivity" | "mindset" | "tech" | "life";
}

export const tips: Tip[] = [
  // Productivity
  {
    text: {
      en: "Start your day with the hardest task. Willpower is highest in the morning.",
      ko: "하루를 가장 어려운 작업으로 시작하라. 의지력은 아침에 가장 높다.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Use the 2-minute rule: if it takes less than 2 minutes, do it now.",
      ko: "2분 규칙을 활용하라: 2분 이내에 끝나는 일은 지금 바로 하라.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Batch similar tasks together to reduce context switching.",
      ko: "비슷한 작업을 묶어서 처리하면 컨텍스트 전환을 줄일 수 있다.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Plan tomorrow tonight. You'll start the day with clarity.",
      ko: "오늘 밤에 내일을 계획하라. 명확한 상태로 하루를 시작할 수 있다.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Take a 5-minute break every 25 minutes (Pomodoro Technique).",
      ko: "25분마다 5분 휴식을 취하라 (포모도로 기법).",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Say no to meetings without an agenda. Protect your deep work time.",
      ko: "안건 없는 회의는 거절하라. 딥 워크 시간을 보호하라.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Use time-blocking to allocate specific hours for specific tasks.",
      ko: "시간 블로킹으로 특정 시간에 특정 작업을 배정하라.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Write things down. Your brain is for having ideas, not holding them.",
      ko: "기록하라. 뇌는 아이디어를 떠올리기 위한 것이지, 저장하기 위한 것이 아니다.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Limit work-in-progress. Focus on finishing before starting something new.",
      ko: "진행 중인 작업을 제한하라. 새로운 것을 시작하기 전에 끝내는 데 집중하라.",
    },
    category: "productivity",
  },
  {
    text: {
      en: "Review your goals weekly. Adjust, don't abandon.",
      ko: "매주 목표를 점검하라. 포기하지 말고 조정하라.",
    },
    category: "productivity",
  },

  // Mindset
  {
    text: {
      en: "Progress, not perfection. Done is better than perfect.",
      ko: "완벽이 아닌 진보. 완성이 완벽보다 낫다.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Reframe failure as data. Every mistake teaches something.",
      ko: "실패를 데이터로 재정의하라. 모든 실수는 무언가를 가르친다.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Compare yourself only to who you were yesterday.",
      ko: "어제의 나와만 비교하라.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Embrace discomfort. Growth happens at the edge of your comfort zone.",
      ko: "불편함을 받아들여라. 성장은 안전지대의 경계에서 일어난다.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Celebrate small wins. They compound into big achievements.",
      ko: "작은 성공을 축하하라. 그것들이 모여 큰 성취가 된다.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Your thoughts shape your reality. Choose them wisely.",
      ko: "생각이 현실을 만든다. 현명하게 선택하라.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Consistency beats intensity. Show up every day.",
      ko: "일관성이 강도를 이긴다. 매일 나타나라.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Gratitude turns what you have into enough.",
      ko: "감사는 가진 것을 충분한 것으로 바꿔준다.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Focus on the process, not the outcome. Trust the system.",
      ko: "결과가 아닌 과정에 집중하라. 시스템을 믿어라.",
    },
    category: "mindset",
  },
  {
    text: {
      en: "Rest is productive. You can't pour from an empty cup.",
      ko: "휴식은 생산적이다. 빈 컵에서는 따를 수 없다.",
    },
    category: "mindset",
  },

  // Tech
  {
    text: {
      en: "Learn keyboard shortcuts for your most-used tools. Minutes saved daily compound.",
      ko: "가장 많이 쓰는 도구의 키보드 단축키를 배워라. 매일 아끼는 분이 복리로 쌓인다.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Automate repetitive tasks. If you do it 3+ times, script it.",
      ko: "반복 작업을 자동화하라. 3번 이상 하면 스크립트로 만들어라.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Read documentation before Stack Overflow. It's usually faster.",
      ko: "Stack Overflow 전에 공식 문서를 읽어라. 보통 더 빠르다.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Write code for the next developer (it might be future you).",
      ko: "다음 개발자를 위해 코드를 작성하라 (미래의 당신일 수 있다).",
    },
    category: "tech",
  },
  {
    text: {
      en: "Version control everything. Commit early, commit often.",
      ko: "모든 것을 버전 관리하라. 일찍, 자주 커밋하라.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Use focus mode on your devices. Notifications are productivity killers.",
      ko: "기기의 집중 모드를 활용하라. 알림은 생산성의 적이다.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Master your terminal. CLI tools are often faster than GUI.",
      ko: "터미널을 마스터하라. CLI 도구가 GUI보다 빠른 경우가 많다.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Keep a code snippet library. Don't solve the same problem twice.",
      ko: "코드 스니펫 라이브러리를 유지하라. 같은 문제를 두 번 풀지 마라.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Use dark mode at night. Your eyes will thank you.",
      ko: "밤에는 다크 모드를 사용하라. 눈이 감사할 것이다.",
    },
    category: "tech",
  },
  {
    text: {
      en: "Back up your work. The question isn't if you'll lose data, but when.",
      ko: "작업을 백업하라. 데이터를 잃을지가 아니라 언제 잃을지의 문제다.",
    },
    category: "tech",
  },

  // Life
  {
    text: {
      en: "Drink water first thing in the morning. Your body is dehydrated after sleep.",
      ko: "아침에 가장 먼저 물을 마셔라. 수면 후 몸은 탈수 상태이다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Take a walk after lunch. Movement aids digestion and creativity.",
      ko: "점심 후 산책하라. 움직임은 소화와 창의력에 도움이 된다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Read for 20 minutes before bed instead of scrolling your phone.",
      ko: "잠들기 전 휴대폰 대신 20분 독서를 하라.",
    },
    category: "life",
  },
  {
    text: {
      en: "Practice the 20-20-20 rule: every 20 min, look 20 feet away for 20 seconds.",
      ko: "20-20-20 규칙을 실천하라: 20분마다 20피트 떨어진 곳을 20초간 바라보라.",
    },
    category: "life",
  },
  {
    text: {
      en: "Spend time in nature weekly. It reduces stress and boosts mood.",
      ko: "매주 자연에서 시간을 보내라. 스트레스를 줄이고 기분을 높여준다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Invest in experiences over things. Memories last longer than objects.",
      ko: "물건보다 경험에 투자하라. 추억은 물건보다 오래 간다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Learn to cook one new dish per month. It's creative, healthy, and saves money.",
      ko: "매달 새로운 요리 하나를 배워라. 창의적이고 건강하며 돈도 절약된다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Keep a journal. Writing clarifies thinking and tracks growth.",
      ko: "일기를 쓰라. 글쓰기는 생각을 정리하고 성장을 추적한다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Declutter one area of your space today. External order creates internal calm.",
      ko: "오늘 공간 한 곳을 정리하라. 외부 질서가 내면의 평온을 만든다.",
    },
    category: "life",
  },
  {
    text: {
      en: "Call someone you care about. Real connection beats digital likes.",
      ko: "소중한 사람에게 전화하라. 진짜 연결은 디지털 좋아요보다 낫다.",
    },
    category: "life",
  },
];

export function getTipsByCategory(category: string): Tip[] {
  if (category === "all") return tips;
  return tips.filter(t => t.category === category);
}
