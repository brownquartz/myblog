// src/pages/NewPost.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import '../styles/PostsForm.css';

export default function NewPost() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    writeDate: '',
    tags: '',
    content: '',
    hidden: false
  });
  const [error, setError] = useState(null);

  // 未ログイン時はリダイレクトまたはメッセージ
  if (!user || !token) {
    return (
      <article className="posts-form">
        <h2 className="posts-form__title">新規投稿</h2>
        <p className="posts-form__error">ログインが必要です。</p>
      </article>
    );
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError('タイトルは必須です');
      return;
    }
    try {
      await api.post(
        '/posts',
        {
          title: form.title.trim(),
          date: form.writeDate || null,
          tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
          content: form.content.trim(),
          hidden: form.hidden
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/posts');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '投稿の作成に失敗しました');
    }
  };

  return (
    <article className="posts-form">
      <h2 className="posts-form__title">新規投稿の作成</h2>
      {error && <p className="posts-form__error">{error}</p>}
      <form className="posts-form__form" onSubmit={handleSubmit}>
        <div className="posts-form__group">
          <label htmlFor="title" className="posts-form__label">タイトル</label>
          <input
            id="title"
            name="title"
            type="text"
            className="posts-form__input"
            value={form.title}
            onChange={handleChange}
            placeholder="例：20250605勉強"
            required
          />
        </div>
        <div className="posts-form__group">
          <label htmlFor="writeDate" className="posts-form__label">日付</label>
          <input
            id="writeDate"
            name="writeDate"
            type="date"
            className="posts-form__input"
            value={form.writeDate}
            onChange={handleChange}
          />
        </div>
        <div className="posts-form__group">
          <label htmlFor="tags" className="posts-form__label">タグ (カンマ区切り)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="posts-form__input"
            value={form.tags}
            onChange={handleChange}
            placeholder="例: SQL, join, React"
          />
        </div>
        <div className="posts-form__group post-form__group--hidden">
          <label className="posts-form__label">
            <input
              name="hidden"
              type="checkbox"
              checked={form.hidden}
              onChange={handleChange}
            /> この投稿を非表示にする
          </label>
        </div>
        <div className="posts-form__group">
          <label htmlFor="content" className="posts-form__label">本文 (Markdown)</label>
          <textarea
            id="content"
            name="content"
            className="posts-form__textarea"
            rows="10"
            value={form.content}
            onChange={handleChange}
            placeholder="Markdown形式で入力できます"
            required
          />
        </div>
        <div className="posts-form__buttons">
          <button type="submit" className="posts-form__btn posts-form__btn--primary">作成</button>
          <button type="button" className="posts-form__btn" onClick={() => navigate('/posts')}>キャンセル</button>
        </div>
      </form>
    </article>
  );
}
