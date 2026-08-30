/**
 * 서비스 섹션용 아이콘.
 *
 * 받은 3D 유리 아이콘은 배경 격자가 이미지에 인쇄된 파일이라 깨끗하게 살릴 수
 * 없었습니다(격자가 유리를 통과해 비친 부분은 원본 정보가 남아있지 않습니다).
 * 대신 로고와 같은 금색 그라데이션으로 직접 그렸습니다.
 * 벡터라 어떤 크기에서도 선명하고, 어두운 배경에도 쓸 수 있으며, 용량은 수 KB 입니다.
 *
 * ※ 그라데이션은 반드시 gradientUnits="userSpaceOnUse" 로 둡니다.
 *   기본값(objectBoundingBox)이면 가로선처럼 높이가 0인 도형에서 렌더링이 사라집니다.
 */

type Props = { className?: string };

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="24" y1="14" x2="136" y2="140">
        <stop offset="0" stopColor="#E3D2A0" />
        <stop offset="0.45" stopColor="#C0A053" />
        <stop offset="1" stopColor="#8A6D3B" />
      </linearGradient>
      <linearGradient id={`${id}-gv`} gradientUnits="userSpaceOnUse" x1="80" y1="20" x2="80" y2="132">
        <stop offset="0" stopColor="#D3B76C" />
        <stop offset="1" stopColor="#8A6D3B" />
      </linearGradient>
      <radialGradient id={`${id}-sh`} gradientUnits="userSpaceOnUse" cx="80" cy="146" r="48">
        <stop offset="0" stopColor="#8A6D3B" stopOpacity="0.26" />
        <stop offset="1" stopColor="#8A6D3B" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

const Ground = ({ id }: { id: string }) => (
  <ellipse cx="80" cy="146" rx="46" ry="7" fill={`url(#${id}-sh)`} />
);

/** 세무기장 — 신고서와 원화 */
export function TaxIcon({ className = "" }: Props) {
  const id = "ic-tax";
  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-hidden focusable="false">
      <Defs id={id} />
      <Ground id={id} />
      {/* 두께감 */}
      <rect x="38" y="26" width="78" height="102" rx="12" fill="#6E5529" opacity="0.3" />
      {/* 본체 */}
      <rect x="32" y="20" width="78" height="102" rx="12" fill="#fff" stroke={`url(#${id}-g)`} strokeWidth="5" />
      {/* 상단 집게 */}
      <rect x="57" y="11" width="28" height="17" rx="6" fill={`url(#${id}-g)`} />
      {/* 문서 줄 */}
      <g stroke={`url(#${id}-g)`} strokeWidth="5.5" strokeLinecap="round">
        <line x1="46" y1="49" x2="96" y2="49" />
        <line x1="46" y1="65" x2="84" y2="65" />
      </g>
      {/* 막대 그래프 */}
      <g fill={`url(#${id}-gv)`}>
        <rect x="46" y="94" width="10" height="16" rx="3" />
        <rect x="61" y="83" width="10" height="27" rx="3" />
        <rect x="76" y="88" width="10" height="22" rx="3" />
      </g>
      {/* 원화 코인 */}
      <circle cx="113" cy="104" r="25" fill="#fff" stroke={`url(#${id}-g)`} strokeWidth="5" />
      <text
        x="113" y="114" textAnchor="middle"
        fontSize="26" fontWeight="800" fill="#8A6D3B"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
      >
        ₩
      </text>
    </svg>
  );
}

/** 상속·증여 — 선물상자 */
export function GiftIcon({ className = "" }: Props) {
  const id = "ic-gift";
  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-hidden focusable="false">
      <Defs id={id} />
      <Ground id={id} />
      {/* 두께감 */}
      <rect x="42" y="70" width="86" height="62" rx="10" fill="#6E5529" opacity="0.3" />
      {/* 상자 몸통 */}
      <rect x="36" y="64" width="86" height="62" rx="10" fill="#fff" stroke={`url(#${id}-g)`} strokeWidth="5" />
      {/* 세로 리본 */}
      <rect x="71" y="66" width="16" height="58" fill={`url(#${id}-gv)`} />
      {/* 뚜껑 */}
      <rect x="28" y="46" width="102" height="24" rx="8" fill={`url(#${id}-g)`} />
      {/* 리본 고리 — 두 개의 뚜렷한 루프 */}
      <path
        d="M79 46C66 46 52 40 52 29c0-8 8-12 15-8 8 5 11 15 12 25Z"
        fill="none" stroke={`url(#${id}-g)`} strokeWidth="6" strokeLinejoin="round"
      />
      <path
        d="M81 46c13 0 27-6 27-17 0-8-8-12-15-8-8 5-11 15-12 25Z"
        fill="none" stroke={`url(#${id}-g)`} strokeWidth="6" strokeLinejoin="round"
      />
      {/* 매듭 */}
      <ellipse cx="80" cy="47" rx="9" ry="7" fill={`url(#${id}-g)`} />
    </svg>
  );
}

/** 자산설계 — 집과 가족 */
export function HomeIcon({ className = "" }: Props) {
  const id = "ic-home";
  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-hidden focusable="false">
      <Defs id={id} />
      <Ground id={id} />
      {/* 두께감 */}
      <path d="M86 26l48 40v62a7 7 0 0 1-7 7H45a7 7 0 0 1-7-7V66z" fill="#6E5529" opacity="0.28" />
      {/* 집 본체 */}
      <path
        d="M80 24l50 42v60a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V66z"
        fill="#fff" stroke={`url(#${id}-g)`} strokeWidth="5" strokeLinejoin="round"
      />
      {/* 지붕 */}
      <path
        d="M24 70L80 23l56 47"
        fill="none" stroke={`url(#${id}-g)`} strokeWidth="6.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* 가족 */}
      <g fill={`url(#${id}-gv)`}>
        <circle cx="66" cy="88" r="10" />
        <path d="M50 121a16 16 0 0 1 32 0Z" />
        <circle cx="97" cy="95" r="8" />
        <path d="M85 121a12 12 0 0 1 24 0Z" />
      </g>
    </svg>
  );
}

export const serviceIcons = { tax: TaxIcon, gift: GiftIcon, home: HomeIcon } as const;
export type ServiceIconKey = keyof typeof serviceIcons;
