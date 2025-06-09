import React from 'react'
import { usePosts } from '../hooks/usePosts'

export default function PostsList() {
  const posts = usePosts()    // 旧：Markdown を require.context → parse
  console.log('🏷️ posts is', posts, Array.isArray(posts));
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  )
}
