// src/hooks/usePosts.js
import { useState, useEffect } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    // バックエンドが localhost:4000 で動いている場合
    fetch('http://localhost:4000/api/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('記事一覧の取得に失敗しました');
        }
        return res.json();
      })
      .then((data) => {
        // data は [{ id, title, writeDate, tags }, ...] の配列
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        setPosts([]); // エラーでも空配列にしておく
      });
  }, []);

  return posts; // null → ローディング中、[] → 記事なし、それ以外 → 記事配列
}
