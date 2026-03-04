export interface TarotCard {
  id: number;
  number: string;
  name: string;
  nameKo: string;
  meaning: string;
  meaningKo: string;
  keywords: string;
  keywordsKo: string;
  isMajor: boolean;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0, number: "0", name: "The Fool", nameKo: "\uAD11\uB300",
    meaning: "New beginnings, innocence, spontaneity, free spirit",
    meaningKo: "\uC0C8\uB85C\uC6B4 \uC2DC\uC791, \uC21C\uC218\uD568, \uC790\uC720\uB85C\uC6B4 \uC601\uD63C",
    keywords: "Beginnings, Freedom, Adventure",
    keywordsKo: "\uC2DC\uC791, \uC790\uC720, \uBAA8\uD5D8",
    isMajor: true,
  },
  {
    id: 1, number: "I", name: "The Magician", nameKo: "\uB9C8\uBC95\uC0AC",
    meaning: "Willpower, desire, creation, manifestation",
    meaningKo: "\uC758\uC9C0\uB825, \uCC3D\uC870, \uBC1C\uD604",
    keywords: "Power, Skill, Concentration",
    keywordsKo: "\uD798, \uAE30\uC220, \uC9D1\uC911",
    isMajor: true,
  },
  {
    id: 2, number: "II", name: "The High Priestess", nameKo: "\uC5EC\uC81C\uC0AC\uC7A5",
    meaning: "Intuition, sacred knowledge, divine feminine, the subconscious mind",
    meaningKo: "\uC9C1\uAD00, \uC2E0\uC131\uD55C \uC9C0\uC2DD, \uC7A0\uC7AC\uC758\uC2DD",
    keywords: "Intuition, Mystery, Wisdom",
    keywordsKo: "\uC9C1\uAD00, \uC2E0\uBE44, \uC9C0\uD61C",
    isMajor: true,
  },
  {
    id: 3, number: "III", name: "The Empress", nameKo: "\uC5EC\uD669",
    meaning: "Femininity, beauty, nature, nurturing, abundance",
    meaningKo: "\uC5EC\uC131\uC131, \uC544\uB984\uB2E4\uC6C0, \uD48D\uC694",
    keywords: "Nature, Abundance, Fertility",
    keywordsKo: "\uC790\uC5F0, \uD48D\uC694, \uC0DD\uC0B0\uC131",
    isMajor: true,
  },
  {
    id: 4, number: "IV", name: "The Emperor", nameKo: "\uD669\uC81C",
    meaning: "Authority, establishment, structure, a father figure",
    meaningKo: "\uAD8C\uC704, \uAD6C\uC870, \uC548\uC815",
    keywords: "Authority, Structure, Control",
    keywordsKo: "\uAD8C\uC704, \uAD6C\uC870, \uD1B5\uC81C",
    isMajor: true,
  },
  {
    id: 5, number: "V", name: "The Hierophant", nameKo: "\uAD50\uD669",
    meaning: "Spiritual wisdom, religious beliefs, tradition, conformity",
    meaningKo: "\uC601\uC801 \uC9C0\uD61C, \uC804\uD1B5, \uC2E0\uB150",
    keywords: "Tradition, Guidance, Faith",
    keywordsKo: "\uC804\uD1B5, \uC548\uB0B4, \uC2E0\uB150",
    isMajor: true,
  },
  {
    id: 6, number: "VI", name: "The Lovers", nameKo: "\uC5F0\uC778",
    meaning: "Love, harmony, relationships, values alignment, choices",
    meaningKo: "\uC0AC\uB791, \uC870\uD654, \uAD00\uACC4, \uC120\uD0DD",
    keywords: "Love, Harmony, Choice",
    keywordsKo: "\uC0AC\uB791, \uC870\uD654, \uC120\uD0DD",
    isMajor: true,
  },
  {
    id: 7, number: "VII", name: "The Chariot", nameKo: "\uC804\uCC28",
    meaning: "Control, willpower, success, action, determination",
    meaningKo: "\uD1B5\uC81C, \uC758\uC9C0\uB825, \uC131\uACF5, \uACB0\uB2E8\uB825",
    keywords: "Victory, Willpower, Focus",
    keywordsKo: "\uC2B9\uB9AC, \uC758\uC9C0, \uC9D1\uC911",
    isMajor: true,
  },
  {
    id: 8, number: "VIII", name: "Strength", nameKo: "\uD798",
    meaning: "Courage, persuasion, influence, compassion",
    meaningKo: "\uC6A9\uAE30, \uC124\uB4DD\uB825, \uC790\uBE44",
    keywords: "Courage, Patience, Inner Strength",
    keywordsKo: "\uC6A9\uAE30, \uC778\uB0B4, \uB0B4\uBA74\uC758 \uD798",
    isMajor: true,
  },
  {
    id: 9, number: "IX", name: "The Hermit", nameKo: "\uC740\uB454\uC790",
    meaning: "Soul searching, introspection, being alone, inner guidance",
    meaningKo: "\uB0B4\uBA74 \uD0D0\uC0C9, \uC790\uAE30\uC131\uCC30, \uACE0\uB3C5",
    keywords: "Solitude, Reflection, Wisdom",
    keywordsKo: "\uACE0\uB3C5, \uC131\uCC30, \uC9C0\uD61C",
    isMajor: true,
  },
  {
    id: 10, number: "X", name: "Wheel of Fortune", nameKo: "\uC6B4\uBA85\uC758 \uBC14\uD034",
    meaning: "Good luck, karma, life cycles, destiny, a turning point",
    meaningKo: "\uD589\uC6B4, \uC778\uACFC\uC751\uBCF4, \uC804\uD658\uC810",
    keywords: "Destiny, Change, Cycles",
    keywordsKo: "\uC6B4\uBA85, \uBCC0\uD654, \uC21C\uD658",
    isMajor: true,
  },
  {
    id: 11, number: "XI", name: "Justice", nameKo: "\uC815\uC758",
    meaning: "Justice, fairness, truth, cause and effect, law",
    meaningKo: "\uC815\uC758, \uACF5\uC815, \uC9C4\uC2E4, \uC778\uACFC",
    keywords: "Truth, Balance, Fairness",
    keywordsKo: "\uC9C4\uC2E4, \uADE0\uD615, \uACF5\uC815",
    isMajor: true,
  },
  {
    id: 12, number: "XII", name: "The Hanged Man", nameKo: "\uB9E4\uB2EC\uB9B0 \uC0AC\uB78C",
    meaning: "Surrender, letting go, new perspectives",
    meaningKo: "\uD56D\uBCF5, \uB0B4\uB824\uB193\uC74C, \uC0C8\uB85C\uC6B4 \uAD00\uC810",
    keywords: "Surrender, Perspective, Pause",
    keywordsKo: "\uD56D\uBCF5, \uAD00\uC810, \uBA48\uCDA4",
    isMajor: true,
  },
  {
    id: 13, number: "XIII", name: "Death", nameKo: "\uC8FD\uC74C",
    meaning: "Endings, change, transformation, transition",
    meaningKo: "\uB05D, \uBCC0\uD654, \uBCC0\uD658, \uC804\uD658",
    keywords: "Transformation, Ending, Renewal",
    keywordsKo: "\uBCC0\uD658, \uB05D, \uC7AC\uC0DD",
    isMajor: true,
  },
  {
    id: 14, number: "XIV", name: "Temperance", nameKo: "\uC808\uC81C",
    meaning: "Balance, moderation, patience, purpose",
    meaningKo: "\uADE0\uD615, \uC808\uC81C, \uC778\uB0B4, \uBAA9\uC801",
    keywords: "Balance, Patience, Moderation",
    keywordsKo: "\uADE0\uD615, \uC778\uB0B4, \uC808\uC81C",
    isMajor: true,
  },
  {
    id: 15, number: "XV", name: "The Devil", nameKo: "\uC545\uB9C8",
    meaning: "Shadow self, attachment, addiction, restriction",
    meaningKo: "\uADF8\uB9BC\uC790, \uC9D1\uCC29, \uC911\uB3C5, \uC81C\uC57D",
    keywords: "Temptation, Bondage, Shadow",
    keywordsKo: "\uC720\uD639, \uAD6C\uC18D, \uADF8\uB9BC\uC790",
    isMajor: true,
  },
  {
    id: 16, number: "XVI", name: "The Tower", nameKo: "\uD0D1",
    meaning: "Sudden change, upheaval, chaos, revelation, awakening",
    meaningKo: "\uAE09\uBCC0, \uD63C\uB780, \uACC4\uC2DC, \uAC01\uC131",
    keywords: "Upheaval, Revelation, Change",
    keywordsKo: "\uACA9\uBCC0, \uACC4\uC2DC, \uBCC0\uD654",
    isMajor: true,
  },
  {
    id: 17, number: "XVII", name: "The Star", nameKo: "\uBCC4",
    meaning: "Hope, faith, purpose, renewal, spirituality",
    meaningKo: "\uD76C\uB9DD, \uC2E0\uB150, \uBAA9\uC801, \uC7AC\uC0DD",
    keywords: "Hope, Inspiration, Serenity",
    keywordsKo: "\uD76C\uB9DD, \uC601\uAC10, \uD3C9\uC628",
    isMajor: true,
  },
  {
    id: 18, number: "XVIII", name: "The Moon", nameKo: "\uB2EC",
    meaning: "Illusion, fear, anxiety, subconscious, intuition",
    meaningKo: "\uD658\uC0C1, \uB450\uB824\uC6C0, \uBD88\uC548, \uC9C1\uAD00",
    keywords: "Illusion, Intuition, Dreams",
    keywordsKo: "\uD658\uC0C1, \uC9C1\uAD00, \uAFC8",
    isMajor: true,
  },
  {
    id: 19, number: "XIX", name: "The Sun", nameKo: "\uD0DC\uC591",
    meaning: "Positivity, fun, warmth, success, vitality",
    meaningKo: "\uAE0D\uC815, \uC990\uAC70\uC6C0, \uC131\uACF5, \uD65C\uB825",
    keywords: "Joy, Success, Vitality",
    keywordsKo: "\uAE30\uC068, \uC131\uACF5, \uD65C\uB825",
    isMajor: true,
  },
  {
    id: 20, number: "XX", name: "Judgement", nameKo: "\uC2EC\uD310",
    meaning: "Judgement, rebirth, inner calling, absolution",
    meaningKo: "\uC2EC\uD310, \uC7AC\uC0DD, \uB0B4\uBA74\uC758 \uBD80\uB984",
    keywords: "Rebirth, Calling, Reflection",
    keywordsKo: "\uC7AC\uC0DD, \uBD80\uB984, \uC131\uCC30",
    isMajor: true,
  },
  {
    id: 21, number: "XXI", name: "The World", nameKo: "\uC138\uACC4",
    meaning: "Completion, integration, accomplishment, travel",
    meaningKo: "\uC644\uC131, \uD1B5\uD569, \uC131\uCDE8",
    keywords: "Completion, Fulfillment, Wholeness",
    keywordsKo: "\uC644\uC131, \uCDA9\uC871, \uC628\uC804\uD568",
    isMajor: true,
  },
];

