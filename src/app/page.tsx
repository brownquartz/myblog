// src/app/page.tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TagFilter from '@/components/TagFilter'

type Post = {
  slug:  string
  title: string
  date:  string
  tags:  string[]
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { tag?: string | string[] }
}) {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  // フロントマター読み込み
  const allPosts: Post[] = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const src = fs.readFileSync(path.join(postsDir, file), 'utf8')
      const { data } = matter(src)
      return {
        slug:  file.replace(/\.mdx$/, ''),
        title: data.title as string,
        date:  data.date as string,
        tags:  (data.tags as string[]) || [],
      }
    })
    // 新しい順にソート
    .sort((a, b) => b.date.localeCompare(a.date))

  // URL ?tag= を配列化
  const selectedTags = (() => {
    const t = searchParams.tag
    if (!t) return [] as string[]
    return Array.isArray(t) ? t : [t]
  })()

  // 複数タグで AND 絞り込み
  const filtered = selectedTags.length
    ? allPosts.filter((p) => selectedTags.every((t) => p.tags.includes(t)))
    : allPosts

  // 全タグ一覧をユニークで取得
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags)))

  return (
    <Layout title="勉強記録一覧">
      <div className="grid grid-cols-4 gap-4">
        {/* ─── 左サイドバー ─── */}
        <aside className="col-span-1 border rounded p-4 space-y-6">
          {/* 日付リスト */}
          <div>
            <h2 className="font-bold mb-1">日付</h2>
            <ul className="space-y-1">
              {filtered.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/posts/${p.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.date}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* タグフィルタ */}
          <div>
            <h2 className="font-bold mb-1">タグで絞り込み</h2>
            <TagFilter tags={allTags} />
          </div>
        </aside>

        {/* ─── 右メイン ─── */}
        <main className="col-span-3 border rounded p-4 space-y-4">
          {filtered.map((p) => (
            <div key={p.slug}>
              <Link
                href={`/posts/${p.slug}`}
                className="text-blue-600 font-bold hover:underline"
              >
                {p.title}
              </Link>
              <div className="text-sm text-gray-600">{p.date}</div>
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}
