'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Home } from 'lucide-react'

export function WorkspaceHeader() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E6E6E6] h-14 flex items-center px-6">
      {/* 로고 */}
      <Link href="/" className="flex items-center gap-2 mr-8">
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
      </Link>

      {/* 네비게이션 */}
      <nav className="flex items-center gap-1 flex-1">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-body-2 text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] px-3 py-1.5 rounded-lg transition-colors"
        >
          <Home size={14} />
          서비스 소개
        </Link>
        <Link
          href="/workspace"
          className="text-body-2 text-[#111111] font-medium bg-[#F7F7F7] px-3 py-1.5 rounded-lg"
        >
          워크스페이스
        </Link>
      </nav>

      {/* 유저 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} />
            <AvatarFallback className="bg-[#06C755] text-white text-body-4 font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-3 py-2">
            <p className="text-body-3 font-medium text-[#111111] truncate">{session?.user?.name}</p>
            <p className="text-body-4 text-[#999999] truncate">{session?.user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-body-2 text-[#FF5B5B] cursor-pointer"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut size={14} className="mr-2" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
