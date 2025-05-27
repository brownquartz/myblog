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
    // const req = require.context('../posts', false, /\.md$/);


    let keys = req.keys();
    // ── A: 先頭が "./_" のファイルは除外 ──
    const hiddenPrefix   = './_'; // 隠しファイルはこれで始まる
    const priorityPrefix = './-'; // 優先表示ファイルはこれで始まる

    // 1) _ で始まるファイルは除外
    keys = keys.filter(key => !key.startsWith(hiddenPrefix));

    // 2) ! で始まるファイルを先頭に
    const priorityKeys = keys.filter(key => key.startsWith(priorityPrefix));
    const normalKeys   = keys.filter(key => !key.startsWith(priorityPrefix));

    priorityKeys.sort(); // 優先表示ファイルをソート
    normalKeys.sort();   // 通常ファイルもソート

    const orderedKeys  = [...priorityKeys, ...normalKeys];

    const all = orderedKeys.map((filename) => {
      const rawModule = req(filename);
      // rawModule が { default: '…' } の場合は default を、そうでなければ直に rawModule を使う
      const raw = typeof rawModule === 'string' ? rawModule : rawModule.default;

      const { data, content } = matter(raw);

      const slug = filename.replace(/^\.\/(.*)\.md$/, '$1').replace(/^[_-]/, ''); // 先頭の ! と _ を削除
      return { ...data, content, slug };
    });

    // setPosts(all.sort((a, b) => b.id - a.id));
    setPosts(all);
  }, []);

  return posts;
}
