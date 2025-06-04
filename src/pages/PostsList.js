// src/pages/PostsList.js
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import './PostsList.css';

export default function PostsList() {
  // usePosts フックが { posts, error } を返すようにしたので、
  // 以下のように分割代入して受け取る
  const { posts, error } = usePosts();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 5;

  // 1) posts がまだ null: 読み込み中
  if (posts === null) {
    return <p>Loading...</p>;
  }

  // 2) ネットワークエラーなどが起きた
  if (error) {
    return <p>記事を取得中にエラーが発生しました: {error.message}</p>;
  }

  // 3) posts が配列だが要素数ゼロ
  if (Array.isArray(posts) && posts.length === 0) {
    return <p>投稿がありません。</p>;
  }

  // 4) posts に要素がある場合、ページネーションして表示
  const total = posts.length;
  const start = (page - 1) * pageSize;
  const pagePosts = posts.slice(start, start + pageSize);

  return (
    <div className="posts-container">
      {/** タグサイドバーがある場合は <aside className="tags-sidebar">…</aside> などを挟んでもOK **/}

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
          ({start + 1}–{Math.min(start + pageSize, total)}/{total})
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => (
            <Link
              key={i + 1}
              to={`/posts?page=${i + 1}`}
              className={page === i + 1 ? 'current' : ''}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
