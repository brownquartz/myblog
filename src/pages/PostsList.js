// src/pages/PostsList.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './PostsList.css';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ① localStorage からログイン時に保存したトークンを取り出す
    const token = localStorage.getItem('token');
    console.log('PostsList 用 token=', token);

    // ② トークンがなければエラー表示して終わり
    if (!token) {
      setError('トークンがありません');
      return;
    }

    // ③ トークンをヘッダーに載せて GET /api/posts を叩く
    fetch('/api/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // ← ここがポイント
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          // 401 や 403 なら、サーバーから返ってくる JSON にエラーメッセージがあるはず
          const err = await res.json();
          throw new Error(err.error || '投稿一覧の取得に失敗しました');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }
  if (!posts) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Posts 一覧</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            {p.title} ({p.writeDate})
          </li>
        ))}
      </ul>
    </div>
  );
}
