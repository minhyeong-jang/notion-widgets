export interface Principle {
  name: { en: string; ko: string };
  explanation: { en: string; ko: string };
  source: string;
  category: "startup" | "growth" | "mindset";
}

export const principles: Principle[] = [
  {
    name: { en: "80/20 Rule", ko: "80/20 법칙" },
    explanation: {
      en: "80% of results come from 20% of efforts. Focus on the vital few.",
      ko: "결과의 80%는 노력의 20%에서 나온다. 핵심 소수에 집중하라.",
    },
    source: "Vilfredo Pareto",
    category: "startup",
  },
  {
    name: { en: "KISS Principle", ko: "KISS 원칙" },
    explanation: {
      en: "Keep It Simple, Stupid. Simplicity should be a key goal in design.",
      ko: "단순하게 유지하라. 단순함이 설계의 핵심 목표가 되어야 한다.",
    },
    source: "Kelly Johnson, Lockheed",
    category: "startup",
  },
  {
    name: { en: "First Principles Thinking", ko: "제1원리 사고" },
    explanation: {
      en: "Break down problems to their most fundamental truths, then reason up.",
      ko: "문제를 가장 근본적인 진실로 분해한 후 다시 추론하라.",
    },
    source: "Elon Musk / Aristotle",
    category: "mindset",
  },
  {
    name: { en: "Lean Startup", ko: "린 스타트업" },
    explanation: {
      en: "Build-Measure-Learn. Launch an MVP fast, get feedback, iterate.",
      ko: "만들고-측정하고-배우라. MVP를 빠르게 출시하고 피드백을 받아 반복하라.",
    },
    source: "Eric Ries",
    category: "startup",
  },
  {
    name: { en: "Growth Mindset", ko: "성장 마인드셋" },
    explanation: {
      en: "Abilities can be developed through dedication and hard work.",
      ko: "능력은 헌신과 노력을 통해 개발될 수 있다.",
    },
    source: "Carol Dweck",
    category: "mindset",
  },
  {
    name: { en: "Product-Market Fit", ko: "프로덕트-마켓 핏" },
    explanation: {
      en: "Build something people actually want before scaling anything.",
      ko: "스케일링 전에 사람들이 실제로 원하는 것을 만들어라.",
    },
    source: "Marc Andreessen",
    category: "startup",
  },
  {
    name: { en: "Compound Effect", ko: "복리 효과" },
    explanation: {
      en: "Small, consistent actions compound into massive results over time.",
      ko: "작고 일관된 행동이 시간이 지나면 엄청난 결과로 복리 성장한다.",
    },
    source: "Darren Hardy",
    category: "growth",
  },
  {
    name: { en: "Ikigai", ko: "이키가이" },
    explanation: {
      en: "Find the intersection of what you love, what you're good at, what pays, and what the world needs.",
      ko: "좋아하는 것, 잘하는 것, 돈이 되는 것, 세상이 필요로 하는 것의 교차점을 찾아라.",
    },
    source: "Japanese Philosophy",
    category: "mindset",
  },
  {
    name: { en: "Network Effects", ko: "네트워크 효과" },
    explanation: {
      en: "A product becomes more valuable as more people use it.",
      ko: "더 많은 사람이 사용할수록 제품의 가치가 높아진다.",
    },
    source: "Robert Metcalfe",
    category: "growth",
  },
  {
    name: { en: "Jobs To Be Done", ko: "해결할 과제" },
    explanation: {
      en: "Customers hire products to get a job done. Understand the job, not the customer.",
      ko: "고객은 해야 할 일을 위해 제품을 고용한다. 고객이 아닌 과제를 이해하라.",
    },
    source: "Clayton Christensen",
    category: "startup",
  },
  {
    name: { en: "10x Thinking", ko: "10배 사고" },
    explanation: {
      en: "Aim for 10x improvement, not 10%. It forces fundamentally different approaches.",
      ko: "10%가 아닌 10배 개선을 목표로 하라. 근본적으로 다른 접근이 필요해진다.",
    },
    source: "Google / Astro Teller",
    category: "mindset",
  },
  {
    name: { en: "Flywheel Effect", ko: "플라이휠 효과" },
    explanation: {
      en: "Each small push builds momentum until the flywheel spins on its own.",
      ko: "작은 밀기 하나하나가 모여 결국 플라이휠이 스스로 돌게 된다.",
    },
    source: "Jim Collins",
    category: "growth",
  },
  {
    name: { en: "Blue Ocean Strategy", ko: "블루오션 전략" },
    explanation: {
      en: "Create uncontested market space instead of competing in existing ones.",
      ko: "기존 시장에서 경쟁하는 대신 경쟁 없는 시장 공간을 창출하라.",
    },
    source: "W. Chan Kim",
    category: "startup",
  },
  {
    name: { en: "Kaizen", ko: "카이젠" },
    explanation: {
      en: "Continuous small improvements every day lead to extraordinary results.",
      ko: "매일의 작은 개선이 비범한 결과를 만든다.",
    },
    source: "Toyota Production System",
    category: "growth",
  },
  {
    name: { en: "Antifragility", ko: "안티프래질" },
    explanation: {
      en: "Some things benefit from shocks. Build systems that get stronger under stress.",
      ko: "어떤 것들은 충격으로부터 이득을 얻는다. 스트레스에서 더 강해지는 시스템을 만들라.",
    },
    source: "Nassim Taleb",
    category: "mindset",
  },
  {
    name: { en: "Minimum Viable Product", ko: "최소 기능 제품" },
    explanation: {
      en: "Ship the smallest thing that validates your hypothesis.",
      ko: "가설을 검증할 수 있는 가장 작은 것을 출시하라.",
    },
    source: "Eric Ries",
    category: "startup",
  },
  {
    name: { en: "Deep Work", ko: "딥 워크" },
    explanation: {
      en: "Focus without distraction on cognitively demanding tasks.",
      ko: "인지적으로 요구되는 작업에 방해 없이 집중하라.",
    },
    source: "Cal Newport",
    category: "growth",
  },
  {
    name: { en: "Stoic Dichotomy", ko: "스토아 이분법" },
    explanation: {
      en: "Focus only on what you can control. Let go of the rest.",
      ko: "통제할 수 있는 것에만 집중하라. 나머지는 내려놓아라.",
    },
    source: "Epictetus",
    category: "mindset",
  },
  {
    name: { en: "Eisenhower Matrix", ko: "아이젠하워 매트릭스" },
    explanation: {
      en: "Prioritize by urgency and importance. Do important things first.",
      ko: "긴급성과 중요성으로 우선순위를 정하라. 중요한 것을 먼저 하라.",
    },
    source: "Dwight D. Eisenhower",
    category: "growth",
  },
  {
    name: { en: "Pivot", ko: "피벗" },
    explanation: {
      en: "Change strategy without changing vision when current path isn't working.",
      ko: "현재 경로가 작동하지 않을 때 비전은 유지하면서 전략을 바꿔라.",
    },
    source: "Eric Ries",
    category: "startup",
  },
  {
    name: { en: "Beginner's Mind", ko: "초심" },
    explanation: {
      en: "Approach problems with openness and curiosity, free from preconceptions.",
      ko: "선입견 없이 개방성과 호기심으로 문제에 접근하라.",
    },
    source: "Shunryu Suzuki",
    category: "mindset",
  },
  {
    name: { en: "T-Shaped Skills", ko: "T자형 역량" },
    explanation: {
      en: "Go deep in one area but maintain broad knowledge across many.",
      ko: "한 분야에서 깊이를 갖되 여러 분야에 걸쳐 폭넓은 지식을 유지하라.",
    },
    source: "IDEO / Tim Brown",
    category: "growth",
  },
  {
    name: { en: "Occam's Razor", ko: "오컴의 면도날" },
    explanation: {
      en: "The simplest explanation is usually the correct one.",
      ko: "가장 단순한 설명이 보통 정확한 것이다.",
    },
    source: "William of Ockham",
    category: "mindset",
  },
  {
    name: { en: "Ramen Profitability", ko: "라면 수익성" },
    explanation: {
      en: "Earn just enough revenue to cover founders' basic living expenses.",
      ko: "창업자의 기본 생활비를 충당할 만큼만 수익을 올려라.",
    },
    source: "Paul Graham",
    category: "startup",
  },
  {
    name: { en: "Second-Order Thinking", ko: "2차 사고" },
    explanation: {
      en: "Consider the consequences of consequences before making decisions.",
      ko: "결정을 내리기 전에 결과의 결과까지 고려하라.",
    },
    source: "Howard Marks",
    category: "mindset",
  },
  {
    name: { en: "Power of Habit", ko: "습관의 힘" },
    explanation: {
      en: "Identify the cue-routine-reward loop to build or break habits.",
      ko: "습관을 만들거나 깨기 위해 신호-루틴-보상 루프를 파악하라.",
    },
    source: "Charles Duhigg",
    category: "growth",
  },
  {
    name: { en: "Two Pizza Rule", ko: "투 피자 룰" },
    explanation: {
      en: "Teams should be small enough to be fed by two pizzas.",
      ko: "팀은 피자 두 판으로 먹일 수 있을 만큼 작아야 한다.",
    },
    source: "Jeff Bezos",
    category: "startup",
  },
  {
    name: { en: "Inversion", ko: "반전 사고" },
    explanation: {
      en: "Instead of asking how to succeed, ask how to avoid failure.",
      ko: "성공하는 방법 대신 실패를 피하는 방법을 물어라.",
    },
    source: "Charlie Munger",
    category: "mindset",
  },
  {
    name: { en: "Feedback Loop", ko: "피드백 루프" },
    explanation: {
      en: "Shorten the loop between action and feedback to learn faster.",
      ko: "행동과 피드백 사이의 루프를 줄여 더 빠르게 배워라.",
    },
    source: "Systems Thinking",
    category: "growth",
  },
  {
    name: { en: "Skin in the Game", ko: "스킨 인 더 게임" },
    explanation: {
      en: "Have personal stake in outcomes. People perform better with real consequences.",
      ko: "결과에 개인적 이해관계를 가져라. 실제 결과가 있을 때 사람들은 더 잘 수행한다.",
    },
    source: "Nassim Taleb",
    category: "startup",
  },
];

export function getPrinciplesByCategory(category: string): Principle[] {
  if (category === "all") return principles;
  return principles.filter(p => p.category === category);
}
