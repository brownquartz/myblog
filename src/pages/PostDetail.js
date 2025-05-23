// src/pages/PostDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { posts } from '../data/posts';  // 既存のダミーデータ
import './PostDetail.css';            // スタイルを適用

export default function PostDetail() {
  const { id } = useParams();                       // URL から id を取得
  const post = posts.find(p => p.id === Number(id)); // 数字に変換してマッチ

  if (!post) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>投稿が見つかりません。</p>
        <Link to="/posts">一覧に戻る</Link>
      </div>
    );
  }

  // ID降順ソート＆スライディングウィンドウ（省略）
  const sorted = [...posts].sort((a, b) => b.id - a.id);
  const currentIndex = sorted.findIndex(p => p.id === post.id);
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = currentIndex - half;
  let end = currentIndex + half;
  if (start < 0) {
    start = 0;
    end = Math.min(windowSize - 1, sorted.length - 1);
  } else if (end > sorted.length - 1) {
    end = sorted.length - 1;
    start = Math.max(0, end - (windowSize - 1));
  }
  const related = sorted.slice(start, end + 1);

  return (
    <article className="post-detail" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      {/* 1. タイトルを中央、2. 右に日付 */}
      <div className="post-header">
        <h2>{post.title}</h2>
        {/* posts データに writeDate プロパティを追加しておく */}
        <span className="post-date">{post.writeDate}</span>
      </div>

      {/* 3. タイトル／日付と本文の間に線を１本 */}
      <hr className="post-divider" />

      {/* 本文 */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* ↓ ここから縦並びの関連投稿リスト */}
      <div className="related-container">
        <h3>関連投稿</h3>
        <ul className="related-list">
          {related.map(p => (
            <li key={p.id} className="related-item">
              <Link
                to={`/posts/${p.id}`}
                className={p.id === post.id ? 'active' : ''}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <hr className="post-divider" />

      {/* 戻るリンク */}
      <Link to="/posts">← Posts一覧に戻る</Link>
    </article>
    );
}