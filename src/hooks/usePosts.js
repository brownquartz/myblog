// src/hooks/usePosts.js
import { useState, useEffect } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState(null);  // null → "まだ読み込み中" を意味する
  const [error, setError] = useState(null);

  useEffect(() => {
    // バックエンドに GET /api/posts を投げる
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not OK (status ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        // data はバックエンドから返ってきた JSON の配列
        // (例: [ {id:1, title:"…", writeDate:"…", tags:[…], content:"…"}, … ])
        setPosts(data);
      })
      .catch((err) => {
        console.error('[usePosts] fetch error:', err);
        setError(err);
        setPosts([]); // エラー時でも空配列を返して「投稿なし」扱いにする
      });
  }, []);

  // 帰り値として { posts, error } の形を返しても良いですが、ここではシンプルに posts のみ
  return { posts, error };
}
