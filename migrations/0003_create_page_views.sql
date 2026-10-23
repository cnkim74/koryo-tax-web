-- 방문 실적. 개인을 식별하는 값(IP·쿠키)은 저장하지 않고 날짜·경로별 합계만 쌓습니다.
-- visits = 브라우저 세션 기준 첫 조회, views = 전체 조회수
CREATE TABLE IF NOT EXISTS page_views (
  day    TEXT    NOT NULL,            -- YYYY-MM-DD (한국시간)
  path   TEXT    NOT NULL,
  views  INTEGER NOT NULL DEFAULT 0,
  visits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path)
);

CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views (day DESC);
