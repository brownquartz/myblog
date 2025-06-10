// src/pages/PostsList.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import './PostsList.css';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
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

  return (
    <div className="posts-container">
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

      <div className="posts-wrapper">
        <h2>Posts List</h2>
        <ul className="posts-list">
          {filteredPosts.map(post => (
            <li className="post-item" key={post.id}>
              <div className="post-item-header">
                <h3>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <span className="post-item-date">{post.writeDate}</span>
              </div>
              <div className="post-item-tags">
                {(post.tags || []).map(tag => (
                  <span key={tag} className="post-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
