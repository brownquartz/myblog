// backend/importUsers.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

(async () => {
  const db = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  });

  // テーブルがなければ作る
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'guest'
    );
  `);

  // すでに存在しない場合にのみ、Admin アカウントを１つ作成する
  const adminEmail = 'admin@example.com';
  const existing = await db.get('SELECT * FROM users WHERE email = ?', adminEmail);
  if (!existing) {
    const plain = 'admin1234'; // 後で任意のパスワードに変えてください
    const saltRounds = 10;
    const hash = await bcrypt.hash(plain, saltRounds);
    await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [adminEmail, hash, 'admin']
    );
    console.log(`Admin ユーザーを作成しました: ${adminEmail} / パスワード: ${plain}`);
  } else {
    console.log('すでに Admin ユーザーは存在します。');
  }

  await db.close();
  process.exit();
})();
