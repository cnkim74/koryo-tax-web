import { Reveal } from "./Reveal";

type Icon = { src: string; alt: string; width: number; height: number };

/**
 * 서비스 섹션 머리 부분. 제목 옆에 3D 아이콘을 크게 놓습니다.
 * 아이콘은 유리 재질이라 밝은 배경에서만 씁니다 (어두운 배경에서는 배경 잔상이 드러납니다).
 * 장식 요소라 alt 는 비우고 스크린리더에서 건너뛰게 합니다.
 */
export function ServiceHeader({
  icon,
  flip = false,
  children,
}: {
  icon: Icon;
  /**
   * true 면 아이콘이 왼쪽에 옵니다.
   * 현재는 쓰지 않습니다 — 제목만 오른쪽으로 가고 본문은 왼쪽에서 시작해
   * 읽는 시선이 끊겼습니다. 아이콘 위치를 통일하는 편이 안정적입니다.
   */
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid items-center gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_auto] ${
        flip ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>{children}</div>

      <Reveal
        className={`flex justify-center md:justify-end ${flip ? "md:order-1" : ""}`}
        delay={80}
      >
        <img
          src={icon.src}
          alt={icon.alt}
          aria-hidden={icon.alt === "" ? true : undefined}
          width={icon.width}
          height={icon.height}
          loading="lazy"
          decoding="async"
          className="h-[clamp(11rem,24vw,17rem)] w-auto"
        />
      </Reveal>
    </div>
  );
}
