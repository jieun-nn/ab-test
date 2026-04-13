'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

type Phase = 'enter' | 'test' | 'done'

// 목 데이터
const MOCK_TEST = {
  id: '1',
  name: '커피 주문 경로 실험',
  task: {
    title: '커피 주문하기',
    description: '앱에서 아이스 아메리카노 한 잔을 주문해보세요.\n\n주문이 완료되면 결제 화면까지 이동해주세요.',
  },
  variant: {
    id: 'v1',
    type: 'A' as const,
    name: 'Flow A',
    prototype_url: 'https://www.figma.com/proto/example-a',
  },
}

export default function TestParticipantPage() {
  const params = useParams()
  const [phase, setPhase] = useState<Phase>('enter')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string>(crypto.randomUUID())

  // 테스트 시작
  const handleStart = () => {
    if (!nickname.trim() || !email.trim()) return
    setPhase('test')
    setStartTime(Date.now())
    // TODO: Supabase에 participant 저장
  }

  // iframe 위 투명 오버레이에서 클릭 이벤트 수집
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const clickData = {
      session_id: sessionIdRef.current,
      page_index: currentPage,
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      clicked_at: new Date().toISOString(),
    }
    // TODO: Supabase에 click 저장
    console.log('Click:', clickData)
  }, [currentPage])

  // Figma postMessage 이벤트로 페이지 전환 감지
  useEffect(() => {
    if (phase !== 'test') return

    const handleMessage = (e: MessageEvent) => {
      // Figma postMessage API
      if (e.data?.type === 'PRESENTED_NODE_CHANGED') {
        const newPage = currentPage + 1
        setCurrentPage(newPage)

        const pageViewData = {
          session_id: sessionIdRef.current,
          page_index: newPage,
          entered_at: new Date().toISOString(),
        }
        // TODO: Supabase에 pageview 저장
        console.log('Page changed:', pageViewData)
      }

      // 마지막 페이지 도달 감지 (Figma 플로우 종료)
      if (e.data?.type === 'FLOW_COMPLETED' || e.data?.type === 'NAVIGATION_END') {
        handleComplete()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [phase, currentPage])

  const handleComplete = () => {
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
    // TODO: Supabase에 완료 기록
    console.log('Completed in', elapsed, 'seconds')
    setPhase('done')
  }

  // Figma embed URL 변환
  const getEmbedUrl = (url: string) => {
    if (url.includes('figma.com/proto/') || url.includes('figma.com/design/')) {
      return url.replace('figma.com/', 'figma.com/embed?') + '&hotspot-hints=0&hide-ui=1'
    }
    return url
  }

  /* ── 단계: 참여자 입력 ── */
  if (phase === 'enter') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-8 right-8 w-20 h-20 bg-[#F5A623]/15 rounded-full" />
          <div className="absolute top-24 left-16 w-12 h-12 bg-[#06C755]/15 rounded-xl rotate-12" />
          <div className="absolute bottom-24 right-16 w-16 h-16 bg-[#4B96F3]/15 rounded-2xl -rotate-6" />
          <div className="absolute bottom-16 left-8 w-8 h-8 bg-[#FF5B5B]/15 rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* 로고 */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-7 h-7 bg-[#06C755] rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
              </svg>
            </div>
            <span className="text-title-4 font-semibold text-[#111111]">ABTest</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#06C755]/10 text-[#06C755]">Beta</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-8">
            <h1 className="text-title-2 font-bold text-[#111111] mb-1">환영합니다.</h1>
            <p className="text-body-2 text-[#999999] mb-6">테스트 참여 전 정보를 입력해주세요.</p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-body-3 font-medium text-[#444444]">닉네임 *</Label>
                <Input
                  placeholder="닉네임을 입력해 주세요."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="h-10 border-[#E6E6E6] rounded-lg text-body-2"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-body-3 font-medium text-[#444444]">이메일 *</Label>
                <Input
                  type="email"
                  placeholder="이메일을 입력해 주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 border-[#E6E6E6] rounded-lg text-body-2"
                />
              </div>

              <p className="text-body-4 text-[#BFBFBF]">
                업로드 참고 URL 및 이메일은 프로토타입과 연동됩니다.*
              </p>

              <Button
                onClick={handleStart}
                disabled={!nickname.trim() || !email.trim()}
                className="h-11 bg-[#111111] hover:bg-[#333333] disabled:bg-[#E6E6E6] disabled:text-[#BFBFBF] rounded-xl text-title-5 font-medium mt-2"
                style={{ color: 'white' }}
              >
                시작하기
              </Button>
            </div>
          </div>

          {/* 하단 프로토타입 미리보기 버튼 */}
          <div className="mt-4 flex items-center justify-center gap-2 text-body-4 text-[#999999]">
            <div className="w-4 h-4 bg-[#F7F7F7] border border-[#E6E6E6] rounded flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <rect x="0.5" y="0.5" width="3" height="3" rx="0.5" fill="#CCCCCC"/>
                <rect x="4.5" y="0.5" width="3" height="3" rx="0.5" fill="#CCCCCC"/>
                <rect x="0.5" y="4.5" width="3" height="3" rx="0.5" fill="#CCCCCC"/>
                <rect x="4.5" y="4.5" width="3" height="3" rx="0.5" fill="#CCCCCC"/>
              </svg>
            </div>
            완전한 프로토타입을 미리보기하려면 아래를 확인하세요.
          </div>
        </div>
      </div>
    )
  }

  /* ── 단계: 테스트 진행 ── */
  if (phase === 'test') {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        {/* 왼쪽: 지시문 패널 */}
        <div className="w-[320px] flex-shrink-0 border-r border-[#E6E6E6] flex flex-col bg-[#F7F7F7]">
          {/* 로고 */}
          <div className="h-14 border-b border-[#E6E6E6] px-5 flex items-center gap-2 bg-white">
            <div className="w-6 h-6 bg-[#06C755] rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
              </svg>
            </div>
            <span className="text-body-3 font-semibold text-[#111111]">테스트 과제</span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            <h2 className="text-title-3 font-bold text-[#111111] mb-3">
              {MOCK_TEST.task.title}
            </h2>
            <div className="text-body-2 text-[#444444] leading-relaxed whitespace-pre-line">
              {MOCK_TEST.task.description}
            </div>

            {/* 진행 정보 */}
            <div className="mt-6 pt-6 border-t border-[#E6E6E6]">
              <div className="flex items-center justify-between text-body-4 text-[#999999] mb-2">
                <span>현재 페이지</span>
                <span className="font-medium text-[#111111]">{currentPage + 1}</span>
              </div>
              <div className="flex items-center justify-between text-body-4 text-[#999999]">
                <span>경과 시간</span>
                <ElapsedTimer startTime={startTime!} />
              </div>
            </div>
          </div>

          {/* 수동 완료 버튼 */}
          <div className="p-5 border-t border-[#E6E6E6] bg-white">
            <Button
              onClick={handleComplete}
              variant="outline"
              className="w-full h-10 border-[#E6E6E6] text-[#666666] rounded-lg text-body-2"
            >
              테스트 완료
            </Button>
          </div>
        </div>

        {/* 오른쪽: 프로토타입 iframe */}
        <div className="flex-1 relative bg-[#F2F2F2]">
          {/* 투명 오버레이 - 클릭 좌표 수집 */}
          <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="absolute inset-0 z-10"
            style={{ cursor: 'default' }}
          />
          <iframe
            src={getEmbedUrl(MOCK_TEST.variant.prototype_url)}
            className="w-full h-full border-0"
            title="Prototype"
            allow="fullscreen"
          />
        </div>
      </div>
    )
  }

  /* ── 단계: 완료 ── */
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-10 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-[#06C755]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-[#06C755]" />
        </div>
        <h2 className="text-title-2 font-bold text-[#111111] mb-2">테스트 완료!</h2>
        <p className="text-body-2 text-[#666666] mb-1">
          참여해주셔서 감사합니다.
        </p>
        <p className="text-body-3 text-[#999999]">
          {nickname}님의 소중한 데이터가 기록되었습니다.
        </p>
      </div>
    </div>
  )
}

function ElapsedTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return (
    <span className="font-medium text-[#111111]">
      {m > 0 ? `${m}분 ` : ''}{s}초
    </span>
  )
}
