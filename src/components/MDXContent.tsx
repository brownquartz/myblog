// src/components/MDXContent.tsx
'use client'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc'

type Props = {
  source: MDXRemoteSerializeResult
}

export default function MDXContent({ source }: Props) {
  return (
    <article className="prose prose-lg prose-blue mx-auto">
      <MDXRemote source={source} />
    </article>
  )
}
