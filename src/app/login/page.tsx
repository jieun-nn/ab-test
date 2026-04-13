import { LoginForm } from '@/components/auth/login-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* 왼쪽: 로그인 폼 */}
      <div className="w-full lg:w-[480px] flex flex-col px-10 py-10 bg-white">
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-auto">
          <div className="w-8 h-8 bg-[#06C755] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
            </svg>
          </div>
          <span className="text-title-3 font-semibold text-[#111111]">ABTest</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#06C755]/10 text-[#06C755]">Beta</span>
        </div>

        {/* 로그인 콘텐츠 */}
        <div className="flex flex-col justify-center flex-1 max-w-[360px] mx-auto w-full">
          <h1 className="text-heading-1 font-bold text-[#111111] mb-2">
            환영합니다 👋
          </h1>
          <p className="text-body-2 text-[#666666] mb-8">
            로그인하고 A/B 테스트를 시작해보세요.
          </p>

          <LoginForm />

          <p className="text-body-4 text-[#999999] text-center mt-6">
            로그인하면{' '}
            <a href="#" className="underline hover:text-[#666666]">이용약관</a>
            {' '}및{' '}
            <a href="#" className="underline hover:text-[#666666]">개인정보처리방침</a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>

        <div className="mt-auto" />
      </div>

      {/* 오른쪽: 비주얼 */}
      <div className="hidden lg:flex flex-1 bg-[#F7F7F7] items-center justify-center relative overflow-hidden">
        {/* 배경 그리드 패턴 */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, #E6E6E6 1px, transparent 1px),
              linear-gradient(to bottom, #E6E6E6 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 중앙 카드 */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* A/B 카드 일러스트 */}
          <div className="relative">
            <div className="w-64 h-48 bg-white rounded-2xl shadow-lg border border-[#E6E6E6] flex items-center justify-center rotate-[-4deg] absolute -left-4 -top-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center">
                  <span className="text-4xl font-black text-[#F5A623]">A</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-24 bg-[#E6E6E6] rounded" />
                  <div className="h-2 w-16 bg-[#E6E6E6] rounded" />
                </div>
              </div>
            </div>
            <div className="w-64 h-48 bg-white rounded-2xl shadow-lg border border-[#E6E6E6] flex items-center justify-center rotate-[4deg] absolute left-4 top-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#06C755]/20 flex items-center justify-center">
                  <span className="text-4xl font-black text-[#06C755]">B</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-24 bg-[#E6E6E6] rounded" />
                  <div className="h-2 w-16 bg-[#E6E6E6] rounded" />
                </div>
              </div>
            </div>
            {/* 빈 공간 확보용 */}
            <div className="w-64 h-48 opacity-0" />
          </div>

          {/* 텍스트 */}
          <div className="text-center mt-8">
            <h2 className="text-title-2 font-bold text-[#111111] mb-2">
              The No-Code A/B Test Tool
            </h2>
            <p className="text-body-2 text-[#666666] max-w-xs">
              개발 없이 누구나 쉽고 빠르게
              <br />
              프로토타입 A/B 테스트를 시작하세요.
            </p>
          </div>

          {/* 통계 카드들 */}
          <div className="flex gap-4">
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-[#E6E6E6] text-center">
              <div className="text-title-2 font-bold text-[#06C755]">100%</div>
              <div className="text-body-4 text-[#999999]">목표 달성률</div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-[#E6E6E6] text-center">
              <div className="text-title-2 font-bold text-[#F5A623]">23s</div>
              <div className="text-body-4 text-[#999999]">평균 도달 시간</div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-[#E6E6E6] text-center">
              <div className="text-title-2 font-bold text-[#4B96F3]">A/B</div>
              <div className="text-body-4 text-[#999999]">분할 테스트</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
