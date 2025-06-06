// src/pages/PostsList.js の例
import React, { useEffect, useState } from 'react';
import api from '../api/api'; // axios インスタンス

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        // もし proxy を使っているなら '/api/posts'、
        // 使っていないなら 'http://localhost:5000/api/posts' と書く
        const response = await api.get('/posts', {
          headers: {
            Authorization: `Bearer ${token}`   // token が正しく入っているか要確認
          }
        });
        setPosts(response.data);
      } catch (err) {
        console.error(err);
        // err.response?.data?.message が 'Token invalid' になっていないか確認
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}

export default PostsList;
