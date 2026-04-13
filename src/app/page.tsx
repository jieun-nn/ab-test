import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        {/* Hero 섹션 */}
        <section className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden bg-white">
          {/* 배경 그리드 */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, #E6E6E6 1px, transparent 1px),
                linear-gradient(to bottom, #E6E6E6 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

          {/* 플로팅 장식 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-16 left-16 w-14 h-14 bg-[#06C755]/15 rounded-2xl rotate-12" />
            <div className="absolute top-32 right-24 w-10 h-10 bg-[#F5A623]/15 rounded-full" />
            <div className="absolute bottom-40 left-24 w-12 h-12 bg-[#4B96F3]/15 rounded-xl -rotate-[8deg]" />
            <div className="absolute bottom-24 right-16 w-8 h-8 bg-[#FF5B5B]/15 rounded-full" />
            <div className="absolute top-1/3 right-12 w-16 h-16 bg-[#06C755]/10 rounded-3xl -rotate-12" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#06C755]/10 border border-[#06C755]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06C755]" />
              <span className="text-body-4 text-[#06C755] font-medium">No-Code A/B Testing</span>
            </div>

            <h1 className="text-[48px] md:text-[64px] font-black text-[#111111] leading-[1.15] tracking-tight mb-6">
              The No-Code
              <br />
              <span className="text-[#06C755]">A/B Test</span> Tool
            </h1>

            <p className="text-body-1 text-[#666666] max-w-xl mx-auto mb-10 leading-relaxed">
              기획자와 디자이너가 개발 없이 아이디어를
              <br />
              빠르게 검증할 수 있는 A/B 테스트 도구입니다.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <Button className="h-12 px-8 bg-[#111111] hover:bg-[#333333] text-title-5 font-medium rounded-xl" style={{ color: 'white' }}>
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="h-12 px-8 border-[#E6E6E6] text-[#666666] hover:bg-[#F7F7F7] text-title-5 font-medium rounded-xl">
                  더 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features 섹션 */}
        <section id="features" className="py-24 bg-[#F7F7F7]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 font-black text-[#111111] mb-4">
                이런 분들을 위한 툴이에요
              </h2>
              <p className="text-body-1 text-[#666666]">
                코딩 없이 프로토타입으로 A/B 테스트를 진행하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon="🎨"
                color="#06C755"
                title="Figma 프로토타입 연동"
                description="Figma나 바이브코딩 링크를 붙여넣기만 하면 바로 A/B 테스트 환경이 완성됩니다."
              />
              <FeatureCard
                icon="📊"
                color="#F5A623"
                title="실시간 데이터 분석"
                description="목표 달성률, 평균 도달 시간, 페이지별 클릭 수 등 핵심 지표를 한눈에 확인하세요."
              />
              <FeatureCard
                icon="🔥"
                color="#FF5B5B"
                title="히트맵 시각화"
                description="참여자가 어디를 클릭했는지 히트맵으로 직관적으로 파악할 수 있습니다."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 font-black text-[#111111] mb-4">
                이렇게 사용하세요
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { step: '01', title: '테스트 생성', desc: '이름, 설명을 입력하고 A/B 베리언트에 각각 프로토타입 링크를 등록합니다.' },
                { step: '02', title: '참여자 초대', desc: '테스트 링크를 공유하거나 직접 A/B를 배정해 참여자를 초대합니다.' },
                { step: '03', title: '결과 분석', desc: '수집된 데이터로 어떤 베리언트가 더 효과적인지 확인합니다.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 p-6 rounded-2xl bg-[#F7F7F7] hover:bg-[#F2F2F2] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#06C755] flex items-center justify-center flex-shrink-0">
                    <span className="text-body-4 font-black text-white">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-title-4 font-semibold text-[#111111] mb-1">{item.title}</h3>
                    <p className="text-body-2 text-[#666666]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-heading-1 font-black text-white mb-4">
              지금 바로 시작해보세요
            </h2>
            <p className="text-body-1 text-[#999999] mb-8">
              무료로 A/B 테스트를 시작하고
              <br />
              더 나은 UX 결정을 내리세요.
            </p>
            <Link href="/login">
              <Button className="h-12 px-10 bg-[#06C755] hover:bg-[#05B84C] text-white text-title-5 font-medium rounded-xl">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#111111] border-t border-white/10 py-8">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#06C755] rounded-md flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
                </svg>
              </div>
              <span className="text-body-3 font-semibold text-white">ABTest</span>
            </div>
            <p className="text-body-4 text-[#666666]">© 2026 ABTest. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}

function FeatureCard({
  icon, color, title, description,
}: {
  icon: string
  color: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E6E6E6] hover:shadow-md transition-shadow">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <h3 className="text-title-4 font-semibold text-[#111111] mb-2">{title}</h3>
      <p className="text-body-2 text-[#666666] leading-relaxed">{description}</p>
    </div>
  )
}
