// backend/server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
console.log('【DEBUG】JWT_SECRET =', process.env.JWT_SECRET);
const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

// JWT 用のシークレットキー（実運用ではもっと複雑なものを環境変数で管理してください）
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

app.use(bodyParser.json());

let db;

(async () => {
  // ──────────────────────────────────────────────────────────────
  // ① SQLite を開いて、必須テーブルがなければ作成
  // ──────────────────────────────────────────────────────────────
  try {
    db = await open({
      filename: path.resolve(__dirname, 'db.sqlite'),
      driver: sqlite3.Database
    });
    console.log('SQLite に接続成功:', path.resolve(__dirname, 'db.sqlite'));

    // posts テーブルはすでに作ってある想定
    // users テーブルがなければ作成
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'guest'
      );
    `);

  } catch (err) {
    console.error('SQLite 接続エラー:', err);
    process.exit(1);
  }

  app.use(express.json());

  // ──────────────────────────────────────────────────────────────
  // ② 認証に関するルート（ログイン／ログアウト）
  // ──────────────────────────────────────────────────────────────

  // --- POST /api/auth/login ---
  // body に { email, password } を受け取り、照合し、
  // 成功すれば JWT を返す
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@example.com' && password === 'admin1234') {
      const token = jwt.sign({ role: 'admin', email }, 'シークレットキー', { expiresIn: '1h' });
      return res.json({ token });
    }
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードが必要です' });
    }

    try {
      // 1) ユーザーを取得
      const user = await db.get('SELECT * FROM users WHERE email = ?', email);
      if (!user) {
        return res.status(401).json({ error: 'メールアドレスかパスワードが間違っています' });
      }

      // 2) bcrypt でパスワードを比較
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'メールアドレスかパスワードが間違っています' });
      }

      // 3) JWT を発行（有効期限は 1 時間など適宜調整）
      const payload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token });
    } catch (err) {
      console.error('ログインエラー:', err);
      return res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  });

  // --- POST /api/auth/logout ---
  // JWT の場合、基本的にはクライアント側がトークンを破棄すればログアウト完了なので、
  // 簡易的に success を返すだけでも OK です。ブラックリストを作るなら別途対応。
  app.post('/api/logout', (req, res) => {
    // クライアント側でトークンを捨ててもらうだけで OK
    return res.json({ message: 'ログアウトしました' });
  });

  // ──────────────────────────────────────────────────────────────
  // ③ JWT を検証するミドルウェアを定義
  // ──────────────────────────────────────────────────────────────

// 認証ミドルウェア
function authenticateToken(req, res, next) {
  console.log('【DEBUG】got Authorization header:', req.headers['authorization']);
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token malformed' });
  }
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformed' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalid' });
    }
    req.user = decoded; // 以降、req.user を使えます
    next();
  });
}

  // 「管理者のみ」のチェック用ミドルウェア
  function requireAdmin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: '認証が必要です' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '管理者権限が必要です' });
    }
    next();
  }

  // ──────────────────────────────────────────────────────────────
  // ④ 投稿 API（閲覧だけ認可無し、作成・更新・削除は admin 制限）
  // ──────────────────────────────────────────────────────────────

  // (1) 投稿一覧（誰でも見られる）
  app.get('/api/posts',authenticateToken, (req, res) => {
    try {
      const rows = db.all('SELECT * FROM posts ORDER BY id DESC');
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

  // (2) 投稿取得（誰でも見られる）
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

  // (3) 新規投稿の作成（admin 限定）
  app.post(
    '/api/posts',
    authenticateToken,  // ログイン済みか？
    requireAdmin,       // admin 権限か？
    async (req, res) => {
      const { title, writeDate, tags, content } = req.body;
      // title/writeDate/content 等のバリデーションを必要に応じて入れてください
      try {
        const result = await db.run(
          `INSERT INTO posts (title, writeDate, tags, content)
           VALUES (?, ?, ?, ?)`,
          [title, writeDate, JSON.stringify(tags || []), content]
        );
        const newId = result.lastID;
        // 作成した投稿を返す
        const newRow = await db.get('SELECT * FROM posts WHERE id = ?', newId);
        res.status(201).json({
          id: newRow.id,
          title: newRow.title,
          writeDate: newRow.writeDate,
          tags: JSON.parse(newRow.tags),
          content: newRow.content
        });
      } catch (err) {
        console.error('投稿作成エラー:', err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  // (4) 投稿の更新（admin 限定）
  app.put(
    '/api/posts/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
      const id = parseInt(req.params.id, 10);
      const { title, writeDate, tags, content } = req.body;
      try {
        await db.run(
          `UPDATE posts
           SET title = ?, writeDate = ?, tags = ?, content = ?
           WHERE id = ?`,
          [title, writeDate, JSON.stringify(tags || []), content, id]
        );
        const updated = await db.get('SELECT * FROM posts WHERE id = ?', id);
        if (!updated) {
          return res.status(404).json({ error: '記事が見つかりません' });
        }
        res.json({
          id: updated.id,
          title: updated.title,
          writeDate: updated.writeDate,
          tags: JSON.parse(updated.tags),
          content: updated.content
        });
      } catch (err) {
        console.error(`/api/posts/${id} 更新エラー:`, err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  // (5) 投稿の削除（admin 限定）
  app.delete(
    '/api/posts/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
      const id = parseInt(req.params.id, 10);
      try {
        const existing = await db.get('SELECT * FROM posts WHERE id = ?', id);
        if (!existing) {
          return res.status(404).json({ error: '記事が見つかりません' });
        }
        await db.run('DELETE FROM posts WHERE id = ?', id);
        return res.json({ message: '記事を削除しました' });
      } catch (err) {
        console.error(`/api/posts/${id} 削除エラー:`, err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  // ──────────────────────────────────────────────────────────────
  // ⑤ サーバー起動
  // ──────────────────────────────────────────────────────────────
  // app.listen(PORT, () => {
  //   console.log(`Server is listening on port ${PORT}`);
  // });
})();
