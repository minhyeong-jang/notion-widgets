export interface Quote {
  text: string;
  author: string;
  title: string;
}

/**
 * Get quotes array for a given BCP 47 locale.
 * Falls back to English for unsupported languages.
 */
export function getQuotes(locale: string): Quote[] {
  const lang = locale.slice(0, 2);
  switch (lang) {
    case "ko": return quotesKo;
    case "ja": return quotesJa;
    case "zh": return quotesCn;
    case "de": return quotesDe;
    case "fr": return quotesFr;
    case "es": return quotesEs;
    default: return quotesEn;
  }
}

export const quotesKo: Quote[] = [
  // 한국 속담 / 고전
  { text: "시작이 반이다.", author: "한국 속담", title: "" },
  { text: "천 리 길도 한 걸음부터.", author: "노자", title: "도가 사상가" },
  { text: "실패는 성공의 어머니다.", author: "한국 속담", title: "" },
  { text: "노력 없이 얻어지는 것은 없다.", author: "한국 속담", title: "" },
  { text: "아는 것이 힘이다.", author: "프랜시스 베이컨", title: "영국 철학자" },
  { text: "배움에는 왕도가 없다.", author: "유클리드", title: "고대 그리스 수학자" },

  // 동양 사상가
  { text: "가장 큰 영광은 한 번도 실패하지 않음이 아니라, 실패할 때마다 일어서는 데에 있다.", author: "공자", title: "중국 사상가" },
  { text: "뜻이 있는 곳에 길이 있다.", author: "맹자", title: "유교 사상가" },
  { text: "자기 자신을 아는 것이 모든 지혜의 시작이다.", author: "아리스토텔레스", title: "고대 그리스 철학자" },
  { text: "부드러운 것이 강한 것을 이긴다.", author: "노자", title: "도가 사상가" },

  // 서양 철학자 / 과학자
  { text: "인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다.", author: "알베르트 아인슈타인", title: "물리학자" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린", title: "미국 건국의 아버지" },
  { text: "꿈을 이루고자 하는 의지가 있는 곳에 길이 있다.", author: "에이브러햄 링컨", title: "미국 16대 대통령" },
  { text: "현재를 즐겨라. 미래는 아직 오지 않았다.", author: "호라티우스", title: "로마 시인" },
  { text: "작은 기회로부터 종종 위대한 업적이 시작된다.", author: "데모스테네스", title: "고대 그리스 웅변가" },
  { text: "위대한 일은 작은 일들의 연속이다.", author: "빈센트 반 고흐", title: "네덜란드 화가" },
  { text: "행복은 습관이다. 그것을 몸에 지니라.", author: "엘버트 허버드", title: "미국 작가" },
  { text: "모든 성취의 출발점은 갈망이다.", author: "나폴레온 힐", title: "성공학 저자" },
  { text: "나는 생각한다, 고로 존재한다.", author: "르네 데카르트", title: "프랑스 철학자" },
  { text: "삶이 있는 한 희망은 있다.", author: "키케로", title: "로마 정치가" },

  // 한국 인물
  { text: "될 때까지 하면 안 될 일이 없다.", author: "정주영", title: "현대그룹 창업자" },
  { text: "나는 우리나라가 세계에서 가장 아름다운 나라가 되기를 원한다.", author: "김구", title: "대한민국 독립운동가" },
  { text: "사람이 먼저다.", author: "유일한", title: "유한양행 창업자" },
  { text: "이봐, 해봤어?", author: "정주영", title: "현대그룹 창업자" },

  // 문학가
  { text: "겨울이 오면 봄이 멀지 않으리.", author: "퍼시 셸리", title: "영국 시인" },
  { text: "행복의 문이 하나 닫히면 다른 문이 열린다.", author: "헬렌 켈러", title: "미국 작가·사회운동가" },
  { text: "우리가 두려워해야 할 것은 두려움 그 자체뿐이다.", author: "프랭클린 D. 루스벨트", title: "미국 32대 대통령" },
  { text: "단순한 삶은 그 자체로 풍요롭다.", author: "헨리 데이비드 소로", title: "미국 작가·철학자" },

  // 현대 리더
  { text: "혁신은 리더와 추종자를 구분 짓는다.", author: "스티브 잡스", title: "Apple 창업자" },
  { text: "가장 큰 위험은 아무런 위험도 감수하지 않는 것이다.", author: "마크 저커버그", title: "Meta 창업자" },
  { text: "미래를 예측하는 가장 좋은 방법은 미래를 만드는 것이다.", author: "앨런 케이", title: "컴퓨터 과학자" },
  { text: "완벽보다 완성이 낫다.", author: "셰릴 샌드버그", title: "Meta COO" },
  { text: "매일 조금씩 나아지면 결국 큰 변화를 이룬다.", author: "존 우든", title: "전설적 농구 코치" },

  // 예술가
  { text: "상상력은 지식보다 중요하다.", author: "알베르트 아인슈타인", title: "물리학자" },
  { text: "예술은 우리에게 진실을 깨닫게 하는 거짓말이다.", author: "파블로 피카소", title: "스페인 화가" },
  { text: "모든 아이는 예술가다. 문제는 어른이 되어서도 예술가로 남는 것이다.", author: "파블로 피카소", title: "스페인 화가" },

  // 동기부여
  { text: "오늘 걷지 않으면 내일은 뛰어야 한다.", author: "한국 속담", title: "" },
  { text: "포기하지 마라. 지금 포기하면 그동안의 노력이 물거품이 된다.", author: "한국 속담", title: "" },
  { text: "작게 시작하라. 그러나 꿈은 크게 가져라.", author: "스티브 잡스", title: "Apple 창업자" },
  { text: "삶은 가까이서 보면 비극이지만, 멀리서 보면 희극이다.", author: "찰리 채플린", title: "영국 배우·감독" },
];

export const quotesEn: Quote[] = [
  // Tech / Business leaders
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", title: "Co-founder of Apple" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", title: "Co-founder of Apple" },
  { text: "Move fast and break things.", author: "Mark Zuckerberg", title: "Founder of Meta" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg", title: "Founder of Meta" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", title: "Co-founder of Apple" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg", title: "COO of Meta" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", title: "Computer Scientist" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", title: "Co-founder of Apple" },
  { text: "It's not about ideas. It's about making ideas happen.", author: "Scott Belsky", title: "Co-founder of Behance" },

  // Scientists
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", title: "Physicist" },
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein", title: "Physicist" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", title: "Physicist" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein", title: "Physicist" },

  // Presidents / World leaders
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", title: "26th U.S. President" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", title: "26th U.S. President" },
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt", title: "32nd U.S. President" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", title: "First Lady & Activist" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", title: "16th U.S. President" },

  // Philosophers / Thinkers
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", title: "Chinese Philosopher" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", title: "Chinese Philosopher" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", title: "Greek Philosopher" },
  { text: "I think, therefore I am.", author: "René Descartes", title: "French Philosopher" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", title: "German Philosopher" },
  { text: "The unexamined life is not worth living.", author: "Socrates", title: "Greek Philosopher" },

  // Writers / Artists
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson", title: "American Essayist" },
  { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso", title: "Spanish Painter" },
  { text: "If winter comes, can spring be far behind?", author: "Percy Bysshe Shelley", title: "English Poet" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", title: "Irish Poet & Playwright" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", title: "Italian Polymath" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", title: "Musician, The Beatles" },

  // Motivation / Self-help
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", title: "" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", title: "British Prime Minister" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", title: "Ice Hockey Legend" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", title: "American Author" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", title: "American Psychologist" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", title: "Tibetan Spiritual Leader" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", title: "Motivational Speaker" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", title: "Life Coach & Author" },
  { text: "When one door of happiness closes, another opens.", author: "Helen Keller", title: "Author & Activist" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma", title: "Leadership Author" },
  { text: "Life is a tragedy when seen in close-up, but a comedy in long-shot.", author: "Charlie Chaplin", title: "Actor & Filmmaker" },
];

export const quotesJa: Quote[] = [
  { text: "千里の道も一歩から。", author: "老子", title: "道家の思想家" },
  { text: "為せば成る、為さねば成らぬ何事も。", author: "上杉鷹山", title: "米沢藩主" },
  { text: "努力は必ず報われる。もし報われない努力があるのならば、それはまだ努力と呼べない。", author: "王貞治", title: "元プロ野球選手" },
  { text: "人生に失敗した人の多くは、諦めた時にどれだけ成功に近づいていたかに気づかなかった人たちだ。", author: "トーマス・エジソン", title: "発明家" },
  { text: "夢を見ることができれば、それは実現できる。", author: "ウォルト・ディズニー", title: "ディズニー創業者" },
  { text: "今日という日は、残りの人生の最初の日である。", author: "チャールズ・ディードリッヒ", title: "アメリカの著者" },
  { text: "困難の中にこそ、チャンスがある。", author: "アルベルト・アインシュタイン", title: "物理学者" },
  { text: "自分自身を知ることは、すべての知恵の始まりである。", author: "アリストテレス", title: "ギリシャの哲学者" },
  { text: "想像力は知識よりも重要だ。", author: "アルベルト・アインシュタイン", title: "物理学者" },
  { text: "七転び八起き。", author: "日本のことわざ", title: "" },
  { text: "継続は力なり。", author: "日本のことわざ", title: "" },
  { text: "一期一会。", author: "井伊直弼", title: "大老・茶人" },
  { text: "花は盛りに、月は隈なきをのみ見るものかは。", author: "吉田兼好", title: "随筆家" },
  { text: "明日死ぬかのように生きよ。永遠に生きるかのように学べ。", author: "マハトマ・ガンジー", title: "インド独立の父" },
  { text: "偉大なことは、小さなことの積み重ねで生まれる。", author: "フィンセント・ファン・ゴッホ", title: "オランダの画家" },
  { text: "行動は言葉よりも雄弁である。", author: "英語のことわざ", title: "" },
];

export const quotesCn: Quote[] = [
  { text: "千里之行，始于足下。", author: "老子", title: "道家思想家" },
  { text: "学而不思则罔，思而不学则殆。", author: "孔子", title: "儒家思想家" },
  { text: "三人行，必有我师焉。", author: "孔子", title: "儒家思想家" },
  { text: "知之者不如好之者，好之者不如乐之者。", author: "孔子", title: "儒家思想家" },
  { text: "天将降大任于是人也，必先苦其心志。", author: "孟子", title: "儒家思想家" },
  { text: "不积跬步，无以至千里。", author: "荀子", title: "儒家思想家" },
  { text: "业精于勤，荒于嬉。", author: "韩愈", title: "唐代文学家" },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原", title: "战国诗人" },
  { text: "宝剑锋从磨砺出，梅花香自苦寒来。", author: "中国谚语", title: "" },
  { text: "世上无难事，只怕有心人。", author: "中国谚语", title: "" },
  { text: "失败乃成功之母。", author: "中国谚语", title: "" },
  { text: "书山有路勤为径，学海无涯苦作舟。", author: "韩愈", title: "唐代文学家" },
  { text: "想象力比知识更重要。", author: "阿尔伯特·爱因斯坦", title: "物理学家" },
  { text: "生活就像骑自行车，要保持平衡就得不断前进。", author: "阿尔伯特·爱因斯坦", title: "物理学家" },
  { text: "做你能做的，用你所有的，在你所在的地方。", author: "西奥多·罗斯福", title: "美国第26任总统" },
  { text: "己所不欲，勿施于人。", author: "孔子", title: "儒家思想家" },
];

export const quotesDe: Quote[] = [
  { text: "Der Weg ist das Ziel.", author: "Konfuzius", title: "Chinesischer Philosoph" },
  { text: "Phantasie ist wichtiger als Wissen.", author: "Albert Einstein", title: "Physiker" },
  { text: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", author: "Bertolt Brecht", title: "Dramatiker" },
  { text: "Es ist nicht genug zu wissen, man muss auch anwenden.", author: "Johann Wolfgang von Goethe", title: "Dichter" },
  { text: "Nur wer sein Ziel kennt, findet den Weg.", author: "Chinesisches Sprichwort", title: "" },
  { text: "Man muss das Unmögliche versuchen, um das Mögliche zu erreichen.", author: "Hermann Hesse", title: "Schriftsteller" },
  { text: "Ich denke, also bin ich.", author: "René Descartes", title: "Französischer Philosoph" },
  { text: "Das Leben ist wie Fahrrad fahren. Um die Balance zu halten, musst du in Bewegung bleiben.", author: "Albert Einstein", title: "Physiker" },
  { text: "Anfangen ist leicht, Beharren eine Kunst.", author: "Deutsches Sprichwort", title: "" },
  { text: "In der Mitte der Schwierigkeit liegt die Möglichkeit.", author: "Albert Einstein", title: "Physiker" },
  { text: "Was du heute kannst besorgen, das verschiebe nicht auf morgen.", author: "Deutsches Sprichwort", title: "" },
  { text: "Jeder ist seines Glückes Schmied.", author: "Deutsches Sprichwort", title: "" },
  { text: "Die Kunst ist lang, das Leben kurz.", author: "Johann Wolfgang von Goethe", title: "Dichter" },
  { text: "Wer immer tut, was er schon kann, bleibt immer das, was er schon ist.", author: "Henry Ford", title: "Gründer von Ford" },
  { text: "Einfachheit ist die höchste Stufe der Vollendung.", author: "Leonardo da Vinci", title: "Universalgelehrter" },
  { text: "Übung macht den Meister.", author: "Deutsches Sprichwort", title: "" },
];

export const quotesFr: Quote[] = [
  { text: "Je pense, donc je suis.", author: "René Descartes", title: "Philosophe" },
  { text: "L'imagination est plus importante que le savoir.", author: "Albert Einstein", title: "Physicien" },
  { text: "La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre.", author: "Albert Einstein", title: "Physicien" },
  { text: "Il n'y a qu'une façon d'échouer, c'est d'abandonner avant d'avoir réussi.", author: "Georges Clemenceau", title: "Homme d'État français" },
  { text: "Le seul vrai voyage, c'est de changer de regard.", author: "Marcel Proust", title: "Écrivain" },
  { text: "L'art est le mensonge qui nous permet de connaître la vérité.", author: "Pablo Picasso", title: "Peintre espagnol" },
  { text: "Rien ne se perd, rien ne se crée, tout se transforme.", author: "Antoine Lavoisier", title: "Chimiste" },
  { text: "Vouloir, c'est pouvoir.", author: "Proverbe français", title: "" },
  { text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.", author: "Dalaï-Lama", title: "Chef spirituel tibétain" },
  { text: "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.", author: "Antoine de Saint-Exupéry", title: "Écrivain & Aviateur" },
  { text: "La simplicité est la sophistication suprême.", author: "Léonard de Vinci", title: "Génie universel" },
  { text: "Qui n'avance pas, recule.", author: "Proverbe français", title: "" },
  { text: "Le succès, c'est tomber sept fois et se relever huit.", author: "Proverbe japonais", title: "" },
  { text: "Il faut cultiver notre jardin.", author: "Voltaire", title: "Philosophe des Lumières" },
  { text: "Chaque saint a un passé et chaque pécheur a un avenir.", author: "Oscar Wilde", title: "Poète & Dramaturge" },
  { text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs", title: "Cofondateur d'Apple" },
];

export const quotesEs: Quote[] = [
  { text: "La imaginación es más importante que el conocimiento.", author: "Albert Einstein", title: "Físico" },
  { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs", title: "Cofundador de Apple" },
  { text: "La vida es lo que pasa mientras estás ocupado haciendo otros planes.", author: "John Lennon", title: "Músico, The Beatles" },
  { text: "En medio de la dificultad reside la oportunidad.", author: "Albert Einstein", title: "Físico" },
  { text: "No importa lo lento que vayas, siempre y cuando no te detengas.", author: "Confucio", title: "Filósofo chino" },
  { text: "Sé el cambio que deseas ver en el mundo.", author: "Mahatma Gandhi", title: "Líder independentista" },
  { text: "El que no arriesga, no gana.", author: "Proverbio español", title: "" },
  { text: "Cree que puedes y ya estás a medio camino.", author: "Theodore Roosevelt", title: "26° Presidente de EE.UU." },
  { text: "La simplicidad es la máxima sofisticación.", author: "Leonardo da Vinci", title: "Polímata italiano" },
  { text: "Pienso, luego existo.", author: "René Descartes", title: "Filósofo francés" },
  { text: "El arte es la mentira que nos permite conocer la verdad.", author: "Pablo Picasso", title: "Pintor español" },
  { text: "Cada día sabemos más y entendemos menos.", author: "Proverbio", title: "" },
  { text: "La felicidad no es algo hecho. Viene de tus propias acciones.", author: "Dalái Lama", title: "Líder espiritual tibetano" },
  { text: "Vive como si fueras a morir mañana. Aprende como si fueras a vivir para siempre.", author: "Mahatma Gandhi", title: "Líder independentista" },
  { text: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor de continuar.", author: "Winston Churchill", title: "Primer Ministro británico" },
  { text: "Más vale tarde que nunca.", author: "Proverbio español", title: "" },
];
