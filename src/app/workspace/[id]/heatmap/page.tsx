'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WorkspaceHeader } from '@/components/workspace/workspace-header'

// 목 클릭 데이터
const MOCK_CLICKS = [
  { x: 0.3, y: 0.25, value: 5 },
  { x: 0.5, y: 0.3,  value: 8 },
  { x: 0.48, y: 0.28, value: 6 },
  { x: 0.52, y: 0.32, value: 4 },
  { x: 0.35, y: 0.4, value: 3 },
  { x: 0.6, y: 0.5,  value: 2 },
]

export default function HeatmapPage() {
  const params = useParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const heatmapRef = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState('B')
  const [page, setPage] = useState('01')
  const [zoom, setZoom] = useState(1)
  const [updatedAt] = useState('2026.04.08 01:01')

  useEffect(() => {
    if (!heatmapRef.current) return

    // heatmap.js 동적 로드
    const loadHeatmap = async () => {
      try {
        const h337 = (await import('heatmap.js')).default
        const instance = h337.create({
          container: heatmapRef.current!,
          radius: 40,
          maxOpacity: 0.8,
          minOpacity: 0,
          blur: 0.85,
        })

        const container = heatmapRef.current!
        const w = container.offsetWidth
        const h = container.offsetHeight

        const points = MOCK_CLICKS.map((c) => ({
          x: Math.round(c.x * w),
          y: Math.round(c.y * h),
          value: c.value,
        }))

        instance.setData({ max: 10, min: 0, data: points })
      } catch (e) {
        console.error('heatmap.js 로드 실패:', e)
      }
    }

    const timer = setTimeout(loadHeatmap, 100)
    return () => clearTimeout(timer)
  }, [variant, page])

  const handleZoomIn  = () => setZoom((z) => Math.min(z + 0.1, 2))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5))
  const handleReset   = () => setZoom(1)

  return (
    <div className="min-h-screen bg-white">
      <WorkspaceHeader />

      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href={`/workspace/${params.id}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#999999] hover:text-[#111111]">
                  <ChevronLeft size={18} />
                </Button>
              </Link>
              <h1 className="text-heading-2 font-bold text-[#111111]">히트맵</h1>
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

          {/* 필터 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-body-3 text-[#666666]">베리언트</span>
              <Select value={variant} onValueChange={(v) => v && setVariant(v)}>
                <SelectTrigger className="h-9 w-36 text-body-3 border-[#E6E6E6] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">베리언트 A</SelectItem>
                  <SelectItem value="B">베리언트 B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-3 text-[#666666]">페이지</span>
              <Select value={page} onValueChange={(v) => v && setPage(v)}>
                <SelectTrigger className="h-9 w-36 text-body-3 border-[#E6E6E6] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['01', '02', '03', '04', '05'].map((p) => (
                    <SelectItem key={p} value={p}>Variant {variant} {p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 히트맵 캔버스 */}
          <div
            ref={containerRef}
            className="bg-[#111111] rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ minHeight: 500 }}
          >
            {/* 줌 컨트롤 */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleReset}
                className="px-3 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-body-4 text-white transition-colors"
              >
                Reset
              </button>
            </div>

            {/* 모바일 프레임 + 히트맵 */}
            <div
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s', transformOrigin: 'center' }}
              className="relative"
            >
              {/* 모바일 프레임 */}
              <div className="w-[280px] bg-white rounded-[36px] border-4 border-[#333333] shadow-2xl overflow-hidden relative">
                {/* 노치 */}
                <div className="h-6 bg-[#333333] flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-[#555555] rounded-full" />
                </div>
                {/* 화면 영역 */}
                <div
                  ref={heatmapRef}
                  className="relative bg-white"
                  style={{ height: 420, position: 'relative' }}
                >
                  {/* 목 프로토타입 화면 */}
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-8 bg-[#F7F7F7] rounded-lg" />
                    <div className="h-32 bg-[#F2F2F2] rounded-xl" />
                    <div className="h-4 bg-[#F7F7F7] rounded w-3/4" />
                    <div className="h-4 bg-[#F7F7F7] rounded w-1/2" />
                    <div className="h-10 bg-[#06C755] rounded-xl opacity-20" />
                  </div>
                </div>
                {/* 홈 인디케이터 */}
                <div className="h-6 bg-white flex items-center justify-center">
                  <div className="w-20 h-1 bg-[#333333] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
