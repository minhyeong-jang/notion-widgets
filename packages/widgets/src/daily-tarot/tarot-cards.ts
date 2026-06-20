export interface TarotCard {
  id: number;
  number: string;
  name: string;
  nameKo: string;
  meaning: string;
  meaningKo: string;
  advice: string;
  adviceKo: string;
  keywords: string;
  keywordsKo: string;
  isMajor: boolean;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0, number: "0", name: "The Fool", nameKo: "광대",
    meaning: "New beginnings, innocence, spontaneity, free spirit",
    meaningKo: "새로운 시작, 순수함, 자유로운 영혼",
    advice: "Take a leap into the unknown today — your curiosity will light the way.",
    adviceKo: "오늘 미지의 세계로 뛰어드세요 — 당신의 호기심이 길을 밝힐 것입니다.",
    keywords: "Beginnings, Freedom, Adventure",
    keywordsKo: "시작, 자유, 모험",
    isMajor: true,
  },
  {
    id: 1, number: "I", name: "The Magician", nameKo: "마법사",
    meaning: "Willpower, desire, creation, manifestation",
    meaningKo: "의지력, 창조, 발현",
    advice: "You have everything you need. Focus your will and make your vision real.",
    adviceKo: "필요한 모든 것이 있습니다. 의지를 집중하고 비전을 현실로 만드세요.",
    keywords: "Power, Skill, Concentration",
    keywordsKo: "힘, 기술, 집중",
    isMajor: true,
  },
  {
    id: 2, number: "II", name: "The High Priestess", nameKo: "여제사장",
    meaning: "Intuition, sacred knowledge, divine feminine, the subconscious mind",
    meaningKo: "직관, 신성한 지식, 잠재의식",
    advice: "Pause and listen to your intuition before acting — the answer is already within.",
    adviceKo: "행동 전에 잠시 멈추고 직관에 귀 기울이세요 — 답은 이미 내면에 있습니다.",
    keywords: "Intuition, Mystery, Wisdom",
    keywordsKo: "직관, 신비, 지혜",
    isMajor: true,
  },
  {
    id: 3, number: "III", name: "The Empress", nameKo: "여황",
    meaning: "Femininity, beauty, nature, nurturing, abundance",
    meaningKo: "여성성, 아름다움, 풍요",
    advice: "Nurture a creative idea or relationship today — your care will yield abundance.",
    adviceKo: "오늘 창의적인 아이디어나 관계를 돌보세요 — 당신의 정성이 풍요를 낳을 것입니다.",
    keywords: "Nature, Abundance, Fertility",
    keywordsKo: "자연, 풍요, 생산성",
    isMajor: true,
  },
  {
    id: 4, number: "IV", name: "The Emperor", nameKo: "황제",
    meaning: "Authority, establishment, structure, a father figure",
    meaningKo: "권위, 구조, 안정",
    advice: "Establish clear goals and follow through — structure is your strength today.",
    adviceKo: "명확한 목표를 세우고 실행하세요 — 오늘 구조가 당신의 힘입니다.",
    keywords: "Authority, Structure, Control",
    keywordsKo: "권위, 구조, 통제",
    isMajor: true,
  },
  {
    id: 5, number: "V", name: "The Hierophant", nameKo: "교황",
    meaning: "Spiritual wisdom, religious beliefs, tradition, conformity",
    meaningKo: "영적 지혜, 전통, 신념",
    advice: "Seek guidance from tradition or a trusted mentor rather than reinventing the wheel.",
    adviceKo: "새롭게 발명하려 하기보다 전통이나 신뢰할 멘토에게 지혜를 구하세요.",
    keywords: "Tradition, Guidance, Faith",
    keywordsKo: "전통, 안내, 신념",
    isMajor: true,
  },
  {
    id: 6, number: "VI", name: "The Lovers", nameKo: "연인",
    meaning: "Love, harmony, relationships, values alignment, choices",
    meaningKo: "사랑, 조화, 관계, 선택",
    advice: "A meaningful choice awaits — align your decision with your deepest values.",
    adviceKo: "의미 있는 선택이 기다립니다 — 가장 깊은 가치에 맞는 결정을 하세요.",
    keywords: "Love, Harmony, Choice",
    keywordsKo: "사랑, 조화, 선택",
    isMajor: true,
  },
  {
    id: 7, number: "VII", name: "The Chariot", nameKo: "전차",
    meaning: "Control, willpower, success, action, determination",
    meaningKo: "통제, 의지력, 성공, 결단력",
    advice: "Stay disciplined and keep your eyes on the goal — distractions can wait.",
    adviceKo: "훈련을 유지하고 목표에 집중하세요 — 방해 요소는 기다릴 수 있습니다.",
    keywords: "Victory, Willpower, Focus",
    keywordsKo: "승리, 의지, 집중",
    isMajor: true,
  },
  {
    id: 8, number: "VIII", name: "Strength", nameKo: "힘",
    meaning: "Courage, persuasion, influence, compassion",
    meaningKo: "용기, 설득력, 자비",
    advice: "Respond to today's challenges with gentle persistence and inner calm, not force.",
    adviceKo: "오늘의 도전에 힘이 아닌 부드러운 인내와 내면의 평온으로 대응하세요.",
    keywords: "Courage, Patience, Inner Strength",
    keywordsKo: "용기, 인내, 내면의 힘",
    isMajor: true,
  },
  {
    id: 9, number: "IX", name: "The Hermit", nameKo: "은둔자",
    meaning: "Soul searching, introspection, being alone, inner guidance",
    meaningKo: "내면 탐색, 자기성찰, 고독",
    advice: "Seek solitude for deep reflection today — your inner guide has something important to say.",
    adviceKo: "오늘 깊은 성찰을 위해 고독을 찾으세요 — 내면의 안내자가 중요한 말을 하고 있습니다.",
    keywords: "Solitude, Reflection, Wisdom",
    keywordsKo: "고독, 성찰, 지혜",
    isMajor: true,
  },
  {
    id: 10, number: "X", name: "Wheel of Fortune", nameKo: "운명의 바퀴",
    meaning: "Good luck, karma, life cycles, destiny, a turning point",
    meaningKo: "행운, 인과응보, 전환점",
    advice: "Accept that cycles turn — ride the shift with adaptability rather than resistance.",
    adviceKo: "순환이 돌아감을 받아들이세요 — 저항보다 적응력으로 변화를 타세요.",
    keywords: "Destiny, Change, Cycles",
    keywordsKo: "운명, 변화, 순환",
    isMajor: true,
  },
  {
    id: 11, number: "XI", name: "Justice", nameKo: "정의",
    meaning: "Justice, fairness, truth, cause and effect, law",
    meaningKo: "정의, 공정, 진실, 인과",
    advice: "Act with full integrity today — fairness in your dealings will tip the scales in your favor.",
    adviceKo: "오늘 완전한 성실함으로 행동하세요 — 공정한 거래가 저울을 당신에게 유리하게 기울일 것입니다.",
    keywords: "Truth, Balance, Fairness",
    keywordsKo: "진실, 균형, 공정",
    isMajor: true,
  },
  {
    id: 12, number: "XII", name: "The Hanged Man", nameKo: "매달린 사람",
    meaning: "Surrender, letting go, new perspectives",
    meaningKo: "항복, 내려놓음, 새로운 관점",
    advice: "Willingly pause and see things from a completely different angle — the delay itself is the gift.",
    adviceKo: "기꺼이 멈추고 전혀 다른 각도에서 사물을 보세요 — 지연 자체가 선물입니다.",
    keywords: "Surrender, Perspective, Pause",
    keywordsKo: "항복, 관점, 멈춤",
    isMajor: true,
  },
  {
    id: 13, number: "XIII", name: "Death", nameKo: "죽음",
    meaning: "Endings, change, transformation, transition",
    meaningKo: "끝, 변화, 변환, 전환",
    advice: "Release what no longer serves you — every ending clears space for something better.",
    adviceKo: "더 이상 도움이 되지 않는 것을 내려놓으세요 — 모든 끝은 더 나은 것을 위한 공간을 만듭니다.",
    keywords: "Transformation, Ending, Renewal",
    keywordsKo: "변환, 끝, 재생",
    isMajor: true,
  },
  {
    id: 14, number: "XIV", name: "Temperance", nameKo: "절제",
    meaning: "Balance, moderation, patience, purpose",
    meaningKo: "균형, 절제, 인내, 목적",
    advice: "Blend patience with steady effort — the balanced approach outlasts every shortcut.",
    adviceKo: "인내와 꾸준한 노력을 혼합하세요 — 균형 잡힌 접근이 모든 지름길보다 오래 갑니다.",
    keywords: "Balance, Patience, Moderation",
    keywordsKo: "균형, 인내, 절제",
    isMajor: true,
  },
  {
    id: 15, number: "XV", name: "The Devil", nameKo: "악마",
    meaning: "Shadow self, attachment, addiction, restriction",
    meaningKo: "그림자, 집착, 중독, 제약",
    advice: "Examine where you feel stuck or bound — simply recognizing the pattern begins your freedom.",
    adviceKo: "어디서 막히거나 묶여 있는지 살펴보세요 — 패턴을 인식하는 것 자체가 자유의 시작입니다.",
    keywords: "Temptation, Bondage, Shadow",
    keywordsKo: "유혹, 구속, 그림자",
    isMajor: true,
  },
  {
    id: 16, number: "XVI", name: "The Tower", nameKo: "탑",
    meaning: "Sudden change, upheaval, chaos, revelation, awakening",
    meaningKo: "급변, 혼란, 계시, 각성",
    advice: "Stay grounded when the unexpected hits — what crumbles wasn't built to last anyway.",
    adviceKo: "예상치 못한 일이 닥칠 때 안정을 유지하세요 — 무너지는 것은 애초에 오래 갈 수 없었습니다.",
    keywords: "Upheaval, Revelation, Change",
    keywordsKo: "격변, 계시, 변화",
    isMajor: true,
  },
  {
    id: 17, number: "XVII", name: "The Star", nameKo: "별",
    meaning: "Hope, faith, purpose, renewal, spirituality",
    meaningKo: "희망, 신념, 목적, 재생",
    advice: "Let hope guide your next step — this is a time for renewal, not retreat.",
    adviceKo: "희망이 다음 걸음을 이끌게 하세요 — 지금은 후퇴가 아닌 갱신의 시간입니다.",
    keywords: "Hope, Inspiration, Serenity",
    keywordsKo: "희망, 영감, 평온",
    isMajor: true,
  },
  {
    id: 18, number: "XVIII", name: "The Moon", nameKo: "달",
    meaning: "Illusion, fear, anxiety, subconscious, intuition",
    meaningKo: "환상, 두려움, 불안, 직관",
    advice: "Avoid rash decisions — more will become clear once the confusion lifts.",
    adviceKo: "성급한 결정을 피하세요 — 혼란이 걷히면 더 많은 것이 명확해질 것입니다.",
    keywords: "Illusion, Intuition, Dreams",
    keywordsKo: "환상, 직관, 꿈",
    isMajor: true,
  },
  {
    id: 19, number: "XIX", name: "The Sun", nameKo: "태양",
    meaning: "Positivity, fun, warmth, success, vitality",
    meaningKo: "긍정, 즐거움, 성공, 활력",
    advice: "Shine your authentic self today — your joy and energy lift everyone around you.",
    adviceKo: "오늘 진정한 자신을 빛내세요 — 당신의 기쁨과 에너지가 주변 모든 사람을 고양합니다.",
    keywords: "Joy, Success, Vitality",
    keywordsKo: "기쁨, 성공, 활력",
    isMajor: true,
  },
  {
    id: 20, number: "XX", name: "Judgement", nameKo: "심판",
    meaning: "Judgement, rebirth, inner calling, absolution",
    meaningKo: "심판, 재생, 내면의 부름",
    advice: "Answer the call you've been putting off — this is the moment for a meaningful renewal.",
    adviceKo: "미뤄온 부름에 응답하세요 — 지금이 의미 있는 갱신의 순간입니다.",
    keywords: "Rebirth, Calling, Reflection",
    keywordsKo: "재생, 부름, 성찰",
    isMajor: true,
  },
  {
    id: 21, number: "XXI", name: "The World", nameKo: "세계",
    meaning: "Completion, integration, accomplishment, travel",
    meaningKo: "완성, 통합, 성취",
    advice: "Celebrate how far you've come — savor this completion before the next chapter begins.",
    adviceKo: "얼마나 멀리 왔는지 축하하세요 — 다음 장이 시작되기 전에 이 완성을 음미하세요.",
    keywords: "Completion, Fulfillment, Wholeness",
    keywordsKo: "완성, 충족, 온전함",
    isMajor: true,
  },
];

