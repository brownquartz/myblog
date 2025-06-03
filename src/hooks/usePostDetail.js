// src/hooks/usePostDetail.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function usePostDetail() {
  const { id } = useParams(); // React Router v6 での使い方
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetch(`http://localhost:4000/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('記事の取得に失敗しました');
        }
        return res.json();
      })
      .then((data) => {
        // data = { id, title, writeDate, tags, content }
        setPost(data);
      })
      .catch((err) => {
        console.error(err);
        setPost(null);
      });
  }, [id]);

  return post; // null → ローディング中もしくはエラー, オブジェクト → 記事データ
}
