// src/pages/PostDetail.js
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { usePosts } from '../hooks/usePosts';
import './PostDetail.css';

export default function PostDetail() {
  const { slug } = useParams();
  const posts = usePosts();
  const navigate = useNavigate();

  // 読み込み中
  if (posts === null) return <p>Loading…</p>;
  // slug に合う投稿がなかったら一覧へリダイレクト
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    navigate('/posts', { replace: true });
    return null;
  }

  return (
    <article className="post-detail" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="post-header">
        <h2>{post.title}</h2>
        <span className="post-date">{post.writeDate}</span>
      </div>
      <hr className="post-divider" />
      <div className="post-content">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/posts">← Posts一覧に戻る</Link>
      </div>
    </article>
  );
}
