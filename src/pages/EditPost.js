// src/pages/EditPost.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostsForm.css';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [writeDate, setWriteDate] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // マウント時に記事情報をフェッチし、フォームに初期値をセット
  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('記事が見つかりません');
        return res.json();
      })
      .then(json => {
        setTitle(json.title);
        setWriteDate(json.writeDate || '');
        setTags(json.tags.join(', ')); // 配列をカンマ区切り文字列に変換
        setContent(json.content);
        setLoading(false);
      })
      .catch(err => {
        console.error('EditPost fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
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
        throw new Error(data.error || '更新に失敗しました');
      }
      navigate('/posts');
    } catch (err) {
      console.error('EditPost submit error:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="loading">Loading…</p>;
  }
  if (error) {
    return (
      <div className="posts-form">
        <p className="posts-form__error">エラー: {error}</p>
        <p><button onClick={() => navigate('/posts')}>投稿一覧に戻る</button></p>
      </div>
    );
  }

  return (
    <article className="posts-form">
      <h2>記事編集</h2>
      <form onSubmit={handleSubmit}>
        {/* 上とほぼ同じ入力フィールド */}
        <div className="posts-form__group">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            className="posts-form__input"
            value={title}
            onChange={e => setTitle(e.target.value)}
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
          />
        </div>
        <div className="posts-form__buttons">
          <button type="submit" className="posts-form__btn posts-form__btn--primary">
            保存
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
