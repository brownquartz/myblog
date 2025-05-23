// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import matter from 'gray-matter';

export function usePosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const base = process.env.PUBLIC_URL || '';
    const indexUrl = `${base}/posts/index.json`;

    console.log('[usePosts] fetching index.json from', indexUrl);
    fetch(indexUrl)
      .then(res => {
        console.log('[usePosts] index.json status', res.status);
        if (!(res.status >= 200 && res.status < 300) && res.status !== 304) {
          throw new Error(`index.json fetch failed: ${res.status}`);
        }
        return res.json();
      })
      .then(files => {
        console.log('[usePosts] index.json files:', files);
        return Promise.all(
          files.map(filename => {
            // ブロックを開いて、ここで filename が使えるようにする
            const mdUrl = `${base}/posts/${filename}`;
            console.log('[usePosts] fetching markdown from', mdUrl);
            return fetch(mdUrl)
              .then(r => {
                console.log(`[usePosts] ${filename} status`, r.status);
                if (!(r.status >= 200 && r.status < 300) && r.status !== 304) {
                  throw new Error(`${filename} fetch failed: ${r.status}`);
                }
                return r.text();
              })
              .then(text => {
                console.log(`[usePosts] raw ${filename}:`, text.slice(0,80), '…');
                const { data, content } = matter(text);
                console.log(`[usePosts] front-matter ${filename}:`, data);
                // 正しくスプレッドして返す
                return { ...data, content, slug: filename.replace(/\.md$/, '') };
              });
          })
        );
      })
      .then(allPosts => {
        console.log('[usePosts] parsed posts array:', allPosts);
        setPosts(allPosts.sort((a, b) => b.id - a.id));
      })
      .catch(err => {
        console.error('[usePosts error]', err);
        setPosts([]);
      });
  }, []);

  return posts;
}
