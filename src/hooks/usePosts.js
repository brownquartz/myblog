// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import matter from 'gray-matter';

export function usePosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    // src/posts フォルダ内の .md を自動列挙
    const req = require.context('../posts', false, /\.md$/);
    const keys = req.keys(); // ['./2025-05-23.md', './2025-05-26.md', ...]

    const all = keys.map((filename) => {
      // raw-loader で文字列として読み込まれた Markdown
      const raw = req(filename);
      // gray-matter で front-matter と本文に分割
      const { data, content } = matter(raw);
      // './2025-05-23.md' → '2025-05-23'
      const slug = filename.replace(/^\.\/(.*)\.md$/, '$1');

      return {
        // ← ここがポイント！data の各フィールドをスプレッドで展開
        ...data,     
        content,     // マークダウン本文
        slug,        // URL 用のスラッグ
      };
    });

    // id 降順でソートして state にセット
    setPosts(all.sort((a, b) => b.id - a.id));
  }, []);

  return posts;
}
