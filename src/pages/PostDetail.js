import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import { marked } from 'marked';  // 
import './PostDetail.css'; // スタイルシートをインポート

export default function PostDetail() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // ★ state名を postDetail に変更して重複を避ける
  const [postDetail, setPostDetail] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPostDetail(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // 編集後に一覧へ戻る、削除処理もこちらで定義
  const handleDelete = async () => {
    if (!window.confirm('本当にこの投稿を削除しますか？')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/posts');
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました');
    }
  };

  if (!postDetail) return <p>読み込み中…</p>;

  return (
    <article className="post-detail">
      {/* 一覧に戻るボタン */}
      <button
       className="post-detail__back"
       onClick={() => navigate('/posts')}
      >
        ← 投稿一覧へ戻る
      </button>
      <h2 className="post-detail__title">{postDetail.title}</h2>
      <p className="post-detail__date">{postDetail.writeDate}</p>
      <div
        className="post-detail__content"
        dangerouslySetInnerHTML={{ __html: marked(postDetail.content) }}
      />

      {user?.role === 'admin' && (
        <div className="post-detail__actions">
          <button
            className="edit"
            onClick={() => navigate(`/posts/${id}/edit`)}
          >
            編集
          </button>
          <button
            className="delete"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      )}
    </article>
  );
}
