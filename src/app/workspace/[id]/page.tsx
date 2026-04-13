'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Download, Settings, Play, Square, ExternalLink,
  Copy, Check, ChevronRight, Users, FlaskConical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { WorkspaceHeader } from '@/components/workspace/workspace-header'
import { ResultCharts } from '@/components/workspace/result-charts'
import { ParticipantTable } from '@/components/workspace/participant-table'
import { Test, TestStatus } from '@/types'
import { toast } from 'sonner'

// 목 데이터
const MOCK_TEST: Test = {
  id: '1',
  user_id: 'user1',
  name: '커피 주문 경로 실험',
  description: '사용자 동선 최적화를 위한 A/B 테스트로 커피 주문에서의 이탈 지점을 연결합니다.',
  participation_type: 'manual',
  status: 'ended',
  start_at: '2026-04-08T01:01:00Z',
  created_at: '2025-04-14T00:00:00Z',
  variants: [
    {
      id: 'v1',
      test_id: '1',
      type: 'A',
      name: 'Flow A',
      description: '커피 주문 경로 간소화 테스트를 위한 대조군입니다.',
      prototype_url: 'https://www.figma.com/proto/example-a',
    },
    {
      id: 'v2',
      test_id: '1',
      type: 'B',
      name: 'Flow B',
      description: '커피 주문 경로 간소화 테스트를 위한 실험군(주문 경로 간소화 변경)입니다.',
      prototype_url: 'https://www.figma.com/proto/example-b',
    },
  ],
  task: {
    id: 't1',
    test_id: '1',
    title: '커피 주문하기',
    description: '앱에서 아이스 아메리카노 한 잔을 주문해보세요.',
  },
}

const STATUS_CONFIG: Record<TestStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '준비중', color: '#999999', bg: '#F2F2F2' },
  active:  { label: '진행중', color: '#F5A623', bg: '#FFF8EC' },
  ended:   { label: '종료',   color: '#666666', bg: '#F2F2F2' },
}

export default function TestDetailPage() {
  const params = useParams()
  const [test, setTest] = useState<Test>(MOCK_TEST)
  const [showOutlier, setShowOutlier] = useState(false)
  const [copied, setCopied] = useState(false)

  const status = STATUS_CONFIG[test.status]
  const updatedAt = new Date(test.start_at ?? test.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  const handleStatusChange = () => {
    if (test.status === 'pending') {
      setTest((t) => ({ ...t, status: 'active', start_at: new Date().toISOString() }))
      toast.success('테스트가 시작되었습니다!')
    } else if (test.status === 'active') {
      setTest((t) => ({ ...t, status: 'ended' }))
      toast.success('테스트가 종료되었습니다.')
    }
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/test/${test.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('테스트 링크가 복사되었습니다.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <WorkspaceHeader />

      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* 헤더 */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-heading-2 font-bold text-[#111111]">{test.name}</h1>
              <span
                className="text-body-4 font-medium px-2 py-0.5 rounded-full"
                style={{ color: status.color, backgroundColor: status.bg }}
              >
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-4 text-[#999999]">업데이트 : {updatedAt}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-[#E6E6E6] text-[#666666] rounded-lg text-body-4 gap-1.5"
              >
                <Download size={13} />
                다운로드
              </Button>
            </div>
          </div>

          {test.description && (
            <p className="text-body-2 text-[#666666] mb-6">{test.description}</p>
          )}

          {/* 스텝바 */}
          <div className="bg-[#F7F7F7] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-4 h-px bg-[#E6E6E6] mx-16" />
              {[
                { label: '준비중', done: true },
                { label: '진행중', done: test.status === 'active' || test.status === 'ended' },
                { label: '종료',   done: test.status === 'ended' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-body-4 font-bold ${
                      s.done ? 'bg-[#111111] !text-white' : 'bg-white border-2 border-[#E6E6E6] text-[#CCCCCC]'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-body-4 ${s.done ? 'text-[#111111] font-medium' : 'text-[#CCCCCC]'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-3 mb-8">
            {test.status !== 'ended' && (
              <Button
                onClick={handleStatusChange}
                className={`h-9 px-5 rounded-lg text-body-2 flex items-center gap-2 ${
                  test.status === 'pending'
                    ? 'bg-[#111111] hover:bg-[#333333]'
                    : 'bg-[#FF5B5B] hover:bg-[#e54a4a]'
                }`}
                style={{ color: 'white' }}
              >
                {test.status === 'pending' ? (
                  <><Play size={14} /> 테스트 시작</>
                ) : (
                  <><Square size={14} /> 테스트 종료하기</>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="h-9 px-4 border-[#E6E6E6] text-[#666666] rounded-lg text-body-2 flex items-center gap-2"
            >
              {copied ? <Check size={14} className="text-[#06C755]" /> : <Copy size={14} />}
              테스트 링크 복사
            </Button>
            <Link href={`/workspace/${test.id}/heatmap`}>
              <Button
                variant="outline"
                className="h-9 px-4 border-[#E6E6E6] text-[#666666] rounded-lg text-body-2 flex items-center gap-2"
              >
                🔥 히트맵
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-9 w-9 p-0 text-[#999999] hover:text-[#111111]"
            >
              <Settings size={16} />
            </Button>
          </div>

          {/* 베리언트 개요 */}
          <section className="mb-8">
            <h2 className="text-title-3 font-semibold text-[#111111] mb-4">베리언트 개요</h2>
            <div className="grid grid-cols-2 gap-4">
              {test.variants?.map((v) => {
                const vColor = v.type === 'A' ? '#F5A623' : '#06C755'
                return (
                  <div key={v.id} className="bg-[#F7F7F7] rounded-xl p-5 border border-[#E6E6E6]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${vColor}20` }}
                        >
                          <span className="text-body-4 font-black" style={{ color: vColor }}>{v.type}</span>
                        </div>
                        <span className="text-body-3 font-semibold text-[#111111]">베리언트 {v.type}</span>
                      </div>
                      <a
                        href={v.prototype_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-body-4 text-[#4B96F3] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        프로토타입 확인
                      </a>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-body-4 text-[#999999]">이름</p>
                        <p className="text-body-2 font-medium text-[#111111]">{v.name}</p>
                      </div>
                      {v.description && (
                        <div>
                          <p className="text-body-4 text-[#999999]">설명</p>
                          <p className="text-body-2 text-[#444444]">{v.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 참여자 관리 (직접 배정 방식) */}
          {test.participation_type === 'manual' && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title-3 font-semibold text-[#111111]">참여자 관리</h2>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#999999]" />
                  <span className="text-body-3 text-[#999999]">총 0명</span>
                </div>
              </div>
              <ParticipantTable testId={test.id} variants={test.variants ?? []} />
            </section>
          )}

          {/* 실험 결과 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title-3 font-semibold text-[#111111]">실험 결과</h2>
              <div className="flex items-center gap-2">
                <span className="text-body-3 text-[#666666]">이상 데이터 끄기</span>
                <Switch
                  checked={showOutlier}
                  onCheckedChange={setShowOutlier}
                />
              </div>
            </div>
            <ResultCharts testId={test.id} showOutlier={showOutlier} />
          </section>
        </div>
      </main>
    </div>
  )
}
