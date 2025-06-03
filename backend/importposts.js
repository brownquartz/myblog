// backend/importPosts.js

/**
 * このスクリプトを実行するときは
 *   cd my-blog/backend
 *   node importPosts.js
 *
 * として実行します。
 * 
 * 概要：
 *  1. ../posts フォルダをスキャンして .md ファイルをすべて列挙
 *  2. 各ファイルを読み込み、gray-matter で front-matter と本文に分解
 *  3. front-matter 内の id, title, writeDate, tags, (必要なら hidden など) を取得
 *  4. SQLite の posts テーブルに対して INSERT を実行
 * 
 * ※ すでに同じ id のレコードがある場合は上書きしたい、などの要件があれば適宜コメント部分を調整してください。
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sqlite3 = require('sqlite3').verbose();

// データベースへの接続（db.sqlite はすでに作成済みでテーブルだけ作られている想定）
const DB_PATH = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('SQLite に接続エラー:', err.message);
    process.exit(1);
  }
  console.log('SQLite に接続成功:', DB_PATH);
});

// Markdown ファイルが置かれているディレクトリ
const POSTS_DIR = path.resolve(__dirname, '..','src', 'posts');

// posts テーブルがまだ存在していなければ作成する（念のため）
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  writeDate TEXT NOT NULL,
  tags TEXT,
  content TEXT,
  hidden BOOLEAN DEFAULT 0
);
`;

db.serialize(() => {
  db.run(CREATE_TABLE_SQL, (err) => {
    if (err) {
      console.error('テーブル作成エラー:', err.message);
      process.exit(1);
    }
    console.log('posts テーブルを確認・作成しました。');
    importAllMarkdown();
  });
});

/**
 * posts フォルダをスキャンしてすべての .md ファイルを INSERT する。
 */
function importAllMarkdown() {
  fs.readdir(POSTS_DIR, (err, files) => {
    if (err) {
      console.error('posts ディレクトリの読み込みに失敗:', err.message);
      process.exit(1);
    }

    // .md で終わるファイルだけを抽出する
    const mdFiles = files.filter((fn) => fn.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log('Markdown ファイルが 0 件です。処理を終了します。');
      db.close();
      return;
    }

    console.log(`見つかった Markdown ファイル: ${mdFiles.join(', ')}`);

    // 直列・同期に処理する例（Promise を使って順序どおりに）
    let promiseChain = Promise.resolve();

    mdFiles.forEach((mdFile) => {
      promiseChain = promiseChain.then(() => {
        return importSingleMarkdown(mdFile);
      });
    });

    promiseChain
      .then(() => {
        console.log('すべての Markdown ファイルを DB に登録しました。');
        db.close();
      })
      .catch((e) => {
        console.error('途中でエラー発生:', e);
        db.close();
      });
  });
}

/**
 * 単一の Markdown ファイルを読み込み、DB に INSERT（あるいは REPLACE）する
 * - mdFilename: "2025-05-28.md" のようなファイル名
 */
function importSingleMarkdown(mdFilename) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(POSTS_DIR, mdFilename);

    // 先頭が「_」で始まるファイル（例: _markdown-cheatsheet.md）は「hidden: true」として扱う、
    // もしくは完全にスキップしても良い。ここでは hidden カラムに 1 を入れる例を示す。
    const isHidden = mdFilename.startsWith('_') ? 1 : 0;

    fs.readFile(fullPath, 'utf8', (err, rawContent) => {
      if (err) {
        return reject(`ファイル読み込み失敗: ${mdFilename} → ${err.message}`);
      }

      // gray-matter で front-matter と本文を分離
      const { data: fm, content: mdBody } = matter(rawContent);

      // front-matter に id, title, writeDate, tags, （hidden） があるか確認
      // 必須フィールドがなければスキップするロジックを入れるのも可
      if (typeof fm.id === 'undefined' || typeof fm.title === 'undefined' || typeof fm.writeDate === 'undefined') {
        console.warn(`front-matter が不完全なためスキップ: ${mdFilename}`);
        return resolve();
      }

      // tags は配列でパースされるはず → JSON.stringify して文字列として保持しておく
      // hidden も front-matter にあればそれを使い、なければファイル名先頭の判定を適用
      const tagsJson = Array.isArray(fm.tags) ? JSON.stringify(fm.tags) : JSON.stringify([]);
      const hiddenFlag = (typeof fm.hidden === 'boolean' ? (fm.hidden ? 1 : 0) : isHidden);

      // SQLite に "INSERT OR REPLACE" で流し込む（同じ id があれば上書きする）
      const sql = `
        INSERT OR REPLACE INTO posts (id, title, writeDate, tags, content, hidden)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        fm.id,
        fm.title,
        fm.writeDate,
        tagsJson,
        mdBody,
        hiddenFlag
      ];

      db.run(sql, params, function (err2) {
        if (err2) {
          return reject(`DB INSERT エラー (${mdFilename}): ${err2.message}`);
        }
        console.log(`✅ 登録完了 → ID=${fm.id} / ${fm.title}`);
        resolve();
      });
    });
  });
}
