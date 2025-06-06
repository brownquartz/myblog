// backend/index.js
require('dotenv').config();
console.log('【DEBUG】JWT_SECRET =', process.env.JWT_SECRET);

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- ログイン用ルート（サンプル実装） ---
app.post('/api/login', (req, res) => {
  // 本来は req.body.email, req.body.password で DB を照合する
  // ここでは固定ユーザーID を返すだけの簡易実装
  const payload = { userId: 1 };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
});

// --- 認証ミドルウェア ---
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token invalid format' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalid' });
    }
    req.user = decoded;
    next();
  });
}

// --- 保護ルート：投稿一覧取得（サンプルデータを返す） ---
app.get('/api/posts', verifyToken, (req, res) => {
  return res.json([
    { id: 1, title: 'サンプル投稿 1', body: 'バックエンドが動いている証拠です' },
    { id: 2, title: 'サンプル投稿 2', body: 'JWT 認証に成功するとここが返されます' }
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
