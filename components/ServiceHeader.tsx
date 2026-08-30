import { Reveal } from "./Reveal";
import { serviceIcons, type ServiceIconKey } from "./ServiceIcons";

/**
 * 서비스 섹션 머리 부분. 제목 옆에 아이콘을 크게 놓습니다.
 * 아이콘은 인라인 SVG 라 별도 요청이 없고 어떤 크기에서도 선명합니다.
 */
export function ServiceHeader({
  icon,
  children,
}: {
  icon: ServiceIconKey;
  children: React.ReactNode;
}) {
  const Icon = serviceIcons[icon];

  return (
    <div className="grid items-center gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_auto]">
      <div>{children}</div>

      <Reveal className="flex justify-center md:justify-end" delay={80}>
        <Icon className="h-[clamp(11rem,24vw,17rem)] w-auto" />
      </Reveal>
    </div>
  );
}
