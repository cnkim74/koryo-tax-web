import { kakaoChannel } from "@/content/site";
import { KakaoIcon } from "./KakaoIcon";

/**
 * 화면 우하단 고정 카톡 상담 버튼.
 * 국내 방문자는 전화보다 카톡 문의를 편하게 여겨 전환율이 높습니다.
 */
export function KakaoFloatingButton() {
  return (
    <a
      href={kakaoChannel.chat}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${kakaoChannel.name} 카카오톡 채널로 상담하기 (새 창)`}
      style={{ background: kakaoChannel.brandBg, color: kakaoChannel.brandFg }}
      className="fixed right-5 bottom-5 z-90 flex items-center gap-2 rounded-full px-4 py-3.5 text-[15px] font-bold shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 sm:right-7 sm:bottom-7 sm:px-5"
    >
      <KakaoIcon className="h-[22px] w-[22px] shrink-0" />
      {/* 라벨은 넓은 화면에서만. 좁은 화면에서는 aria-label 이 대신합니다. */}
      <span className="hidden sm:inline">카톡 상담</span>
    </a>
  );
}
