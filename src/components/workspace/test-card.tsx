'use client'

import Link from 'next/link'
import { MoreHorizontal, Trash2, ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Test, TestStatus } from '@/types'

const STATUS_MAP: Record<TestStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: '준비중', color: '#999999', bg: '#F2F2F2' },
  active:   { label: '진행중', color: '#F5A623', bg: '#FFF8EC' },
  ended:    { label: '종료',   color: '#666666', bg: '#F2F2F2' },
}

interface TestCardProps {
  test: Test
  onDelete?: (id: string) => void
}

export function TestCard({ test, onDelete }: TestCardProps) {
  const status = STATUS_MAP[test.status]
  const createdAt = new Date(test.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })

  return (
    <Link href={`/workspace/${test.id}`}>
      <div className="group bg-white rounded-2xl border border-[#E6E6E6] overflow-hidden hover:shadow-md hover:border-[#CCCCCC] transition-all cursor-pointer">
        {/* 썸네일 */}
        <div className="aspect-[4/3] bg-[#F7F7F7] flex items-center justify-center relative">
          <ABThumbnail />
          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-body-4 font-medium text-[#111111]">상세 보기</span>
            </div>
          </div>
        </div>

        {/* 카드 정보 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-body-4 font-medium px-2 py-0.5 rounded-full"
              style={{ color: status.color, backgroundColor: status.bg }}
            >
              {status.label}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.preventDefault()}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F2F2F2] transition-colors"
              >
                <MoreHorizontal size={16} className="text-[#999999]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    window.location.href = `/workspace/${test.id}`
                  }}
                >
                  <ExternalLink size={14} className="mr-2" />
                  상세 보기
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[#FF5B5B] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete?.(test.id)
                  }}
                >
                  <Trash2 size={14} className="mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="text-title-5 font-semibold text-[#111111] mb-1 truncate">
            {test.name}
          </h3>
          <p className="text-body-4 text-[#999999]">생성일 : {createdAt}</p>
        </div>
      </div>
    </Link>
  )
}

function ABThumbnail() {
  return (
    <div className="relative w-32 h-24">
      {/* 뒤 카드 B */}
      <div className="absolute bottom-0 right-0 w-24 h-18 bg-white border border-[#E6E6E6] rounded-xl shadow-sm flex items-center justify-center rotate-[6deg]">
        <span className="text-3xl font-black text-[#E6E6E6]">B</span>
      </div>
      {/* 앞 카드 A */}
      <div className="absolute top-0 left-0 w-24 h-18 bg-white border border-[#D9D9D9] rounded-xl shadow flex items-center justify-center -rotate-[3deg]">
        <span className="text-3xl font-black text-[#CCCCCC]">A</span>
      </div>
    </div>
  )
}
