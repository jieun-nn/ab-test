'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E6E6E6]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
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
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-body-2 text-[#666666] hover:text-[#111111] transition-colors">
            서비스 소개
          </Link>
          <Link href="/workspace" className="text-body-2 text-[#666666] hover:text-[#111111] transition-colors">
            워크스페이스
          </Link>
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/workspace">
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                <AvatarFallback className="bg-[#06C755] text-white text-body-4 font-semibold">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-body-2 text-[#666666] hover:text-[#111111] h-9 px-4">
                  로그인
                </Button>
              </Link>
              <Link href="/login">
                <Button className="h-9 px-4 bg-[#111111] hover:bg-[#333333] text-body-2 rounded-lg" style={{ color: 'white' }}>
                  시작하기
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
