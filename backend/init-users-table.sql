-- backend/init-users-table.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,   -- bcrypt でハッシュ化したパスワードを格納する
  role TEXT NOT NULL DEFAULT 'guest'  -- 'admin' や 'guest' など権限を分けられる
);