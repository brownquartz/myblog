// src/components/Layout.tsx
import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

export default function Layout({ title, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title} | My Blog</title>
      </Head>

      {/* ヘッダー */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        {/* Home ボタン */}
        <Link
          href="/"
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Home
        </Link>

        {/* ページタイトル */}
        <h1 className="text-lg font-semibold">{title}</h1>

        {/* 右側 空き */}
        <div className="w-12" />
      </header>

      {/* メイン領域 */}
      <main className="flex-1 px-4 py-6">{children}</main>

      {/* フッター */}
      <footer className="border-t px-4 py-3 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} My Blog
      </footer>
    </div>
  )
}
