// src/pages/PostsList.js
import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import './PostsList.css';
import { AuthContext } from '../contexts/AuthContext';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // 非表示にしたいタイトルのリスト
  const HIDDEN_TITLES = ['Markdown チートシート'];

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Failed to load posts:', err));
  }, []);

  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  );

  const toggleTag = tag => {
    setSelectedTags(tags =>
      tags.includes(tag)
        ? tags.filter(t => t !== tag)
        : [...tags, tag]
    );
  };

  const filteredPosts = posts
    .filter(p => !HIDDEN_TITLES.includes(p.title))
    .filter(p =>
      selectedTags.length === 0
        ? true
        : selectedTags.every(tag => (p.tags || []).includes(tag))
    );
  
  // 投稿削除ハンドラを定義
  const handleDelete = async (id) => {
    if (!window.confirm('本当にこの投稿を削除しますか？')) return;
    try {
      await api.delete(`/posts/${id}`);
      // state を更新して再レンダー
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="posts-container">
      <div className="posts-wrapper">
        <h2>Posts List</h2>
        {/* 管理者だけに表示される「新規投稿」ボタン */}
          {user && (
            <div className="create-post-button">
              <Link to="/posts/new">
                <button>新規投稿を作成</button>
              </Link>
            </div>
          )}
        <ul className="posts-list">
          
          {filteredPosts.map(post => (
            <li className="post-item" key={post.id}>
              {/* タイトル・日付 */}
              <div className="post-item-header">
                <h3>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <span className="post-item-date">{post.writeDate}</span>
              </div>

              {/* 管理者用 編集・削除ボタンを日付下に右寄せ */}
              {user?.role === 'admin' && (
                <div className="post-item-actions">
                  <button
                    className="edit"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                  >
                    編集
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(post.id)}
                  >
                    削除
                  </button>
                </div>
              )}
              <div>
                {/* {post.content
                  ? <span>{post.content.slice(0, 100) + '...' }</span> : ''} */}

              </div>
              {/* <div className="post-item-tags">
                {(post.tags || []).map(tag => (
                  <span key={tag} className="post-tag">
                    #{tag}
                  </span>
                ))}
              </div> */}
            </li>
          ))}
        </ul>
      </div>
      
      <aside className="tag-sidebar">
        <h3>Tags</h3>
        <div className="tag-buttons">
          {/* “All” ボタン */}
          <button
            className={selectedTags.length === 0 ? 'active' : ''}
            onClick={() => setSelectedTags([])}
          >
            All
          </button>

          {/* 各タグボタン */}
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
    </div>
  );
}
