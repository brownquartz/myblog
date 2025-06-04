// src/pages/PostDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PostDetail.css';

export default function PostDetail() {
  // URL のパラメータ ":id" を取り出す (例: "/posts/2025-05-23" → id="2025-05-23")
  const { id } = useParams();  
  // バックエンドから記事を取ってきたときに入れておく state
  const [post, setPost] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // id（slug） が取得できてから fetch をかける
    if (!id) {
      setError('ID が不正です');
      setLoading(false);
      return;
    }

    // バックエンドの API エンドポイントを叩く
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`記事が見つかりません (${res.status})`);
        }
        return res.json();
      })
      .then(json => {
        setPost(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('PostDetail fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // ローディング中
  if (loading) {
    return <p className="loading">Loading…</p>;
  }

  // エラー時
  if (error) {
    return (
      <div className="post-detail">
        <p className="error">エラー: {error}</p>
        <p><Link to="/posts">← 投稿一覧に戻る</Link></p>
      </div>
    );
  }

  // 記事オブジェクトがない or 空オブジェクトだったら「記事がありません」
  if (!post) {
    return (
      <div className="post-detail">
        <p>記事がありません。</p>
        <p><Link to="/posts">← 投稿一覧に戻る</Link></p>
      </div>
    );
  }

  // 正常に取得できたら、以下をレンダリング
  return (
    <article className="post-detail">
      <div className="post-detail__header">
        <h2 className="post-detail__title">{post.title}</h2>
        <span className="post-detail__date">{post.writeDate || '日付なし'}</span>
      </div>

      <hr className="post-detail__divider" />

      <div className="post-detail__content">
        {/* ReactMarkdown + remarkGfm を使って markdown を HTML にレンダリング */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <hr className="post-detail__divider" />

      <div className="post-detail__footer">
        <Link to="/posts">← 投稿一覧に戻る</Link>
      </div>
    </article>
  );
}
