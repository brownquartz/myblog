// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import matter from 'gray-matter';

export function usePosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    // src/posts フォルダから .md を一括インポート
    const req = require.context('../posts', false, /\.md$/);
    const keys = req.keys(); // ['./2025-05-23.md', './2025-05-24.md', ...]

    const all = keys.map((filename) => {
      // raw-loader で文字列として読み込まれた Markdown 全文
      const text = req(filename);
      const { data, content } = matter(text);

      // './2025-05-23.md' → '2025-05-23'
      const slug = filename.replace(/^\.\/(.*)\.md$/, '$1');

      return {
        ...data,       // front-matter の id, title, writeDate, tags など
        content,       // Markdown 本文
        slug,          // URL 用のスラッグ
      };
    });

    // id 降順でソートして state にセット
    setPosts(all.sort((a, b) => b.id - a.id));
  }, []);

  return posts;
}
