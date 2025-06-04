// src/pages/PostForm.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostForm() {
  const { token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();  // /posts/edit/:id or /posts/new のとき id は undefined

  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [writeDate, setWriteDate] = useState('');
  const [tags, setTags] = useState(''); // カンマ区切りなど、文字列で一旦扱う
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // 編集モードなら既存記事をフェッチしてフォームに流し込む
  useEffect(() => {
    if (isEditMode) {
      (async () => {
        try {
          const res = await fetch(`/api/posts/${id}`);
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || '記事の取得に失敗しました');
          }
          setTitle(data.title);
          setWriteDate(data.writeDate);
          setTags(data.tags.join(',')); // 配列をカンマ区切り文字列に変換
          setContent(data.content);
        } catch (err) {
          console.error(err);
          setError(err.message);
        }
      })();
    } else {
      // 新規投稿の場合、writeDateに今日の日付をセットしておく例
      setWriteDate(new Date().toISOString().slice(0, 10));
    }
  }, [id, isEditMode]);

  if (!isAdmin) {
    return <p>管理者権限が必要です。</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagArray = tags.split(',').map((t) => t.trim()).filter((t) => t);
    const payload = { title, writeDate, tags: tagArray, content };
    try {
      const url = isEditMode ? `/api/posts/${id}` : '/api/posts';
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isEditMode ? '更新に失敗' : '作成に失敗'));
      }
      // 成功したら、該当記事ページへ遷移
      navigate(`/posts/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2>{isEditMode ? '記事編集' : '新規投稿'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>タイトル</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>作成日</label>
          <br />
          <input
            type="date"
            value={writeDate}
            onChange={(e) => setWriteDate(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>タグ（カンマ区切り）</label>
          <br />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>本文</label>
          <br />
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <button type="submit">{isEditMode ? '更新する' : '作成する'}</button>
      </form>
    </div>
  );
}
