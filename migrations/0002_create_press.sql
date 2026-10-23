-- 보도자료 링크. 관리자 페이지에서 등록하고 메인 화면에 노출합니다.
CREATE TABLE IF NOT EXISTS press (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT    NOT NULL,
  title        TEXT    NOT NULL,
  outlet       TEXT,                              -- 매체명
  url          TEXT    NOT NULL,
  published_at TEXT,                              -- 보도일 YYYY-MM-DD
  kind         TEXT    NOT NULL DEFAULT 'article',-- article | video
  video_id     TEXT,                              -- 유튜브 영상 ID (kind=video)
  visible      INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_press_order ON press (visible, published_at DESC, id DESC);
