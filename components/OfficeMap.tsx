"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Office } from "@/content/site";

/**
 * 지도는 화면에 들어올 때 Leaflet 을 동적으로 불러옵니다.
 * (초기 번들에 지도 라이브러리가 포함되지 않도록)
 */
export function OfficeMap({ office }: { office: Office }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([office.lat, office.lng], 16);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.circleMarker([office.lat, office.lng], {
        radius: 9,
        color: "#3182f6",
        weight: 2,
        fillColor: "#3182f6",
        fillOpacity: 0.85,
      })
        .addTo(map)
        .bindPopup(`<b>고려세무법인 ${office.name}</b><br>${office.mapLabel}`)
        .openPopup();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void init();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, [office]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${office.name} 위치 지도`}
      className="h-[260px] w-full border-t border-surface-2 bg-surface-2"
    />
  );
}
