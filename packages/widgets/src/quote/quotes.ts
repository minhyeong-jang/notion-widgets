export interface Quote {
  text: string;
  author: string;
  title: string; // 한 줄 소개 (e.g. "현대그룹 창업자", "Physicist")
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
  { text: "자기 자신을 아는 것이 모든 지혜의 시작이다.", author: "노자", title: "도가 사상가" },
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
  { text: "사람이 먼저다.", author: "유한양행 사훈", title: "유일한 창업 철학" },
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
