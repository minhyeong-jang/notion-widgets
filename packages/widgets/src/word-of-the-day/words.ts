export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb";

export interface Word {
  word: string;
  pos: PartOfSpeech;
  /** Concise English definition. */
  en: string;
  /** Korean meaning. */
  ko: string;
  /** Natural example sentence using the word. */
  example: string;
}

/** Short badge label per part of speech. */
export const POS_ABBR: Record<PartOfSpeech, string> = {
  noun: "n.",
  verb: "v.",
  adjective: "adj.",
  adverb: "adv.",
};

export const POS_LABEL: Record<string, Record<PartOfSpeech, string>> = {
  en: { noun: "noun", verb: "verb", adjective: "adjective", adverb: "adverb" },
  ko: { noun: "명사", verb: "동사", adjective: "형용사", adverb: "부사" },
};

export const WORDS: Word[] = [
  { word: "serendipity", pos: "noun", en: "the occurrence of fortunate events by chance", ko: "뜻밖의 행운, 우연한 발견", example: "Finding that little café was pure serendipity." },
  { word: "resilient", pos: "adjective", en: "able to recover quickly from difficulties", ko: "회복력 있는, 탄력 있는", example: "She stayed resilient through tough times." },
  { word: "meticulous", pos: "adjective", en: "showing great attention to detail", ko: "꼼꼼한, 세심한", example: "He is meticulous about every line of code." },
  { word: "candid", pos: "adjective", en: "honest and straightforward", ko: "솔직한, 숨김없는", example: "I appreciate your candid feedback." },
  { word: "eloquent", pos: "adjective", en: "fluent and persuasive in speech or writing", ko: "웅변의, 설득력 있는", example: "She gave an eloquent speech at the ceremony." },
  { word: "pragmatic", pos: "adjective", en: "dealing with things in a practical way", ko: "실용적인, 현실적인", example: "We need a pragmatic solution, not a perfect one." },
  { word: "nuance", pos: "noun", en: "a subtle difference in meaning or feeling", ko: "미묘한 차이", example: "He missed the nuance in her tone." },
  { word: "ambiguous", pos: "adjective", en: "open to more than one interpretation", ko: "애매모호한, 여러 뜻으로 해석되는", example: "The instructions were a bit ambiguous." },
  { word: "diligent", pos: "adjective", en: "hardworking and careful", ko: "성실한, 근면한", example: "A diligent student prepares in advance." },
  { word: "inevitable", pos: "adjective", en: "certain to happen; unavoidable", ko: "불가피한, 필연적인", example: "Change is inevitable, so embrace it." },
  { word: "profound", pos: "adjective", en: "very deep, intense, or meaningful", ko: "깊은, 심오한", example: "The book had a profound impact on me." },
  { word: "tenacious", pos: "adjective", en: "persistent and not giving up easily", ko: "끈기 있는, 집요한", example: "Her tenacious effort finally paid off." },
  { word: "versatile", pos: "adjective", en: "able to adapt to many different tasks", ko: "다재다능한, 다용도의", example: "He is a versatile musician." },
  { word: "empathy", pos: "noun", en: "the ability to understand others' feelings", ko: "공감, 감정 이입", example: "Good leaders lead with empathy." },
  { word: "gratitude", pos: "noun", en: "the quality of being thankful", ko: "감사, 고마움", example: "She expressed her gratitude with a warm note." },
  { word: "humble", pos: "adjective", en: "modest; not proud or arrogant", ko: "겸손한", example: "Despite his success, he remained humble." },
  { word: "ambitious", pos: "adjective", en: "having a strong desire to succeed", ko: "야심 찬, 포부가 큰", example: "She set ambitious goals for the year." },
  { word: "curious", pos: "adjective", en: "eager to know or learn something", ko: "호기심 많은", example: "Children are naturally curious." },
  { word: "authentic", pos: "adjective", en: "genuine; true to its origin", ko: "진정한, 진짜의", example: "The restaurant serves authentic Thai food." },
  { word: "vivid", pos: "adjective", en: "producing strong, clear images in the mind", ko: "생생한, 선명한", example: "She has vivid memories of that summer." },
  { word: "cherish", pos: "verb", en: "to hold something dear; to treasure", ko: "소중히 여기다", example: "I cherish every moment with my family." },
  { word: "endeavor", pos: "noun", en: "an earnest and serious effort", ko: "노력, 시도", example: "They spared no endeavor to succeed." },
  { word: "inspire", pos: "verb", en: "to fill someone with the urge to do something", ko: "영감을 주다, 고무하다", example: "Her story inspires people around the world." },
  { word: "persevere", pos: "verb", en: "to continue despite difficulty", ko: "인내하다, 꿋꿋이 견디다", example: "Persevere, and you will reach your goal." },
  { word: "thrive", pos: "verb", en: "to grow or develop vigorously", ko: "번성하다, 잘 자라다", example: "These plants thrive in direct sunlight." },
  { word: "mindful", pos: "adjective", en: "conscious and aware of something", ko: "유념하는, 신경 쓰는", example: "Be mindful of how your words affect others." },
  { word: "genuine", pos: "adjective", en: "truly what it is said to be; sincere", ko: "진실한, 진짜의", example: "She gave a genuine smile." },
  { word: "optimistic", pos: "adjective", en: "hopeful and confident about the future", ko: "낙관적인", example: "Try to stay optimistic about tomorrow." },
  { word: "spontaneous", pos: "adjective", en: "done naturally, without planning", ko: "즉흥적인, 자발적인", example: "We took a spontaneous weekend trip." },
  { word: "elaborate", pos: "verb", en: "to explain something in more detail", ko: "상세히 설명하다", example: "Could you elaborate on that idea?" },
  { word: "adequate", pos: "adjective", en: "enough or satisfactory for a purpose", ko: "충분한, 적절한", example: "We had adequate time to finish the task." },
  { word: "coherent", pos: "adjective", en: "logical and well organized", ko: "일관성 있는, 논리 정연한", example: "She made a coherent and convincing argument." },
  { word: "concise", pos: "adjective", en: "giving much information clearly in few words", ko: "간결한, 함축적인", example: "Keep your summary concise." },
  { word: "deliberate", pos: "adjective", en: "done intentionally and with care", ko: "의도적인, 신중한", example: "It was a deliberate and careful decision." },
  { word: "abundant", pos: "adjective", en: "existing in large quantities; plentiful", ko: "풍부한, 많은", example: "The valley has abundant natural resources." },
  { word: "reluctant", pos: "adjective", en: "unwilling and hesitant", ko: "꺼리는, 마지못한", example: "He was reluctant to leave so early." },
  { word: "sincere", pos: "adjective", en: "genuine and free from pretense", ko: "진심 어린, 진실된", example: "Please accept my sincere apology." },
  { word: "tranquil", pos: "adjective", en: "calm, quiet, and peaceful", ko: "고요한, 평온한", example: "The lake was tranquil at dawn." },
  { word: "radiant", pos: "adjective", en: "glowing brightly; full of happiness", ko: "빛나는, 환한", example: "She had a radiant smile all evening." },
  { word: "intricate", pos: "adjective", en: "very complicated or detailed", ko: "복잡한, 정교한", example: "The clock has an intricate mechanism." },
  { word: "prudent", pos: "adjective", en: "acting with care and thought for the future", ko: "신중한, 분별 있는", example: "It is prudent to save for emergencies." },
  { word: "gracious", pos: "adjective", en: "courteous, kind, and pleasant", ko: "정중한, 너그러운", example: "She was a gracious host all weekend." },
  { word: "vibrant", pos: "adjective", en: "full of energy, life, and color", ko: "활기찬, 선명한", example: "The city has a vibrant street culture." },
  { word: "novelty", pos: "noun", en: "the quality of being new and interesting", ko: "새로움, 참신함", example: "The novelty of the gadget soon wore off." },
  { word: "aspire", pos: "verb", en: "to direct one's hopes toward a goal", ko: "열망하다, 갈망하다", example: "She aspires to become a surgeon." },
  { word: "flourish", pos: "verb", en: "to grow or develop successfully", ko: "번창하다, 융성하다", example: "Small shops flourished in the old town." },
  { word: "insight", pos: "noun", en: "a deep and clear understanding", ko: "통찰력, 식견", example: "The lecture offered valuable insight." },
  { word: "perspective", pos: "noun", en: "a particular way of viewing things", ko: "관점, 시각", example: "Try to see it from my perspective." },
  { word: "endure", pos: "verb", en: "to withstand hardship; to last", ko: "견디다, 지속되다", example: "Their friendship endured for decades." },
  { word: "savor", pos: "verb", en: "to enjoy something slowly and fully", ko: "음미하다, 만끽하다", example: "Savor each bite of the meal." },
];
