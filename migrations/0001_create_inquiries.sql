-- 상담 접수 내역.
-- 개인정보를 담으므로 꼭 필요한 항목만 저장합니다. IP 는 저장하지 않습니다.
CREATE TABLE IF NOT EXISTS inquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL,              -- ISO8601 (UTC)
  name       TEXT    NOT NULL,
  phone      TEXT    NOT NULL,
  email      TEXT,
  topic      TEXT    NOT NULL,
  message    TEXT    NOT NULL,
  source     TEXT    NOT NULL DEFAULT 'form', -- form | quick
  status     TEXT    NOT NULL DEFAULT 'new',  -- new | done
  handled_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status  ON inquiries (status, created_at DESC);
