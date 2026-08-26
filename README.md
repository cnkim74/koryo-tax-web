# 고려세무법인 용인점 홈페이지

기존 단일 HTML 번들(`_reference/`)을 Next.js + Tailwind CSS 로 다시 만든 사이트입니다.
원본의 문구와 디자인 톤(토스 블루 `#3182f6`, Pretendard)은 유지하고, 반응형·성능·SEO·상담폼·블로그를 새로 붙였습니다.

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 빌드 결과 실행 |
| `npm run typecheck` | 타입 검사 |

## 구조

```
app/
  layout.tsx          공통 레이아웃 · SEO 메타 · 폰트 · 네비/푸터
  page.tsx            메인 원페이지 (섹션 조립만 담당)
  blog/               세무칼럼 목록 + 상세
  api/contact/        상담 신청 접수 API
  sitemap.ts          sitemap.xml 자동 생성
  robots.ts           robots.txt 자동 생성
components/           섹션·UI 컴포넌트
content/
  site.ts             ★ 사이트 문구·연락처·주소 (수정은 대부분 여기서)
  posts/*.md          ★ 세무칼럼 글
lib/
  posts.ts            마크다운 글 읽기
  contact-schema.ts   상담폼 검증 규칙 (클라이언트/서버 공용)
_reference/           원본 HTML 및 압축 해제한 템플릿 (참고용, 빌드 제외)
```

## 문구 수정하기

거의 모든 텍스트는 **`content/site.ts`** 한 파일에 있습니다.
전화번호, 주소, 대표 프로필, 서비스 설명, 문의 유형 목록 모두 여기서 바꾸면 사이트 전체에 반영됩니다.

## 세무칼럼 글 쓰기

`content/posts/` 에 마크다운 파일을 추가하면 목록·상세·사이트맵에 자동 반영됩니다.
파일명이 그대로 주소가 됩니다. (`my-post.md` → `/blog/my-post`)

```markdown
---
title: "글 제목"
description: "검색결과와 목록 카드에 보이는 한 줄 요약"
date: "2026-09-01"
category: "세무기장"
---

본문을 마크다운으로 작성합니다.
```

> ⚠️ 현재 들어있는 3개 글은 **초안**입니다. 게시 전에 대표세무사 검토를 받으세요.
> 세법 개정으로 달라질 수 있는 구체적 수치는 일부러 넣지 않았습니다.

## 상담 신청 메일 받기

기본 상태에서는 상담 신청이 **서버 로그에만** 기록됩니다. 실제로 메일을 받으려면:

