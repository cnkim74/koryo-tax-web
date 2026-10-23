"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SESSION_KEY = "koryo_seen";

/**
 * 방문 집계.
 *
 * 쿠키나 IP 를 쓰지 않습니다. "이번 브라우저 세션에서 처음인가"만
 * sessionStorage 로 판단해 방문수(visits)와 조회수(views)를 구분합니다.
 * 탭을 닫으면 사라지므로 개인을 추적하지 않습니다.
 */
export function Analytics() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // React Strict Mode 에서 effect 가 두 번 도는 것을 막습니다.
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    let first = false;
    try {
      first = sessionStorage.getItem(SESSION_KEY) === null;
      if (first) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // 사생활 보호 모드 등에서 막히면 조회수만 세고 넘어갑니다.
    }

    const body = JSON.stringify({ path: pathname, first });
    // 페이지를 떠나도 전송이 끊기지 않도록 keepalive 를 씁니다.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
