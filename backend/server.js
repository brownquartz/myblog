// backend/server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors'); // フロント（React）と通信する際に CORS エラーを防ぐため

const app = express();
const PORT = process.env.PORT || 4000;

// CORS 許可（必要に応じてオリジンを制限してください）
app.use(cors());

// JSON レスポンス用のミドルウェア（必要に応じて）
app.use(express.json());

// SQLite DB ファイルへのパス
const DB_PATH = path.join(__dirname, 'db.sqlite');

// GET /api/posts   → 全記事一覧を取得
app.get('/api/posts', (req, res) => {
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('DB 接続エラー:', err.message);
      return res.status(500).json({ error: 'データベース接続エラー' });
    }
  });

  // hidden = 0（非公開でない）記事のみ取得したい場合は WHERE hidden = 0 を加える
  const sql = `
    SELECT id, title, writeDate, tags 
    FROM posts 
    WHERE hidden = 0
    ORDER BY writeDate DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('DB クエリエラー:', err.message);
      db.close();
      return res.status(500).json({ error: '記事一覧取得エラー' });
    }

    // tags はテーブル内では JSON 文字列なので、配列にパースして返す
    const posts = rows.map((row) => ({
      id: row.id,
      title: row.title,
      writeDate: row.writeDate,
      tags: JSON.parse(row.tags || '[]'),
    }));

    res.json(posts);
    db.close();
  });
});

// GET /api/posts/:id  → 指定 ID の記事を取得
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (Number.isNaN(postId)) {
    return res.status(400).json({ error: '不正な ID です' });
  }

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('DB 接続エラー:', err.message);
      return res.status(500).json({ error: 'データベース接続エラー' });
    }
  });

  const sql = `
    SELECT id, title, writeDate, tags, content 
    FROM posts 
    WHERE id = ? AND hidden = 0
  `;

  db.get(sql, [postId], (err, row) => {
    if (err) {
      console.error('DB クエリエラー:', err.message);
      db.close();
      return res.status(500).json({ error: '記事取得エラー' });
    }
    if (!row) {
      db.close();
      return res.status(404).json({ error: '記事が見つかりません' });
    }

    // content は Markdown 本文がそのまま入っている（必要に応じて HTML に変換するなどの処理も可能）
    res.json({
      id: row.id,
      title: row.title,
      writeDate: row.writeDate,
      tags: JSON.parse(row.tags || '[]'),
      content: row.content,
    });
    db.close();
  });
});


// 任意： Express の静的ファイル配信設定（フロントを同一サーバーで配信する場合など）
// app.use(express.static(path.join(__dirname, '../build')));

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
