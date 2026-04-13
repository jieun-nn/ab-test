'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Plus, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkspaceHeader } from '@/components/workspace/workspace-header'
import { TestCard } from '@/components/workspace/test-card'
import { Test } from '@/types'

export default function WorkspacePage() {
  const { data: session, status } = useSession()
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ab_tests') ?? '[]')
    setTests(stored)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#06C755] border-t-transparent rounded-full animate-spin" />
          <span className="text-body-2 text-[#999999]">로딩 중...</span>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/login')
  }

  const handleDelete = (id: string) => {
    setTests((prev) => {
      const updated = prev.filter((t) => t.id !== id)
      localStorage.setItem('ab_tests', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <WorkspaceHeader />

      <main className="pt-14">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-heading-2 font-bold text-[#111111]">워크스페이스</h1>
            <Link href="/workspace/new">
              <Button className="h-9 px-4 bg-[#111111] hover:bg-[#333333] text-body-2 rounded-lg flex items-center gap-2" style={{ color: 'white' }}>
                <Plus size={16} />
                테스트 생성
              </Button>
            </Link>
          </div>

          {/* 테스트 목록 */}
          {tests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tests.map((test) => (
                <TestCard key={test.id} test={test} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 bg-[#F7F7F7] rounded-2xl flex items-center justify-center mb-4">
        <FlaskConical size={28} className="text-[#CCCCCC]" />
      </div>
      <h3 className="text-title-4 font-semibold text-[#111111] mb-2">아직 테스트가 없어요</h3>
      <p className="text-body-2 text-[#999999] mb-6">첫 번째 A/B 테스트를 생성해보세요.</p>
      <Link href="/workspace/new">
        <Button className="h-10 px-6 bg-[#111111] hover:bg-[#333333] text-body-2 rounded-lg flex items-center gap-2" style={{ color: 'white' }}>
          <Plus size={16} />
          테스트 생성
        </Button>
      </Link>
    </div>
  )
}
