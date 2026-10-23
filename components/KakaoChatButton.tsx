"use client";

import { kakaoChannel } from "@/content/site";
import { KakaoIcon } from "./KakaoIcon";

/** 플로팅 상담창을 카카오톡 채팅 화면으로 전환시키는 신호 */
export const OPEN_KAKAO_CHAT = "koryo:kakao-chat";

/**
 * 카카오톡 상담 버튼.
 *
 * 넓은 화면에서는 우하단 상담창을 카카오톡 채팅 화면으로 바꿉니다.
 * 이미 카카오에 로그인된 방문자는 바로 대화창이 뜨고, 아니면 카카오 로그인
 * 화면이 먼저 나옵니다.
 *
 * 좁은 화면에서는 기본 링크 동작에 맡겨 카카오톡 앱이 바로 열리게 합니다.
 */
export function KakaoChatButton({
  className = "",
  children,
  iconClassName = "h-5 w-5",
}: {
  className?: string;
  children?: React.ReactNode;
  iconClassName?: string;
}) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // 새 탭으로 열기 등 사용자의 의도적인 조작은 그대로 둡니다.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (window.innerWidth < 768) return;

    e.preventDefault();
    window.dispatchEvent(new CustomEvent(OPEN_KAKAO_CHAT));
  }

  return (
    <a
      href={kakaoChannel.chat}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      style={{ background: kakaoChannel.brandBg, color: kakaoChannel.brandFg }}
      className={className}
    >
      <KakaoIcon className={iconClassName} />
      {children}
    </a>
  );
}
