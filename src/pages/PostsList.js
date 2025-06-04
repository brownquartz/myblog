// src/pages/PostsList.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './PostsList.css';

export default function PostsList() {
  const { user, token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  // ページネーション用
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 5;

  // API から記事一覧を取得
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || '記事一覧の取得に失敗しました');
        }
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    })();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }
  if (posts === null) {
    return <p>Loading...</p>;
  }
  if (posts.length === 0) {
    return <p>記事がありません。</p>;
  }

  const total = posts.length;
  const start = (page - 1) * pageSize;
  const pagePosts = posts.slice(start, start + pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const onDelete = async (id) => {
    if (!window.confirm('本当にこの記事を削除しますか？')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '削除に失敗しました');
      }
      // 削除成功 → 再度記事一覧を取得するか、クライアント上でフィルターする
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました: ' + err.message);
    }
  };

  return (
    <div className="posts-container">
      <aside className="tags-sidebar">
        {/* タグフィルタなどを置く領域。今回は省略 */}
      </aside>

      <div className="posts-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Posts 一覧</h2>
          {isAdmin && (
            <button
              onClick={() => navigate('/posts/new')}
              style={{ marginLeft: 'auto' }}
            >
              新規投稿
            </button>
          )}
        </div>
        <ul className="posts-list">
          {pagePosts.map((p) => (
            <li key={p.id} className="post-item">
              <div className="post-item-header">
                <h3>
                  <Link to={`/posts/${p.id}`}>{p.title}</Link>
                </h3>
                <span className="post-item-date">{p.writeDate}</span>
              </div>
              {isAdmin && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/posts/edit/${p.id}`)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    編集
                  </button>
                  <button onClick={() => onDelete(p.id)}>削除</button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="range-info">
          ({start + 1}-{Math.min(start + pageSize, total)}/{total})
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              to={`/posts?page=${i + 1}`}
              className={page === i + 1 ? 'currentPage' : ''}
              style={{ margin: '0 4px' }}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