// Minor Arcana suits
const suits = [
  { name: "Wands", nameKo: "완드", element: "Fire", adviceSuffix: " in your creative and ambitious pursuits.", adviceSuffixKo: " 창의적이고 야심찬 추구에서." },
  { name: "Cups", nameKo: "컵", element: "Water", adviceSuffix: " in emotional and relational matters.", adviceSuffixKo: " 감정적이고 관계적인 문제에서." },
  { name: "Swords", nameKo: "소드", element: "Air", adviceSuffix: " when facing communication or intellectual challenges.", adviceSuffixKo: " 소통이나 지적 도전에 직면할 때." },
  { name: "Pentacles", nameKo: "펜타클", element: "Earth", adviceSuffix: " in practical work, finances, and daily routines.", adviceSuffixKo: " 실용적인 일, 재정 또는 일상에서." },
] as const;

const ranks = [
  {
    rank: "Ace", rankKo: "에이스",
    meaning: "New start", meaningKo: "새로운 시작",
    advice: "Seize this new beginning with bold intention", adviceKo: "새로운 시작을 대담한 의도로 잡으세요",
  },
  {
    rank: "Two", rankKo: "2",
    meaning: "Balance", meaningKo: "균형",
    advice: "Find balance before choosing your next step", adviceKo: "다음 걸음을 선택하기 전에 균형을 찾으세요",
  },
  {
    rank: "Three", rankKo: "3",
    meaning: "Growth", meaningKo: "성장",
    advice: "Collaborate — shared effort accelerates progress", adviceKo: "협력하세요 — 공동의 노력이 진전을 가속화합니다",
  },
  {
    rank: "Four", rankKo: "4",
    meaning: "Stability", meaningKo: "안정",
    advice: "Secure what you have before pushing further", adviceKo: "더 나아가기 전에 가진 것을 확보하세요",
  },
  {
    rank: "Five", rankKo: "5",
    meaning: "Conflict", meaningKo: "갈등",
    advice: "Meet conflict with calm strategy, not reaction", adviceKo: "반응이 아닌 차분한 전략으로 갈등에 임하세요",
  },
  {
    rank: "Six", rankKo: "6",
    meaning: "Harmony", meaningKo: "조화",
    advice: "Extend generosity — harmony is within reach", adviceKo: "관대함을 베푸세요 — 조화는 손에 닿는 곳에 있습니다",
  },
  {
    rank: "Seven", rankKo: "7",
    meaning: "Reflection", meaningKo: "성찰",
    advice: "Step back and reassess before committing", adviceKo: "전념하기 전에 물러서서 재평가하세요",
  },
  {
    rank: "Eight", rankKo: "8",
    meaning: "Movement", meaningKo: "움직임",
    advice: "Move swiftly — stagnation is your only obstacle", adviceKo: "신속히 움직이세요 — 정체만이 당신의 유일한 장애물입니다",
  },
  {
    rank: "Nine", rankKo: "9",
    meaning: "Fruition", meaningKo: "결실",
    advice: "You're nearly there — resilience now pays off", adviceKo: "거의 다 왔습니다 — 이제 회복력이 보상받습니다",
  },
  {
    rank: "Ten", rankKo: "10",
    meaning: "Completion", meaningKo: "완성",
    advice: "Share the load — you don't need to carry it all alone", adviceKo: "짐을 나누세요 — 혼자 모든 것을 짊어질 필요가 없습니다",
  },
  {
    rank: "Page", rankKo: "페이지",
    meaning: "Exploration", meaningKo: "탐험",
    advice: "Stay curious and absorb everything you can today", adviceKo: "오늘 호기심을 갖고 모든 것을 흡수하세요",
  },
  {
    rank: "Knight", rankKo: "나이트",
    meaning: "Action", meaningKo: "행동",
    advice: "Channel your passion into focused, purposeful action", adviceKo: "열정을 집중되고 목적 있는 행동으로 전환하세요",
  },
  {
    rank: "Queen", rankKo: "퀸",
    meaning: "Nurturing", meaningKo: "양육",
    advice: "Lead with empathy and practical wisdom today", adviceKo: "오늘 공감과 실용적인 지혜로 이끄세요",
  },
  {
    rank: "King", rankKo: "킹",
    meaning: "Mastery", meaningKo: "숙달",
    advice: "Command with experience, confidence, and fairness", adviceKo: "경험, 자신감, 공정함으로 이끄세요",
  },
];

function generateMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  let id = 22;

  for (const suit of suits) {
    for (const r of ranks) {
      cards.push({
        id: id++,
        number: r.rank === "Ace" ? "A" : r.rankKo,
        name: `${r.rank} of ${suit.name}`,
        nameKo: `${suit.nameKo}의 ${r.rankKo}`,
        meaning: `${r.meaning} in the realm of ${suit.element.toLowerCase()}`,
        meaningKo: `${suit.element} 영역의 ${r.meaningKo}`,
        advice: `${r.advice}${suit.adviceSuffix}`,
        adviceKo: `${r.adviceKo}${suit.adviceSuffixKo}`,
        keywords: `${r.meaning}, ${suit.element}, ${suit.name}`,
        keywordsKo: `${r.meaningKo}, ${suit.nameKo}`,
        isMajor: false,
      });
    }
  }

  return cards;
}

export const minorArcana = generateMinorArcana();

export const allCards: TarotCard[] = [...majorArcana, ...minorArcana];

export function getDailyCard(deck: "major" | "full"): TarotCard {
  const cards = deck === "major" ? majorArcana : allCards;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return cards[dayOfYear % cards.length];
}

/** Simple seeded PRNG for deterministic daily spread */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export interface SpreadCard {
  card: TarotCard;
  position: "past" | "present" | "future";
  positionLabel: string;
  positionLabelKo: string;
  reversed: boolean;
}

export function getDailySpread(deck: "major" | "full"): SpreadCard[] {
  const cards = deck === "major" ? [...majorArcana] : [...allCards];
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const rng = seededRandom(dayOfYear * 7919 + now.getFullYear());

  // Fisher-Yates shuffle with seeded random
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  const positions = [
    { position: "past" as const, positionLabel: "Past", positionLabelKo: "과거" },
    { position: "present" as const, positionLabel: "Present", positionLabelKo: "현재" },
    { position: "future" as const, positionLabel: "Future", positionLabelKo: "미래" },
  ];

  return positions.map((pos, i) => ({
    card: cards[i],
    ...pos,
    reversed: rng() > 0.7,
  }));
}
