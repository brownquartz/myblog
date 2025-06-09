 import React from 'react';
 import { useParams } from 'react-router-dom';
 import { usePosts } from '../hooks/usePosts';
 import ReactMarkdown from 'react-markdown';
 import remarkGfm from 'remark-gfm';

 export default function PostDetail() {
   const { id } = useParams();
   const posts = usePosts();
   const post = posts.find(p => p.id === id);
   if (!post) return <div>Not found</div>;

   return (
     <article>
       <h1>{post.title}</h1>
       <ReactMarkdown remarkPlugins={[remarkGfm]}>
         {post.content}
       </ReactMarkdown>
     </article>
   );
 }