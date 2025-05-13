// src/app/page.tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Home.module.css'

export default async function HomePage() {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  const files    = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))
  const posts    = files.map(file => {
    const slug   = file.replace(/\.mdx$/, '')
    const source = fs.readFileSync(path.join(postsDir, file), 'utf8')
    const { data } = matter(source)
    return { slug, title: data.title as string, date: data.date as string }
  })

  return (
    <Layout title="勉強記録一覧">
      <div className="grid grid-cols-4 gap-4">
        {/* 日付リストを左に */}
        <aside className="col-span-1 border rounded p-4">
          <h2 className="font-bold mb-2">日付</h2>
          <ul className={styles.dateList}>
            {posts.map(p => (
              <li key={p.slug}>
                <Link href={`/posts/${p.slug}`} className={styles.link}>
                  {p.date}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        {/* タイトルリストを右に */}
        <main className="col-span-3 border rounded p-4 space-y-4">
          {posts.map(p => (
            <article key={p.slug}>
              <h3 className="text-lg font-semibold">
                <Link href={`/posts/${p.slug}`} className={styles.link}>
                  {p.title}
                </Link>
              </h3>
              <time className="text-sm text-gray-500">{p.date}</time>
            </article>
          ))}
        </main>
      </div>
    </Layout>
  )
}
