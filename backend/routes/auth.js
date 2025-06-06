// backend/routes/auth.js の例
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/login
router.post('/login', (req, res) => {
  // ※実際はユーザー認証 (メール/パスワード照合など) を行う
  const { email, password } = req.body;
  // 仮に認証成功したとして、ペイロードを用意
  const payload = { userId: 123, email: email };

  // ここで必ず process.env.JWT_SECRET が undefined でないかを確認
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
});

module.exports = router;
