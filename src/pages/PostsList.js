// src/pages/PostsList.js
import React,{ useState,useMemo} from 'react';
import { posts } from '../data/posts';
import { Link, useSearchParams } from 'react-router-dom';
import './PostsList.css';

export default function PostsList() {
  
  // 1) タグ絞り込み用のステート
  const [selectedTags, setSelectedTags] = useState([]);

  // 2) 全タグのリストを生成
  const allTags = useMemo(() => {
    const tags = posts.flatMap(p => p.tags);
    return Array.from(new Set(tags)).sort();
  }, []);

  // 3) タグチェック・解除ハンドラ
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // タグでフィルタ→ID降順ソート
  const sorted = useMemo(() => {
    const filtered = selectedTags.length === 0
      ? posts
      : posts.filter(p =>
          // 選択したすべてのタグを含む投稿だけを残す
          selectedTags.every(t => p.tags.includes(t))
        );
    return [...filtered].sort((a, b) => b.id - a.id);
  }, [selectedTags]);

  // ページング（省略可能）
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const pageSize = 5;
  const totalPosts = sorted.length;
  const totalPages = Math.ceil(totalPosts / pageSize);
  const start = (page - 1) * pageSize;
  const pagePosts = sorted.slice(start, start + pageSize);


  return (
    <div className="posts-container">
      {/* ← タグボタンのサイドバー */}
      <aside className="tag-sidebar">
        <h3>Tags</h3>
        <div className="tag-buttons">
          {allTags.map(tag => (
            <button
              key={tag}
              className={selectedTags.includes(tag) ? 'active' : ''}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>

      <div className="posts-wrapper">
        <ul className="posts-list">
          {pagePosts.map(post => (
            <li key={post.id} className="post-item">
              <div className="post-item-header">
                <h3>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <span className="post-item-date">{post.writeDate}</span>
              </div>
            </li>
          ))}
        </ul>
        {/* ページング情報 */}
        <div className="range-info">
          ({start + 1}-{start + pagePosts.length}/{totalPosts})
        </div>
        {/* ページネーション */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                to={`/posts${p === 1 ? '' : `?page=${p}`}`}
                className={p === page ? 'active' : ''}
              >
                {p}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
