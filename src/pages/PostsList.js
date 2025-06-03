// src/pages/PostsList.js
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import './PostsList.css';

export default function PostsList() {
  const posts = usePosts(); // null または [] または 配列
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 5;

  if (posts === null) {
    return <p>Loading…</p>;
  }
  if (posts.length === 0) {
    return <p>記事がありません。</p>;
  }

  // ページネーション処理
  const total = posts.length;
  const start = (page - 1) * pageSize;
  const pagePosts = posts.slice(start, start + pageSize);

  return (
    <div className="posts-container">
      {/* タグのサイドバーは別途実装するとして一旦省略 */}
      <div className="posts-wrapper">
        <h2>Posts 一覧</h2>
        <ul className="posts-list">
          {pagePosts.map((p) => (
            <li key={p.id} className="post-item">
              <div className="post-item-header">
                <h3>
                  <Link to={`/posts/${p.id}`}>{p.title}</Link>
                </h3>
                <span className="post-item-date">{p.writeDate}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="range-info">
          ({start + 1}-{Math.min(start + pageSize, total)}/{total})
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Link
                key={pageNum}
                to={`/posts?page=${pageNum}`}
                className={pageNum === page ? 'active-page' : ''}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
