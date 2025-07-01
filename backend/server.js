import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config' ;

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.options('*', cors());

// JWT を検証し、payload を req.user に設定するミドルウェア
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: '認証情報が必要です' });
  }
  const token = authHeader.split(' ')[1]; // "Bearer <token>" の想定
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'トークンが無効です' });
    }
    req.user = payload; // { id, email, role } が入る
    next();
  });
}

(async function init() {
  // DB 接続
  const db = await open({
    filename: path.resolve(__dirname, 'db.sqlite'),
    driver: sqlite3.Database
  });
  console.log('SQLite に接続成功');

  // get all posts
  // 投稿一覧の取得
  app.get('/api/posts', async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT id, title, writeDate, tags, content, author_id 
         FROM posts 
         ORDER BY writeDate DESC, id DESC
        `
      );
      const posts = rows.map(r => ({
        id:        r.id,
        title:     r.title,
        writeDate: r.writeDate,
        tags:      JSON.parse(r.tags || '[]'),
        content:   r.content,
        author_id : r.author_id
      }));
      return res.json(posts);
    } catch (err) {
      console.error('[/api/posts] エラー:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // write post
  // 新規投稿の作成
  app.post('/api/posts', authenticateJWT, async (req, res) => {
    try {
      const { title, date, content, tags, hidden } = req.body;
      // tags は配列の想定なので文字列に変換
      const tagsJson = JSON.stringify(tags || []);
      const hiddenFlag = hidden ? 1 : 0;
      // データベースへの挿入
      console.log('req.user :', req.user);
      const result = await db.run(
        `INSERT INTO posts (title, writeDate, tags, content, hidden, author_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        title,
        date,
        tagsJson,
        content,
        hiddenFlag,
        req.user.id // ログインユーザーのIDを使用
      );
      // 挿入したレコードのIDを取得
      const newId = result.lastID;
      res.status(201).json({
        id: newId,
        title,
        writeDate: date,
        tags: JSON.parse(tagsJson),
        content,
        author_id: req.user.id
      });
    } catch (err) {
      console.error('[/api/posts POST] エラー:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // get 1 post
  // ID指定で投稿を取得
  app.get('/api/posts/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const row = await db.get(
        'SELECT id, title, writeDate, tags, content, author_id FROM posts WHERE id = ?',
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
        content:   row.content,
        author_id : row.author_id
      };
      res.json(post);
    } catch (err) {
      console.error('[/api/posts/:id] エラー:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 編集（PUT）
  // /api/posts/:id に対して、タイトル／日付／本文／タグを更新する
  app.put('/api/posts/:id', authenticateJWT, async (req, res) => {
    const post = await db.get(
      'SELECT author_id FROM posts WHERE id = ?',
      req.params.id
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
      return res.status(403).json({ error: '権限がありません' });
    }

    try {
      const { id } = req.params;
      const { title, date, content, tags, hidden } = req.body;
      const tagsJson = JSON.stringify(tags || []);
      const hiddenFlag = hidden ? 1 : 0;
      await db.run(
        `UPDATE posts
          SET title     = ?,
              writeDate = ?,
              tags      = ?,
              content   = ?,
              hidden    = ?
        WHERE id = ?`,
        title, date, tagsJson, content, hiddenFlag, 
        id
      );
      res.json({ success: true });
    } catch (err) {
      console.error('[/api/posts/:id PUT] エラー:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 削除（DELETE）
  // /api/posts/:id を削除する
  app.delete('/api/posts/:id', authenticateJWT, async (req, res) => {
    const post = await db.get('SELECT author_id FROM posts WHERE id = ?', req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
      return res.status(403).json({ error: '権限がありません' });
    }

    try {
      const { id } = req.params;
      await db.run(`DELETE FROM posts WHERE id = ?`, id);
      res.json({ success: true });
    } catch (err) {
      console.error('[/api/posts/:id DELETE] エラー:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // login
  // ユーザーログイン
  app.post('/api/login',async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const row = await db.get(
      'SELECT * FROM users WHERE email = ?',
      email
    );
    // console.log('row:', row);
    if (!row) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { id: row.id, email: row.email, role: row.role };
    const token  = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token , user: { id: row.id, email: row.email, role: row.role } });

  });

  // サーバー起動
  app.listen(PORT, () => {
    console.log(`バックエンド起動: http://localhost:${PORT}`);
  });
})();