1. [Resend](https://resend.com) 가입 후 API 키 발급 (무료 플랜으로 월 3,000건)
2. `.env.example` 을 복사해 `.env.local` 생성
3. 아래 값 입력

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=받을주소@example.com
CONTACT_FROM_EMAIL=noreply@본인도메인.com   # 도메인 인증 후
```

스팸 방지로 허니팟 필드와 IP당 10분에 5건 제한이 걸려 있습니다.

## 배포 — Cloudflare Workers (workers.dev)

`@opennextjs/cloudflare` 어댑터로 Workers에 올립니다. 로컬에서 Workers 런타임 그대로 확인 가능합니다.

```bash
npm run cf:preview     # 로컬에서 Workers 런타임으로 미리보기 (http://localhost:8787)
```

배포는 Cloudflare 로그인이 한 번 필요합니다. **대화형 터미널에서** 실행하세요.

```bash
npx wrangler login
```

로그인 후:

```bash
npm run cf:deploy
```

`https://koryo-tax-web.<계정서브도메인>.workers.dev` 주소가 출력됩니다.

| 명령 | 용도 |
|---|---|
| `npm run cf:preview` | 로컬 Workers 런타임 미리보기 |
| `npm run cf:deploy` | **임시 미리보기 배포** — 검색엔진 색인 차단(`noindex`) 상태 |
| `npm run cf:deploy:prod` | 실제 공개용 배포 — 색인 허용 |

### ⚠️ 환경변수는 빌드 시점에 박힙니다

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_NOINDEX` 는 페이지가 미리 생성될 때 값이 들어갑니다.
그래서 `wrangler.jsonc` 의 `vars` 나 Cloudflare 대시보드에서 나중에 바꿔도 반영되지 않습니다. **빌드 명령에 붙여야** 합니다.

첫 배포로 workers.dev 주소를 확인한 뒤, 그 주소를 넣어 다시 배포하면 메타태그·사이트맵이 맞춰집니다.

```bash
NEXT_PUBLIC_SITE_URL=https://koryo-tax-web.내계정.workers.dev npm run cf:deploy
```

실제 도메인으로 정식 공개할 때:

```bash
NEXT_PUBLIC_SITE_URL=https://www.thetaxplus.com npm run cf:deploy:prod
```

상담 알림 메일 키는 빌드가 아니라 런타임에 읽으므로 secret 으로 등록합니다.

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_TO_EMAIL
```

### Workers 관련 참고

- ISR(주기적 재생성)을 쓰지 않으므로 R2 캐시 없이 **Workers 정적 에셋 캐시**(`open-next.config.ts`)로 미리 생성된 페이지를 제공합니다. 나중에 `revalidate` 를 쓰게 되면 R2 캐시로 바꿔야 합니다.
- 상담폼의 IP 레이트리밋은 **인스턴스 메모리 기반**이라 Workers 에서는 격리 단위마다 따로 셉니다. 본격 운영 시에는 KV 나 Durable Object 로 옮기세요.

## 배포 — Vercel (대안)

Next.js 네이티브 호스팅이라 설정이 더 단순합니다.

```bash
vercel login
npx vercel
```

환경변수 `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` 를 프로젝트 설정에 등록하세요.

## 원본 대비 개선한 것

- **반응형** — 모든 제목·여백을 `clamp()` 로 처리, 모바일 햄버거 메뉴 추가. 375px에서 가로 스크롤 없음
- **폰트 16MB → 수십 KB** — Pretendard 전체 번들 대신 동적 서브셋 CDN 사용
- **SEO** — 메타/OG/canonical, `AccountingService` + `LocalBusiness` 구조화 데이터(사무소 2곳 좌표 포함), sitemap, robots
- **상담 신청 폼** — 전화 링크만 있던 것을 실제 리드 수집 폼으로. 검증 규칙은 클라이언트/서버 공용
- **세무칼럼** — 지역 검색 유입을 위한 콘텐츠 채널
- **접근성** — 본문 바로가기 링크, 포커스 링, `prefers-reduced-motion` 대응, 폼 라벨/에러 연결
- **지도 지연 로딩** — Leaflet 을 화면에 들어올 때만 불러와 초기 번들에서 제외

## 남은 일

- [ ] **실제 로고 파일** — 지금은 `稅` 글자 배지입니다. 로고를 받으면 `public/` 에 넣고 `components/Nav.tsx` 교체
- [ ] **대표 프로필 사진 / 사무실 사진** — `public/` 에 넣고 `content/site.ts` 의 `about.principal.photo` 경로 지정
- [ ] **OG 이미지** — `app/opengraph-image.png` (1200×630) 추가 시 카톡·검색 공유 미리보기 개선
- [ ] **도메인 연결** 후 `NEXT_PUBLIC_SITE_URL` 을 넣어 `npm run cf:deploy:prod` 로 재배포 (임시 배포는 색인 차단 상태)
- [ ] **네이버 서치어드바이저 / 구글 서치콘솔 등록** + 사이트맵 제출
- [ ] **네이버 스마트플레이스** 등록 (지역 세무사무소는 여기 유입이 큽니다)
- [ ] **개인정보처리방침 페이지** — 상담폼으로 개인정보를 수집하므로 실무상 필요합니다
- [ ] 세무칼럼 초안 3편 검토 및 추가 집필
