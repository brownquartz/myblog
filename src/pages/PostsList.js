// src/pages/PostsList.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      // 1) localStorage からトークンを取ってくる
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('token がありません → /login へ飛ばす');
        // navigate('/login') など
        return;
      }

      try {
        // 2) Authorization ヘッダー付きでリクエスト
        const res = await api.get('/posts', {
          headers: {
            Authorization: `Bearer ${token}`,  // ← 必ずここを付ける
          }
        });
        setPosts(res.data);
      } catch (err) {
        console.error('PostsList axios error:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          // トークン無効 or 期限切れ
          alert('セッションが無効です。再ログインしてください。');
          // logout(); navigate('/login'); など
        }
      }
    })();
  }, []);
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
