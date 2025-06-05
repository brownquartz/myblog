// src/pages/NewPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostsForm.css';

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [writeDate, setWriteDate] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // バリデーション（例）
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    // localStorage からトークンを取得
    const token = localStorage.getItem('token');
    if (!token) {
      setError('トークンがありません。ログインしてください。');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // ← ここがポイント
        },
        body: JSON.stringify({
          title: title.trim(),
          writeDate: writeDate.trim() || null,
          tags: tags.split(',').map(s => s.trim()),
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '投稿の作成に失敗しました');
      }
      navigate('/posts');
    } catch (err) {
      console.error('NewPost submit error:', err);
      setError(err.message);
    }
  };

  return (
    <article className="posts-form">
      <h2>新規投稿</h2>
      {error && <p className="posts-form__error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="posts-form__group">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            className="posts-form__input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="例：20250605勉強"
          />
        </div>

        <div className="posts-form__group">
          <label htmlFor="writeDate">日付</label>
          <input
            id="writeDate"
            type="date"
            className="posts-form__input"
            value={writeDate}
            onChange={e => setWriteDate(e.target.value)}
          />
        </div>

        <div className="posts-form__group">
          <label htmlFor="tags">タグ (カンマ区切り)</label>
          <input
            id="tags"
            type="text"
            className="posts-form__input"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="例: SQL, サブクエリ, join"
          />
        </div>

        <div className="posts-form__group">
          <label htmlFor="content">本文 (Markdown)</label>
          <textarea
            id="content"
            className="posts-form__textarea"
            rows="15"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Markdown 形式で入力できます"
          />
        </div>

        <div className="posts-form__buttons">
          <button type="submit" className="posts-form__btn posts-form__btn--primary">
            作成
          </button>
          <button
            type="button"
            className="posts-form__btn"
            onClick={() => navigate('/posts')}
          >
            キャンセル
          </button>
        </div>
      </form>
    </article>
  );
}
