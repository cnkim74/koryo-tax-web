/**
 * 사이트 전역 콘텐츠. 문구 수정은 대부분 이 파일 하나만 고치면 됩니다.
 */

export const site = {
  name: "고려세무법인",
  branch: "용인점",
  tagline: "절세는 목표가 아니라 시작입니다",
  description:
    "세무기장 · 상속·증여 · 자산설계. 지켜낸 자산을 키우고, 그 가치를 다음 세대로 이어가는 고려세무법인 용인점입니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thetaxplus.com",
  domainLabel: "www.thetaxplus.com",
  /**
   * 임시 미리보기 배포에서 검색엔진 색인을 막습니다.
   * (workers.dev 주소가 색인되면 실제 도메인과 중복 콘텐츠가 됩니다.)
   * 빌드할 때 NEXT_PUBLIC_NOINDEX=1 을 주면 켜집니다.
   */
  noindex: process.env.NEXT_PUBLIC_NOINDEX === "1",
} as const;

export const nav = [
  { href: "/#tax", label: "세무기장" },
  { href: "/#inherit", label: "상속·증여" },
  { href: "/#asset", label: "자산설계" },
  { href: "/#about", label: "법인소개" },
  { href: "/blog", label: "세무칼럼" },
  { href: "/#contact", label: "상담안내" },
] as const;

export const hero = {
  titleLines: ["절세는 목표가 아니라", "시작입니다."],
  body: [
    "세무기장 · 상속·증여 · 자산설계",
    "지켜낸 자산을 키우고, 그 가치를 다음 세대로 이어갑니다.",
  ],
  primaryCta: { href: "#contact", label: "상담 문의하기" },
  secondaryCta: { href: "#tax", label: "서비스 살펴보기" },
} as const;

export const services = {
  tax: {
    id: "tax",
    icon: "tax" as const,
    eyebrow: "세무기장",
    titleLines: ["사업을 알아야,", "제대로 된 절세가 시작됩니다."],
    paragraphs: [
      "같은 매출, 같은 이익이라도 사업의 구조와 대표자의 상황에 따라 세금 전략은 달라져야 합니다.",
      "고려세무법인은 단순히 장부를 작성하고 신고하는 데 그치지 않습니다.",
      "고객의 사업과 업종을 이해하고, 매출·비용·자금흐름을 함께 살펴 각 기업에 맞는 세무전략을 설계합니다.",
    ],
  },
  inherit: {
    id: "inherit",
    icon: "gift" as const,
    eyebrow: "상속·증여",
    titleLines: ["재산을 물려주는 것에도", "순서와 시간이 필요합니다."],
    paragraphsHtml: [
      "<strong>언제, 무엇을, 어떻게</strong> 이전하느냐에 따라 상속·증여의 결과는 달라집니다.",
      "자산의 종류와 규모, 가족의 상황을 함께 살펴 현재의 세금부터 향후 상속까지 고려한 이전 전략을 제시합니다.",
    ],
  },
  asset: {
    id: "asset",
    icon: "home" as const,
    eyebrow: "자산설계",
    titleLines: ["절세한 돈,", "그다음이 더 중요합니다."],
    paragraphs: [
      "세금을 줄였다고 자산이 저절로 늘어나는 것은 아닙니다.",
      "현재의 소득과 재산을 어떻게 관리하고 운용하느냐에 따라 미래의 자산은 달라집니다.",
      "세금, 재무, 금융을 하나의 관점에서 연결하여 장기적으로 자산이 성장하는 구조를 설계합니다.",
    ],
  },
} as const;

