// src/pages/PostForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import './PostForm.css';  // お好みでスタイルを当ててください

export default function PostForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    writeDate: '',
    content: '',
    tags: '',
    hidden: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post(
        '/posts',
        {
          title: form.title,
          date: form.writeDate,
          content: form.content,
          tags: form.tags.split(',').map(t => t.trim()),
          hidden: form.hidden
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/posts');
    } catch (err) {
      console.error(err);
      alert('投稿の作成に失敗しました');
    }
  };

  return (
    <article className="posts-form">
      <h2 className="posts-form__title">新規投稿の作成</h2>
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
            required
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
          />
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
            required
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

        <div className="posts-form__buttons">
          <button type="submit" className="posts-form__btn posts-form__btn--primary">
            投稿を作成
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
