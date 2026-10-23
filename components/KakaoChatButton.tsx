"use client";

import { kakaoChannel } from "@/content/site";
import { KakaoIcon } from "./KakaoIcon";

const POPUP_W = 420;
const POPUP_H = 640;

/**
 * 카카오톡 상담 버튼.
 *
 * 넓은 화면에서는 페이지를 떠나지 않고 화면 우하단에 떠 있는 채팅창을 엽니다.
 * (카카오 공식 채널 버튼도 같은 방식입니다.)
 *
 * iframe 으로 페이지 안에 직접 넣는 것도 되기는 하지만 쓰지 않습니다.
 * 방문자가 우리 도메인 안에서 카카오 비밀번호를 입력하게 되어 피싱과 구분이
 * 어렵고, 서드파티 쿠키를 막는 브라우저에서는 로그인 자체가 실패합니다.
 * 팝업은 주소창에 pf.kakao.com 이 보여 방문자가 진짜 카카오임을 확인할 수 있습니다.
 *
 * 좁은 화면에서는 팝업이 막히거나 새 탭처럼 열리므로 기본 동작에 맡깁니다.
 * 휴대폰에서는 그대로 카카오톡 앱이 열립니다.
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

    const left = Math.max(0, (window.screen.availWidth ?? POPUP_W) - POPUP_W - 24);
    const top = Math.max(0, (window.screen.availHeight ?? POPUP_H) - POPUP_H - 48);

    const win = window.open(
      kakaoChannel.chat,
      "koryo-kakao-chat",
      `popup=yes,width=${POPUP_W},height=${POPUP_H},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );

    if (win) {
      // 열린 창이 우리 페이지를 조작하지 못하게 연결을 끊습니다.
      win.opener = null;
      win.focus();
    } else {
      // 팝업이 차단되면 새 탭으로라도 열어줍니다.
      window.open(kakaoChannel.chat, "_blank", "noopener,noreferrer");
    }
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
