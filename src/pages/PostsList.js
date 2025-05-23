// src/pages/PostsList.js
import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import './PostsList.css';

export default function PostsList() {
  // ─── 1. フックは必ず最上段で呼び出す ─────────────────────
  const posts = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState([]);

  // ─── 2. 全タグリスト（postsがnullの間は空配列） ─────────────
  const allTags = useMemo(() => {
    if (!posts) return [];
    return Array.from(new Set(posts.flatMap(p => p.tags))).sort();
  }, [posts]);

  // ─── 3. AND条件での絞り込み（postsがnullの間は空配列） ────────
  const filtered = useMemo(() => {
    if (!posts) return [];
    if (selectedTags.length === 0) return posts;
    return posts.filter(p =>
      selectedTags.every(tag => p.tags.includes(tag))
    );
  }, [posts, selectedTags]);

  // ─── 4. ページング計算 ───────────────────────────────────
  const pageSize = 5;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Math.min(Math.max(rawPage, 1), totalPages);
  const start = (page - 1) * pageSize;
  const pagePosts = filtered.slice(start, start + pageSize);

  // ─── 5. ここで初めて状態に応じた早期リターン ───────────────
  if (posts === null) {
    return <p>Loading…</p>;
  }
  if (posts.length === 0) {
    return <p>投稿がありません。</p>;
  }

  // タグトグル
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setSearchParams({ page: '1' });
  };

  // ページ変更
  const goToPage = p => setSearchParams({ page: String(p) });

  // ─── 6. レンダリング ─────────────────────────────────────
  return (
    <div className="posts-container">
      {/* ← タグサイドバー */}
      <aside className="tag-sidebar">
        <h3>Tags</h3>
        <div className="tag-buttons">
          {allTags.map(tag => (
            <button
              key={tag}
              className={selectedTags.includes(tag) ? 'active' : ''}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>

      {/* → 投稿一覧 */}
      <div className="posts-wrapper">
        <h2>Posts 一覧</h2>
        <ul className="posts-list">
          {pagePosts.map(p => (
            <li key={p.id} className="post-item">
              <div className="post-item-header">
                <h3>
                  <Link to={`/posts/${p.slug}`}>{p.title}</Link>
                </h3>
                <span className="post-item-date">{p.writeDate}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* 範囲表示 */}
        <div className="range-info">
          ({start + 1}-{start + pagePosts.length}/{total})
        </div>

        {/* ページネーション */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                className={p === page ? 'active' : ''}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
