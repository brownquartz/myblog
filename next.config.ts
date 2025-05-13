// next.config.ts
import { type NextConfig } from 'next'
import withMDX from '@next/mdx'

// MDX プラグインを初期化
const mdx = withMDX({
  // MDX と認識させる拡張子
  extension: /\.mdx?$/,
  options: {
    // 必要なら remarkPlugins / rehypePlugins を追加
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  // MDX を pages として扱うための拡張子リスト
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // ここに他の Next.js オプションも書けます
  reactStrictMode: true,
  // ...etc
}

// MDX プラグインでラップしてエクスポート
export default mdx(nextConfig)
