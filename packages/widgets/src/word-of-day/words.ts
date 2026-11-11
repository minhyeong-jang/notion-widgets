export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "idiom";

export interface VocabWord {
  /** The headword (English). */
  word: string;
  /** IPA pronunciation. */
  phonetic: string;
  pos: PartOfSpeech;
  /** Short English definition. */
  en: string;
  /** Korean meaning. */
  ko: string;
  /** Example sentence (English). */
  example: string;
}

/**
 * Curated intermediate–advanced English vocabulary with Korean meanings.
 * Self-contained; no network required. Keep entries concise so the card
 * stays legible across every style/variant.
 */
export const WORDS: VocabWord[] = [
  { word: "serendipity", phonetic: "/ˌser.ənˈdɪp.ə.ti/", pos: "noun", en: "A pleasant discovery made by chance.", ko: "뜻밖의 행운, 우연한 발견", example: "Finding this café was pure serendipity." },
  { word: "resilient", phonetic: "/rɪˈzɪl.i.ənt/", pos: "adjective", en: "Able to recover quickly from difficulty.", ko: "회복력 있는, 탄력 있는", example: "A resilient team bounces back after setbacks." },
  { word: "eloquent", phonetic: "/ˈel.ə.kwənt/", pos: "adjective", en: "Fluent and persuasive in speech or writing.", ko: "유창한, 설득력 있는", example: "She gave an eloquent speech at the ceremony." },
  { word: "meticulous", phonetic: "/məˈtɪk.jə.ləs/", pos: "adjective", en: "Showing great attention to detail.", ko: "꼼꼼한, 세심한", example: "He kept meticulous notes of every change." },
  { word: "ephemeral", phonetic: "/ɪˈfem.ər.əl/", pos: "adjective", en: "Lasting for a very short time.", ko: "순식간의, 덧없는", example: "Cherry blossoms are beautiful but ephemeral." },
  { word: "candor", phonetic: "/ˈkæn.dɚ/", pos: "noun", en: "Honest and direct expression.", ko: "솔직함, 정직", example: "I appreciate the candor in your feedback." },
  { word: "pragmatic", phonetic: "/præɡˈmæt.ɪk/", pos: "adjective", en: "Dealing with things practically, not ideally.", ko: "실용적인, 현실적인", example: "Let's take a pragmatic approach to the budget." },
  { word: "nuance", phonetic: "/ˈnuː.ɑːns/", pos: "noun", en: "A subtle difference in meaning or tone.", ko: "미묘한 차이, 뉘앙스", example: "Translation often loses the nuance of a phrase." },
  { word: "tenacious", phonetic: "/təˈneɪ.ʃəs/", pos: "adjective", en: "Holding firmly to a goal; persistent.", ko: "끈질긴, 집요한", example: "Her tenacious effort finally paid off." },
  { word: "lucid", phonetic: "/ˈluː.sɪd/", pos: "adjective", en: "Clear and easy to understand.", ko: "명료한, 또렷한", example: "The teacher gave a lucid explanation of the theory." },
  { word: "ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", pos: "adjective", en: "Present or found everywhere.", ko: "어디에나 있는, 흔한", example: "Smartphones have become ubiquitous." },
  { word: "gregarious", phonetic: "/ɡrɪˈɡer.i.əs/", pos: "adjective", en: "Fond of company; sociable.", ko: "사교적인, 붙임성 있는", example: "He is gregarious and makes friends easily." },
  { word: "cathartic", phonetic: "/kəˈθɑːr.t̬ɪk/", pos: "adjective", en: "Providing emotional relief and release.", ko: "감정을 정화하는, 후련한", example: "Writing a journal can be cathartic." },
  { word: "astute", phonetic: "/əˈstuːt/", pos: "adjective", en: "Having sharp, accurate judgment.", ko: "기민한, 날카로운", example: "An astute investor spots trends early." },
  { word: "quintessential", phonetic: "/ˌkwɪn.təˈsen.ʃəl/", pos: "adjective", en: "Representing the most perfect example.", ko: "전형적인, 본질적인", example: "This dish is the quintessential comfort food." },
  { word: "amiable", phonetic: "/ˈeɪ.mi.ə.bəl/", pos: "adjective", en: "Having a friendly, pleasant manner.", ko: "상냥한, 호감 가는", example: "Our new neighbor is remarkably amiable." },
  { word: "diligent", phonetic: "/ˈdɪl.ɪ.dʒənt/", pos: "adjective", en: "Showing careful, steady effort.", ko: "성실한, 부지런한", example: "Diligent practice turns talent into skill." },
  { word: "profound", phonetic: "/prəˈfaʊnd/", pos: "adjective", en: "Very deep in meaning or feeling.", ko: "심오한, 깊은", example: "The film left a profound impression on me." },
  { word: "zeal", phonetic: "/ziːl/", pos: "noun", en: "Great energy and enthusiasm.", ko: "열정, 열의", example: "She pursued her studies with zeal." },
  { word: "wistful", phonetic: "/ˈwɪst.fəl/", pos: "adjective", en: "Full of gentle longing or regret.", ko: "아쉬운, 그리워하는", example: "He felt wistful looking at old photos." },
  { word: "candid", phonetic: "/ˈkæn.dɪd/", pos: "adjective", en: "Truthful and straightforward.", ko: "솔직한, 꾸밈없는", example: "Thanks for being so candid with me." },
  { word: "innovate", phonetic: "/ˈɪn.ə.veɪt/", pos: "verb", en: "To introduce new ideas or methods.", ko: "혁신하다, 쇄신하다", example: "Great companies constantly innovate." },
  { word: "savor", phonetic: "/ˈseɪ.vɚ/", pos: "verb", en: "To enjoy fully and slowly.", ko: "음미하다, 만끽하다", example: "Savor each moment of the journey." },
  { word: "aspire", phonetic: "/əˈspaɪr/", pos: "verb", en: "To aim for something great.", ko: "열망하다, 포부를 갖다", example: "She aspires to become a surgeon." },
  { word: "cultivate", phonetic: "/ˈkʌl.tə.veɪt/", pos: "verb", en: "To develop or nurture over time.", ko: "기르다, 함양하다", example: "Cultivate habits that serve your future." },
  { word: "endeavor", phonetic: "/ɪnˈdev.ɚ/", pos: "noun", en: "A serious, determined effort.", ko: "노력, 시도", example: "Learning a language is a worthy endeavor." },
  { word: "pristine", phonetic: "/ˈprɪs.tiːn/", pos: "adjective", en: "Clean and perfectly untouched.", ko: "깨끗한, 자연 그대로의", example: "The lake water was absolutely pristine." },
  { word: "vivid", phonetic: "/ˈvɪv.ɪd/", pos: "adjective", en: "Bright, clear, and lively.", ko: "생생한, 선명한", example: "I still have vivid memories of that trip." },
  { word: "humble", phonetic: "/ˈhʌm.bəl/", pos: "adjective", en: "Modest; not proud or arrogant.", ko: "겸손한, 소박한", example: "Despite his success, he stayed humble." },
  { word: "radiant", phonetic: "/ˈreɪ.di.ənt/", pos: "adjective", en: "Shining brightly; glowing with joy.", ko: "빛나는, 환한", example: "She had a radiant smile that morning." },
  { word: "ponder", phonetic: "/ˈpɑːn.dɚ/", pos: "verb", en: "To think about carefully.", ko: "곰곰이 생각하다, 숙고하다", example: "He paused to ponder the question." },
  { word: "flourish", phonetic: "/ˈflɝː.ɪʃ/", pos: "verb", en: "To grow or develop successfully.", ko: "번성하다, 번창하다", example: "Plants flourish in the spring sun." },
  { word: "earnest", phonetic: "/ˈɝː.nɪst/", pos: "adjective", en: "Serious and sincere in intention.", ko: "진지한, 성실한", example: "She made an earnest effort to help." },
  { word: "ingenious", phonetic: "/ɪnˈdʒiː.njəs/", pos: "adjective", en: "Cleverly inventive and original.", ko: "기발한, 독창적인", example: "What an ingenious solution to the puzzle!" },
  { word: "tranquil", phonetic: "/ˈtræŋ.kwɪl/", pos: "adjective", en: "Calm, peaceful, and quiet.", ko: "고요한, 평온한", example: "The garden was tranquil at dawn." },
  { word: "versatile", phonetic: "/ˈvɝː.sə.t̬əl/", pos: "adjective", en: "Able to adapt to many functions.", ko: "다재다능한, 다용도의", example: "A versatile tool fits many jobs." },
  { word: "empathy", phonetic: "/ˈem.pə.θi/", pos: "noun", en: "The ability to share others' feelings.", ko: "공감, 감정이입", example: "Good leaders lead with empathy." },
  { word: "momentum", phonetic: "/moʊˈmen.t̬əm/", pos: "noun", en: "Force gained by continued motion.", ko: "탄력, 추진력", example: "The project gained momentum this week." },
  { word: "whimsical", phonetic: "/ˈwɪm.zɪ.kəl/", pos: "adjective", en: "Playfully quirky and fanciful.", ko: "기발한, 엉뚱한", example: "The shop had a whimsical, dreamy decor." },
  { word: "steadfast", phonetic: "/ˈsted.fæst/", pos: "adjective", en: "Firmly loyal and unwavering.", ko: "변함없는, 확고한", example: "A steadfast friend stays through hard times." },
  { word: "luminous", phonetic: "/ˈluː.mə.nəs/", pos: "adjective", en: "Giving off light; glowing.", ko: "빛나는, 환히 빛나는", example: "The moon was luminous over the sea." },
  { word: "bolster", phonetic: "/ˈboʊl.stɚ/", pos: "verb", en: "To support or strengthen.", ko: "북돋우다, 강화하다", example: "Kind words bolster our confidence." },
  { word: "mellow", phonetic: "/ˈmel.oʊ/", pos: "adjective", en: "Soft, relaxed, and smooth.", ko: "부드러운, 여유로운", example: "We spent a mellow evening by the fire." },
  { word: "foster", phonetic: "/ˈfɑː.stɚ/", pos: "verb", en: "To encourage the growth of.", ko: "조성하다, 육성하다", example: "Schools should foster curiosity." },
  { word: "adept", phonetic: "/əˈdept/", pos: "adjective", en: "Very skilled or proficient.", ko: "능숙한, 숙련된", example: "She is adept at solving tricky problems." },
  { word: "serene", phonetic: "/səˈriːn/", pos: "adjective", en: "Calm, peaceful, and untroubled.", ko: "고요한, 평온한", example: "A serene lake mirrored the sky." },
  { word: "vigor", phonetic: "/ˈvɪɡ.ɚ/", pos: "noun", en: "Physical or mental energy and strength.", ko: "활력, 원기", example: "He tackled the task with fresh vigor." },
  { word: "benevolent", phonetic: "/bəˈnev.əl.ənt/", pos: "adjective", en: "Kind and generous toward others.", ko: "자애로운, 인자한", example: "A benevolent mentor changed her life." },
  { word: "curate", phonetic: "/kjəˈreɪt/", pos: "verb", en: "To carefully select and organize.", ko: "선별하다, 큐레이션하다", example: "He curated a playlist for the trip." },
  { word: "aplomb", phonetic: "/əˈplɑːm/", pos: "noun", en: "Confidence and composure under pressure.", ko: "침착함, 태연함", example: "She handled the crisis with aplomb." },
];
