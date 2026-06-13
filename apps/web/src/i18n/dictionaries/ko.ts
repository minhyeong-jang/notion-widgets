export interface Dictionary {
  meta: {
    siteName: string;
    siteDescription: string;
    galleryTitle: string;
    galleryDescription: string;
  };
  hero: {
    badge: string;
    headingLine1: string;
    headingLine2: string;
    headingHighlight: string;
    heading1: string;
    heading2: string;
    heading3: string;
    headingAccent: string;
    subtitle: string;
    subtitleLine2: string;
    cta: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  featured: {
    kicker: string;
    title: string;
    description: string;
    seeAll: string;
    galleryCta: string;
    galleryCtaLink: string;
  };
  gallery: {
    title: string;
    description: string;
    comingSoon: string;
    customize: string;
    viewAll: string;
    filterAll: string;
    pageTitle: string;
    pageDescription: string;
  };
  categories: {
    time: string;
    productivity: string;
    lifestyle: string;
    utility: string;
  };
  howItWorks: {
    kicker: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  footer: {
    madeWith: string;
    madeBy: string;
  };
  customizer: {
    backToGallery: string;
    breadcrumbGallery: string;
    customization: string;
    livePreview: string;
    liveLabel: string;
    customize: string;
    customizeDesc: string;
    embedUrl: string;
    copyUrl: string;
    copied: string;
    embedInstruction: string;
    embedNote: string;
    relatedWidgets: string;
    recommended: string;
    widgetNotFound: string;
  };
  feedback: {
    kicker: string;
    title: string;
    description: string;
  };
  controlGroups: {
    appearance: string;
    color: string;
    content: string;
    advanced: string;
  };
  language: {
    ko: string;
    en: string;
  };
  common: {
    home: string;
    widgets: string;
  };
}

const ko: Dictionary = {
  meta: {
    siteName: "Notion Widgets",
    siteDescription: "가입 없이, URL 하나로 완성하는 아름다운 Notion 위젯",
    galleryTitle: "위젯 갤러리 | Notion Widgets",
    galleryDescription:
      "Notion 페이지를 위한 무료 위젯 모음. 시계, 진행률, D-Day, 명언, 포모도로 등.",
  },

  hero: {
    badge: "감도 높은 Notion",
    headingLine1: "가입 없이,",
    headingLine2: "URL 하나로 완성하는",
    headingHighlight: "Notion 위젯",
    heading1: "가입 없이,",
    heading2: "URL 하나로 완성하는",
    heading3: "Notion",
    headingAccent: "위젯",
    subtitle: "30초면 충분합니다. 위젯을 골라 커스터마이즈하고,",
    subtitleLine2: "URL을 복사해 Notion에 붙여넣으세요.",
    cta: "위젯 둘러보기",
    ctaPrimary: "위젯 둘러보기",
    ctaSecondary: "사용법 보기",
    scroll: "스크롤",
  },

  featured: {
    kicker: "FEATURED",
    title: "자주 쓰는 위젯",
    description: "가장 사랑받는 위젯들을 추렸어요. 전체 목록은 갤러리에서.",
    seeAll: "전체 {count}개 보기",
    galleryCta: "시계 · 진행률 · D-Day · 날씨 · 명언 외 {count}개 더",
    galleryCtaLink: "전체 위젯 갤러리",
  },

  gallery: {
    title: "위젯 갤러리",
    description:
      "Notion 페이지에 어울리는 위젯을 선택하고, 원하는 대로 꾸며보세요.",
    comingSoon: "더 많은 위젯이 곧 추가됩니다",
    customize: "커스터마이즈",
    viewAll: "전체 보기",
    filterAll: "전체",
    pageTitle: "모든 위젯",
    pageDescription: "Notion에 임베드할 수 있는 모든 위젯을 둘러보세요.",
  },

  categories: {
    time: "시간",
    productivity: "생산성",
    lifestyle: "라이프스타일",
    utility: "유틸리티",
  },

  howItWorks: {
    kicker: "HOW IT WORKS",
    title: "이렇게 사용하세요",
    subtitle: "3단계만 따라하면 Notion에 위젯이 완성됩니다.",
    step1Title: "위젯을 선택하세요",
    step1Desc:
      "갤러리에서 마음에 드는 위젯을 골라보세요. 시계, 진행률, D-Day 등 다양한 위젯이 준비되어 있습니다.",
    step2Title: "원하는 대로 꾸미세요",
    step2Desc:
      "색상, 크기, 표시 옵션 등을 자유롭게 설정하세요. 모든 설정은 URL에 저장되어 별도의 가입이 필요 없습니다.",
    step3Title: "URL을 복사해 Notion에 붙여넣으세요",
    step3Desc:
      "생성된 URL을 복사하세요. Notion에서 /embed 명령어로 붙여넣기만 하면 완성입니다.",
  },

  footer: {
    madeWith: "by doriri",
    madeBy: "made by doriri",
  },

  customizer: {
    backToGallery: "위젯 갤러리",
    breadcrumbGallery: "위젯 갤러리",
    customization: "커스터마이징",
    livePreview: "Live Preview",
    liveLabel: "실시간",
    customize: "커스터마이징",
    customizeDesc: "설정은 URL에 저장됩니다. 가입이 필요 없어요.",
    embedUrl: "임베드 URL",
    copyUrl: "URL 복사",
    copied: "복사됨!",
    embedInstruction:
      "Notion에서 /embed 블록을 추가한 뒤 위 URL을 붙여넣으세요",
    embedNote:
      "Notion에서 /embed 블록을 추가한 뒤 위 URL을 붙여넣으세요.",
    relatedWidgets: "같은 카테고리의 다른 위젯",
    recommended: "권장",
    widgetNotFound: "위젯을 찾을 수 없습니다",
  },

  feedback: {
    kicker: "FEEDBACK",
    title: "제보 · 피드백",
    description:
      "위젯 사용 중 불편하셨던 점이나 새로 필요한 위젯이 있다면 알려주세요.",
  },

  controlGroups: {
    appearance: "외관",
    color: "색상",
    content: "콘텐츠",
    advanced: "고급",
  },

  language: {
    ko: "한국어",
    en: "English",
  },

  common: {
    home: "홈",
    widgets: "위젯",
  },
};

export default ko;
