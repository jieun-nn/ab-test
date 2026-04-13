'use client'

import { useState } from 'react'
import { UserPlus, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Participant, Variant } from '@/types'

interface ParticipantTableProps {
  testId: string
  variants: Variant[]
}

const STATUS_MAP = {
  assigned:  { label: '배정됨',  color: '#999999', bg: '#F2F2F2' },
  started:   { label: '진행중',  color: '#F5A623', bg: '#FFF8EC' },
  completed: { label: '완료',    color: '#06C755', bg: '#EDFBF3' },
}

export function ParticipantTable({ testId, variants }: ParticipantTableProps) {
  const [participants, setParticipants] = useState<Participant[]>([])

  const handleAssign = (participantId: string, variantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, variant_id: variantId } : p
      )
    )
  }

  return (
    <div className="bg-[#F7F7F7] rounded-xl border border-[#E6E6E6] overflow-hidden">
      {participants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 border border-[#E6E6E6]">
            <UserPlus size={18} className="text-[#CCCCCC]" />
          </div>
          <p className="text-body-2 text-[#999999]">아직 참여자가 없어요</p>
          <p className="text-body-4 text-[#CCCCCC] mt-1">테스트 링크를 공유해 참여자를 초대하세요.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6E6E6]">
                <th className="text-left px-4 py-3 text-body-4 font-semibold text-[#999999]">닉네임</th>
                <th className="text-left px-4 py-3 text-body-4 font-semibold text-[#999999]">이메일</th>
                <th className="text-left px-4 py-3 text-body-4 font-semibold text-[#999999]">배정 베리언트</th>
                <th className="text-left px-4 py-3 text-body-4 font-semibold text-[#999999]">상태</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => {
                const statusInfo = STATUS_MAP[p.status]
                return (
                  <tr key={p.id} className="border-b border-[#E6E6E6] last:border-0 bg-white hover:bg-[#F7F7F7]">
                    <td className="px-4 py-3 text-body-2 text-[#111111] font-medium">{p.nickname}</td>
                    <td className="px-4 py-3 text-body-2 text-[#666666]">{p.email}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={p.variant_id ?? ''}
                        onValueChange={(val) => val && handleAssign(p.id, val)}
                      >
                        <SelectTrigger className="h-7 w-28 text-body-4 border-[#E6E6E6] rounded-lg">
                          <SelectValue placeholder="미배정" />
                        </SelectTrigger>
                        <SelectContent>
                          {variants.map((v) => (
                            <SelectItem key={v.id} value={v.id} className="text-body-3">
                              베리언트 {v.type} - {v.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-body-4 font-medium px-2 py-0.5 rounded-full"
                        style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F2F2F2]">
                          <MoreHorizontal size={14} className="text-[#999999]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-body-3">이메일 보내기</DropdownMenuItem>
                          <DropdownMenuItem className="text-body-3 text-[#FF5B5B]">삭제</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
