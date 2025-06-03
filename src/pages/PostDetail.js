// src/pages/PostDetail.js
import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePostDetail } from '../hooks/usePostDetail';
import './PostDetail.css';

export default function PostDetail() {
  const post = usePostDetail(); // null or { id, title, writeDate, tags, content }

  if (post === null) {
    return <p>Loading…</p>;
  }

  // もし API が 404 を返した場合などを考慮すると、post の中身が
  // { error: '記事が見つかりません' } みたいになっている可能性があるので、
  // 必要に応じてここでチェックしてあげても良いです。

  return (
    <article className="post-detail" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="post-header" style={{ marginTop: '1rem' }}>
        <h2 style={{ textAlign: 'center' }}>{post.title}</h2>
        <div style={{ textAlign: 'right' }}>{post.writeDate}</div>
      </div>

      <hr className="post-divider" />

      <div className="post-content">
        {/* ReactMarkdown と remark-gfm を使って Markdown をレンダリング */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <hr style={{ marginTop: '2rem' }} />

      <div style={{ marginTop: '2rem' }}>
        <Link to="/posts">← Posts 一覧に戻る</Link>
      </div>
    </article>
  );
}
