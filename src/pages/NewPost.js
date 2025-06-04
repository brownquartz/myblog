// src/pages/NewPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostsForm.css';

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [writeDate, setWriteDate] = useState('');
  const [tags, setTags] = useState('');     // 例: カンマ区切りで入力
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // バリデーション簡易チェック
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          writeDate: writeDate.trim() || null,
          tags: tags.split(',').map(s => s.trim()),
          content: content.trim(),
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '投稿の作成に失敗しました');
      }
      // 作成に成功したら記事一覧ページに戻る
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
            placeholder="例：20250604勉強"
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
            placeholder="例: React, JavaScript, Grid"
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