export const about = {
  id: "about",
  eyebrow: "법인소개",
  titleLines: ["세금 그 이상의 가치를 만드는", "고려세무법인"],
  paragraphs: [
    "고려세무법인은 세금 신고만을 우리의 역할로 생각하지 않습니다.",
    "사업과 사람을 이해하고, 세금 너머의 자산까지 함께 생각합니다.",
    "고객의 더 나은 선택이 더 큰 가치로 이어지도록 함께하겠습니다.",
  ],
  principal: {
    eyebrow: "대표세무사 소개",
    name: "박소영",
    title: "고려세무법인 용인점 대표 박소영",
    /**
     * 대표세무사 프로필 사진.
     * public/ 에 파일을 넣고 경로를 채우면 법인소개 섹션에 크게 표시됩니다.
     * null 이면 사진 없이 텍스트만 나옵니다.
     */
    photo: "/park-soyoung.webp" as string | null,
    /** 웹P 미지원 브라우저용 */
    photoFallback: "/park-soyoung.jpg",
    photoAlt: "고려세무법인 용인점 대표세무사 박소영",
    /** 실제 픽셀 크기 (로딩 중 레이아웃 밀림 방지) */
    photoWidth: 960,
    photoHeight: 1279,
    groups: [
      {
        heading: "전문분야",
        items: [
          "사업가·자산가를 위한 절세컨설팅",
          "나와 가족을 위한 자산설계",
        ],
      },
      {
        heading: "주요경력",
        items: [
          "고려세무법인 용인(구 서초)점 대표세무사",
          "Rich Divine FP/컨설턴트",
          "공공경제타임즈 보도국 기자",
          "삼성세무서 국세심사위원회 위원",
          "한국여성세무사회 제20대 홍보이사",
          "고려세무법인 본점 세무사",
          "㈜대교홀딩스 투자전략실, 경영지원실",
        ],
      },
      {
        heading: "학력 및 자격",
        items: [
          "연세대학교 경영전문대학원 경영학석사 (MBA)",
          "제51회 세무사시험 합격",
        ],
      },
    ],
  },
} as const;

export type Office = {
  key: string;
  name: string;
  tel: string;
  telHref: string;
  address: string;
  transit: string;
  parking: string;
  lat: number;
  lng: number;
  mapLabel: string;
  /** 카카오맵에 등록된 장소 ID. 길찾기/상세 링크에 씁니다. */
  kakaoPlaceId: string;
  /** 네이버 지도 검색어 */
  naverQuery: string;
};

/** 방문자의 카카오맵 앱(또는 웹)에서 바로 길찾기가 열립니다. API 키가 필요 없습니다. */
export const kakaoDirectionsUrl = (o: Office) =>
  `https://map.kakao.com/link/to/${o.kakaoPlaceId}`;

export const kakaoPlaceUrl = (o: Office) =>
  `https://place.map.kakao.com/${o.kakaoPlaceId}`;

export const naverMapUrl = (o: Office) =>
  `https://map.naver.com/p/search/${encodeURIComponent(o.naverQuery)}`;

export const offices: Office[] = [
  {
    key: "yongin",
    name: "용인점",
    tel: "031-336-2888",
    telHref: "tel:031-336-2888",
    address: "경기도 용인시 처인구 중부대로 1136, 201호 (삼가동)",
    transit: "에버라인 삼가역 2번 출구에서 도보 약 7분",
    parking: "건물 내 가능",
    lat: 37.2401,
    lng: 127.1837,
    mapLabel: "중부대로 1136, 201호",
    kakaoPlaceId: "935860103",
    naverQuery: "고려세무법인 용인점",
  },
  {
    key: "seoul",
    name: "서울 본점",
    tel: "02-523-3888",
    telHref: "tel:02-523-3888",
    address: "서울특별시 서초구 서초대로51길 14, 203호 (서초동, JH엘 로펌애비뉴 빌딩)",
    transit: "2호선, 3호선 서초역 6번 출구에서 도보 약 5분",
    parking: "건물 내 가능",
    lat: 37.4926,
    lng: 127.0076,
    mapLabel: "서초대로51길 14, 203호",
    kakaoPlaceId: "19113839",
    naverQuery: "고려세무법인 서초",
  },
];

/**
 * 카카오톡 채널. 국내 고객은 전화보다 카톡 문의를 훨씬 편하게 여깁니다.
 * chat 경로로 들어가면 채널 홈을 거치지 않고 바로 대화창이 열립니다.
 */
export const kakaoChannel = {
  name: "고려세무법인",
  home: "https://pf.kakao.com/_hCUwG",
  chat: "https://pf.kakao.com/_hCUwG/chat",
  /** 카카오 공식 버튼 색. 브랜드 금색과 별개로 서비스 식별색이라 그대로 씁니다. */
  brandBg: "#FEE500",
  brandFg: "#191600",
} as const;

export const contact = {
  id: "contact",
  eyebrow: "상담안내",
  title: "편하게 문의주세요.",
  body: "상담을 통해 현재의 문제를 해결하는 것에서 그치지 않고 앞으로 무엇을 준비해야 하는지까지 함께 제안합니다.",
} as const;

export const inquiryTopics = [
  "세무기장 / 법인·개인사업자",
  "상속·증여 설계",
  "자산설계 / 재무상담",
  "양도소득세",
  "세무조사 대응",
  "기타 문의",
] as const;
