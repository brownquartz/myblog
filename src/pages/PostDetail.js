// src/pages/PostDetail.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error('Failed to load post:', err));
  }, [id]);

  if (!post) return <div>Loading…</div>;

  return (
    <article style={{ padding: 20 }}>
      <h1>{post.title}</h1>
      <p style={{ color: '#666' }}>{post.writeDate}</p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.content}
      </ReactMarkdown>
      
      <p>
        <Link to="/posts">← Back to list</Link>
      </p>
    </article>
  );
}
