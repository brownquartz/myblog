// backend/middleware/verifyToken.js の例
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // Bearer <token> という形を想定している
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token invalid format' });
  }

  // ここで再度 process.env.JWT_SECRET を使って検証
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // err.name が 'TokenExpiredError' か 'JsonWebTokenError' などになる
      return res.status(401).json({ message: 'Token invalid' });
    }
    // 正常に検証できた場合はデコード結果を req.user にセット
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
