/** 카카오톡 말풍선 마크 (단순화). currentColor 를 따릅니다. */
export function KakaoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 3C6.99 3 3 6.2 3 10.14c0 2.52 1.66 4.73 4.16 5.99-.18.65-.66 2.4-.76 2.77-.12.46.17.45.36.33.15-.1 2.36-1.6 3.32-2.25.62.09 1.26.14 1.92.14 5.01 0 9-3.2 9-7.14S17.01 3 12 3z" />
    </svg>
  );
}
