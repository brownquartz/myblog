import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());

(async function init() {
  // DB 接続
  const db = await open({
    filename: path.resolve(__dirname, 'db.sqlite'),
    driver: sqlite3.Database
  });
  console.log('SQLite に接続成功');

  // ルート定義
  app.get('/api/posts', async (req, res) => {
    try {
      const rows = await db.all('SELECT id, title, writeDate, tags, content FROM posts ORDER BY writeDate DESC');
      const posts = rows.map(r => ({
        id:        r.id,
        title:     r.title,
        writeDate: r.writeDate,
        tags:      JSON.parse(r.tags || '[]'),
        content:   r.content
      }));
      return res.json(posts);
    } catch (err) {
      console.error('[/api/posts] エラー:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // （必要なら /api/posts/:id も同様に）
  app.get('/api/posts/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const row = await db.get(
        'SELECT id, title, writeDate, tags, content FROM posts WHERE id = ?',
        [id]
      );
      if (!row) {
        return res.status(404).json({ error: 'Post not found' });
      }
      const post = {
        id:        row.id,
        title:     row.title,
        writeDate: row.writeDate,
        tags:      JSON.parse(row.tags || '[]'),
        content:   row.content
      };
      res.json(post);
    } catch (err) {
      console.error('[/api/posts/:id] エラー:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // サーバー起動
  app.listen(PORT, () => {
    console.log(`バックエンド起動: http://localhost:${PORT}`);
  });
})();