// Minor Arcana suits
const suits = [
  { name: "Wands", nameKo: "\uC644\uB4DC", element: "Fire" },
  { name: "Cups", nameKo: "\uCEF5", element: "Water" },
  { name: "Swords", nameKo: "\uC18C\uB4DC", element: "Air" },
  { name: "Pentacles", nameKo: "\uD39C\uD0C0\uD074", element: "Earth" },
] as const;

const ranks = [
  { rank: "Ace", rankKo: "\uC5D0\uC774\uC2A4", meaning: "New start", meaningKo: "\uC0C8\uB85C\uC6B4 \uC2DC\uC791" },
  { rank: "Two", rankKo: "2", meaning: "Balance", meaningKo: "\uADE0\uD615" },
  { rank: "Three", rankKo: "3", meaning: "Growth", meaningKo: "\uC131\uC7A5" },
  { rank: "Four", rankKo: "4", meaning: "Stability", meaningKo: "\uC548\uC815" },
  { rank: "Five", rankKo: "5", meaning: "Conflict", meaningKo: "\uAC08\uB4F1" },
  { rank: "Six", rankKo: "6", meaning: "Harmony", meaningKo: "\uC870\uD654" },
  { rank: "Seven", rankKo: "7", meaning: "Reflection", meaningKo: "\uC131\uCC30" },
  { rank: "Eight", rankKo: "8", meaning: "Movement", meaningKo: "\uC6C0\uC9C1\uC784" },
  { rank: "Nine", rankKo: "9", meaning: "Fruition", meaningKo: "\uACB0\uC2E4" },
  { rank: "Ten", rankKo: "10", meaning: "Completion", meaningKo: "\uC644\uC131" },
  { rank: "Page", rankKo: "\uD398\uC774\uC9C0", meaning: "Exploration", meaningKo: "\uD0D0\uD5D8" },
  { rank: "Knight", rankKo: "\uB098\uC774\uD2B8", meaning: "Action", meaningKo: "\uD589\uB3D9" },
  { rank: "Queen", rankKo: "\uD018", meaning: "Nurturing", meaningKo: "\uC591\uC721" },
  { rank: "King", rankKo: "\uD0B9", meaning: "Mastery", meaningKo: "\uC219\uB2EC" },
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
        nameKo: `${suit.nameKo}\uC758 ${r.rankKo}`,
        meaning: `${r.meaning} in the realm of ${suit.element.toLowerCase()}`,
        meaningKo: `${suit.element} \uC601\uC5ED\uC758 ${r.meaningKo}`,
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
