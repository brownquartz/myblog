'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  tags: string[]
}

export default function TagFilter({ tags }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const selected = params.getAll('tag') // ['review','2nd'] など

  // ボタン押下でタグをトグル
  const toggle = (tag: string) => {
    let next: string[]
    if (selected.includes(tag)) {
      next = selected.filter((t) => t !== tag)
    } else {
      next = [...selected, tag]
    }

    const qp = new URLSearchParams()
    next.forEach((t) => qp.append('tag', t))
    const qs = qp.toString()
    router.push(qs ? `/?${qs}` : `/`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = selected.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={
              'px-3 py-1 rounded-full border ' +
              (active
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 hover:bg-gray-100')
            }
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
