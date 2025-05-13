// src/app/posts/[slug]/page.tsx
import fs from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import Layout from '@/components/Layout'
import MDXContent from '@/components/MDXContent'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, '') }))
}

export default async function PostPage({ params }: Props) {
  const { slug } = params

  // 1. ファイル読み込み
  const filePath = path.join(process.cwd(), 'src', 'posts', `${slug}.mdx`)
  const source = fs.readFileSync(filePath, 'utf8')

  // 2. compileMDX でパース（FrontMatter も取得）
  const { content, frontmatter } = await compileMDX<{ title: string; date: string; tags?: string[] }>({
    source,
    options: { parseFrontmatter: true }
  })

  // 3. サーバーコンポーネントとして返却
  return (
    <Layout title={frontmatter.title}>
      <div className="grid grid-cols-4 gap-4">
        <aside className="col-span-1 border rounded p-4 space-y-4">
          <h2 className="font-bold mb-2">日付</h2>
          <time className="text-sm">{frontmatter.date}</time>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <>
              <h2 className="font-bold mb-2">タグ</h2>
              <ul className="space-y-1 text-sm">
                {frontmatter.tags!.map((tag) => <li key={tag}># {tag}</li>)}
              </ul>
            </>
          )}
        </aside>
        <main className="col-span-3 border rounded p-4 prose">
          compileMDX が返す ReactNode をそのまま描画
          {content}
          {/* <MDXContent source={mdxSource} /> */}
        </main>
      </div>
    </Layout>
  )
}
