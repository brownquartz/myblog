// src/pages/PostDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import ReactMarkdown from 'react-markdown';
import './PostDetail.css';            // スタイルを適用

export default function PostDetail() {
  const { slug } = useParams();                 // 例: "2025-05-23-hajimete-no-tokou"
  const posts = usePosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return <p>Loading or Not Found…</p>;

  return (
    <article className="post-detail">
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
      <Link to="/posts">← Posts一覧に戻る</Link>
    </article>
  );
}