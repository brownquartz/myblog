// src/hooks/usePosts.js
import matter from 'gray-matter';

export function usePosts() {
  // postsディレクトリ内の *.md ファイルをまとめて読み込む
  const context = require.context('../posts', false, /\.md$/);
  const posts = context.keys().map(key => {
    const file = context(key);
    const { data, content } = matter(file);
    return {
      id: data.id,
      title: data.title,
      writeDate: data.writeDate,
      tags: data.tags,
      content
    };
  });
  // 日付順にソートする例
  return posts.sort((a, b) => new Date(b.writeDate) - new Date(a.writeDate));
}
