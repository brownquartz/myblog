// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import matter from 'gray-matter';

export function usePosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    // const req = require.context('../posts', false, /\.md$/);
    // 「!!」プレフィックスで、raw-loader を強制適用します
    const req = require.context(
      '!!raw-loader?esModule=false!../posts',
      false,
      /\.md$/
    );
    let keys = req.keys();
    // ── A: 先頭が "./_" のファイルは除外 ──
    keys = keys.filter(key => !key.startsWith('./_'));

    const all = keys.map((filename) => {
      const rawModule = req(filename);
      // rawModule が { default: '…' } の場合は default を、そうでなければ直に rawModule を使う
      const raw = typeof rawModule === 'string' ? rawModule : rawModule.default;

      const { data, content } = matter(raw);

      const slug = filename.replace(/^\.\/(.*)\.md$/, '$1');
      return { ...data, content, slug };
    });

    setPosts(all.sort((a, b) => b.id - a.id));
  }, []);

  return posts;
}
