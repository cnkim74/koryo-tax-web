/**
 * 사이트 전역 콘텐츠. 문구 수정은 대부분 이 파일 하나만 고치면 됩니다.
 */

export const site = {
  name: "고려세무법인",
  branch: "용인점",
  tagline: "세금을 넘어, 자산을 설계합니다",
  description:
    "세무기장 · 상속·증여 · 자산설계. 고객의 현재와 미래를 함께 설계하는 고려세무법인 용인점입니다.",
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
  titleLines: ["세금을 넘어,", "자산을 설계합니다"],
  body: [
    "세무기장 · 상속·증여 · 자산설계",
    "고객의 현재와 미래를 함께 설계하는 고려세무법인입니다.",
  ],
  primaryCta: { href: "#contact", label: "상담 문의하기" },
  secondaryCta: { href: "#tax", label: "서비스 살펴보기" },
} as const;

export const services = {
  tax: {
    id: "tax",
    eyebrow: "세무기장",
    titleLines: ["사업을 알아야,", "제대로 된 절세가 시작됩니다."],
    paragraphs: [
      "같은 매출, 같은 이익이라도 사업의 구조와 대표자의 상황에 따라 세금 전략은 달라져야 합니다.",
      "고려세무법인은 단순히 장부를 작성하고 신고하는 데 그치지 않습니다.",
      "고객의 사업과 업종을 이해하고 매출·비용·인건비·자금흐름을 함께 살펴 각 기업에 맞는 세무전략을 설계합니다.",
    ],
    callout: {
      lines: [
        "정확한 기장에서 정확한 진단이 나오고,",
        "정확한 진단에서 좋은 절세전략이 나옵니다.",
      ],
      footnote: "고려세무법인과 함께하세요.",
    },
  },
  inherit: {
    id: "inherit",
    eyebrow: "상속·증여",
    titleLines: ["재산을 물려주는 것에도", "순서와 시간이 필요합니다."],
    paragraphsHtml: [
      "상속·증여는 세금이 발생한 뒤 계산하는 것보다 <strong>언제, 무엇을, 어떻게</strong> 이전할 것인지 미리 설계하는 것이 중요합니다.",
      "부동산, 금융자산, 법인주식 등 보유자산 전체를 살펴보고 현재의 세금뿐 아니라 향후 상속까지 고려하여 설계합니다.",
    ],
    callout:
      "단순한 세금 계산이 아니라 가족의 자산이 가장 합리적인 방법으로 다음 세대로 이어질 수 있도록 준비합니다.",
  },
  asset: {
    id: "asset",
    eyebrow: "자산설계",
    titleLines: ["절세한 돈,", "그다음이 더 중요합니다."],
    paragraphs: [
      "세금을 줄였다고 자산이 저절로 늘어나는 것은 아닙니다.",
      "얼마를 벌고 남길 수 있는지, 어떻게 운용하고 누구에게 이전할 것인지까지 생각해야 합니다.",
      "고려세무법인은 세금·재무설계·금융상품을 함께 살펴 현재의 소득이 장기적인 자산으로 이어지도록 설계합니다.",
    ],
    cards: [
      {
        badge: "나",
        title: "나를 위한 자산설계",
        body: "현재의 소득과 자산을 바탕으로 미래의 현금흐름과 자산구조를 설계합니다.",
      },
      {
        badge: "家",
        title: "자녀를 위한 자산설계",
        body: "자녀에게 언제, 얼마를, 어떤 방법으로 이전하고 운용할지 계획합니다.",
      },
    ],
    closing: {
      before: "절세에서 끝나지 않고, ",
      highlight: "자산이 성장하는 구조",
      after: "를 설계합니다.",
    },
  },
} as const;

export const about = {
  id: "about",
  eyebrow: "법인소개",
  titleLines: ["세금 그 이상의 가치를 만드는", "고려세무법인"],
  paragraphs: [
    "고려세무법인은 세금을 신고하는 것에서 역할이 끝난다고 생각하지 않습니다.",
    "사업으로 만든 소득을 지키고, 절세한 자금을 자산으로 키우며, 그 자산이 나와 가족의 미래로 이어지도록 함께 고민합니다.",
    "세무기장, 상속·증여, 재무설계와 금융을 연결하여 고객의 현재와 미래를 함께 설계합니다.",
  ],
  closing: { before: "세금을 넘어, ", highlight: "자산을 설계합니다." },
  principal: {
    eyebrow: "대표세무사 소개",
    name: "박소영",
    title: "고려세무법인 용인점 대표 박소영",
    intro:
      "세무뿐 아니라 기업·투자·재무 분야의 경험을 바탕으로 세금 그 이후까지 함께 고민합니다.",
    /** 실제 프로필 사진을 받으면 /public/principal.jpg 로 넣고 아래 경로를 채우세요. */
    photo: null as string | null,
    groups: [
      {
        heading: "전문분야",
        items: [
          "사업가·자산가·투자가를 위한 절세컨설팅",
          "나와 가족을 위한 자산설계",
        ],
      },
      {
        heading: "주요경력",
        items: [
          "고려세무법인 용인(구 서초)점 대표세무사",
          "Rich Divine FP/컨설턴트",
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
};

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
  },
];

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
