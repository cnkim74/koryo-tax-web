import { about, kakaoPlaceUrl, offices, site } from "@/content/site";

/**
 * 로컬 SEO 구조화 데이터. 검색결과에 사무소 정보/지도가 노출되도록 돕습니다.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AccountingService",
        "@id": `${site.url}/#organization`,
        name: `${site.name} ${site.branch}`,
        alternateName: site.name,
        url: site.url,
        description: site.description,
        slogan: site.tagline,
        priceRange: "$$",
        areaServed: ["경기도 용인시", "서울특별시 서초구", "대한민국"],
        knowsAbout: ["세무기장", "상속세", "증여세", "양도소득세", "자산설계", "절세컨설팅"],
        employee: {
          "@type": "Person",
          name: about.principal.name,
          jobTitle: "대표세무사",
          worksFor: { "@id": `${site.url}/#organization` },
        },
        location: offices.map((office) => ({
          "@type": "LocalBusiness",
          name: `${site.name} ${office.name}`,
          telephone: office.tel,
          address: {
            "@type": "PostalAddress",
            streetAddress: office.address,
            addressCountry: "KR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: office.lat,
            longitude: office.lng,
          },
          // 카카오맵에 등록된 장소와 동일한 곳임을 검색엔진에 알려줍니다
          sameAs: [kakaoPlaceUrl(office)],
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "ko-KR",
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  date,
  slug,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: "ko-KR",
    mainEntityOfPage: `${site.url}/blog/${slug}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@id": `${site.url}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
