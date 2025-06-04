// backend/server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM で __dirname を利用するための定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

let db;

// まず SQLite を開く
(async () => {
  try {
    //================================================================
    // ① データベースファイル (db.sqlite) を開く
    //================================================================
    db = await open({
      filename: path.resolve(__dirname, 'db.sqlite'),
      driver: sqlite3.Database
    });
    console.log('SQLite に接続成功:', path.resolve(__dirname, 'db.sqlite'));

    //================================================================
    // ② JSON のパース設定
    //================================================================
    app.use(express.json());

    //================================================================
    // ③ API Route の定義
    //================================================================

    // 記事一覧を返す
    app.get('/api/posts', async (req, res) => {
      try {
        // テーブルからすべての記事を「ID 降順」で取得
        const rows = await db.all('SELECT * FROM posts ORDER BY id DESC');
        const posts = rows.map(row => ({
          id: row.id,
          title: row.title,
          writeDate: row.writeDate,
          tags: JSON.parse(row.tags),
          content: row.content
        }));
        res.json(posts);
      } catch (err) {
        console.error('/api/posts エラー:', err);
        res.status(500).json({ error: err.message });
      }
    });

    // 個別の記事を返す
    app.get('/api/posts/:id', async (req, res) => {
      const id = parseInt(req.params.id, 10);
      try {
        const row = await db.get('SELECT * FROM posts WHERE id = ?', id);
        if (!row) {
          return res.status(404).json({ error: '記事が見つかりません' });
        }
        res.json({
          id: row.id,
          title: row.title,
          writeDate: row.writeDate,
          tags: JSON.parse(row.tags),
          content: row.content
        });
      } catch (err) {
        console.error(`/api/posts/${id} エラー:`, err);
        res.status(500).json({ error: err.message });
      }
    });

    //================================================================
    // ④ すべてのルートを定義し終えたあとにサーバー起動
    //================================================================
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

  } catch (err) {
    console.error('SQLite 接続エラー:', err);
  }
})();
