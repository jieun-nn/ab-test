'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// 스텝 타입
type Step = 1 | 2 | 3 | 4

interface FormData {
  // 1단계
  name: string
  description: string
  participation_type: 'random' | 'manual'
  // 2단계 - 베리언트 A
  variant_a_name: string
  variant_a_description: string
  variant_a_url: string
  // 3단계 - 베리언트 B
  variant_b_name: string
  variant_b_description: string
  variant_b_url: string
  // 4단계 - 테스트 과제
  task_title: string
  task_description: string
}

const STEPS = [
  { num: 1, label: '기본 설정' },
  { num: 2, label: '베리언트 A' },
  { num: 3, label: '베리언트 B' },
  { num: 4, label: '테스트 과제' },
]

export default function NewTestPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    participation_type: 'random',
    variant_a_name: 'Flow A',
    variant_a_description: '',
    variant_a_url: '',
    variant_b_name: 'Flow B',
    variant_b_description: '',
    variant_b_url: '',
    task_title: '',
    task_description: '',
  })

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validateStep = (): boolean => {
    if (step === 1 && !form.name.trim()) {
      toast.error('테스트 이름을 입력해주세요.')
      return false
    }
    if (step === 2 && (!form.variant_a_name.trim() || !form.variant_a_url.trim())) {
      toast.error('베리언트 A 이름과 프로토타입 링크를 입력해주세요.')
      return false
    }
    if (step === 3 && (!form.variant_b_name.trim() || !form.variant_b_url.trim())) {
      toast.error('베리언트 B 이름과 프로토타입 링크를 입력해주세요.')
      return false
    }
    if (step === 4 && !form.task_title.trim()) {
      toast.error('테스트 과제 제목을 입력해주세요.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (step < 4) setStep((s) => (s + 1) as Step)
  }

  const handlePrev = () => {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    const newTest = {
      id: crypto.randomUUID(),
      user_id: 'local',
      name: form.name,
      description: form.description,
      participation_type: form.participation_type,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      variants: [
        {
          id: crypto.randomUUID(),
          test_id: '',
          type: 'A' as const,
          name: form.variant_a_name,
          description: form.variant_a_description,
          prototype_url: form.variant_a_url,
        },
        {
          id: crypto.randomUUID(),
          test_id: '',
          type: 'B' as const,
          name: form.variant_b_name,
          description: form.variant_b_description,
          prototype_url: form.variant_b_url,
        },
      ],
      task: {
        id: crypto.randomUUID(),
        test_id: '',
        title: form.task_title,
        description: form.task_description,
      },
    }

    const existing = JSON.parse(localStorage.getItem('ab_tests') ?? '[]')
    localStorage.setItem('ab_tests', JSON.stringify([newTest, ...existing]))

    toast.success('테스트가 생성되었습니다!')
    router.push('/workspace')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="h-14 border-b border-[#E6E6E6] flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
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
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽: 폼 */}
        <div className="w-full lg:w-[440px] flex flex-col border-r border-[#E6E6E6] overflow-y-auto">
          <div className="flex-1 px-10 py-8">
            {/* 스텝 인디케이터 */}
            <div className="mb-8">
              <p className="text-body-4 text-[#999999] mb-3">단계 {step}</p>
              <div className="flex gap-1.5">
                {STEPS.map((s) => (
                  <div
                    key={s.num}
                    className="flex-1 h-1 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        s.num < step ? '#06C755' :
                        s.num === step ? '#111111' :
                        '#E6E6E6',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 스텝별 폼 */}
            {step === 1 && <Step1 form={form} update={update} />}
            {step === 2 && <VariantStep variant="A" form={form} update={update} />}
            {step === 3 && <VariantStep variant="B" form={form} update={update} />}
            {step === 4 && <Step4 form={form} update={update} />}
          </div>

          {/* 하단 버튼 */}
          <div className="border-t border-[#E6E6E6] px-10 py-5 flex items-center justify-between flex-shrink-0">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-10 px-5 border-[#E6E6E6] text-[#666666] rounded-lg text-body-2"
              >
                이전
              </Button>
            ) : (
              <Link href="/workspace">
                <Button
                  variant="ghost"
                  className="h-10 px-5 text-[#666666] rounded-lg text-body-2"
                >
                  미리보기
                </Button>
              </Link>
            )}
            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="h-10 px-6 bg-[#111111] hover:bg-[#333333] rounded-lg text-body-2"
                style={{ color: 'white' }}
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="h-10 px-6 bg-[#06C755] hover:bg-[#05B84C] text-white rounded-lg text-body-2"
              >
                테스트 생성
              </Button>
            )}
          </div>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="hidden lg:flex flex-1 bg-[#F7F7F7] items-stretch justify-center overflow-hidden">
          <StepPreview step={step} form={form} />
        </div>
      </div>
    </div>
  )
}

/* ── 단계별 폼 ── */

function Step1({ form, update }: { form: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-title-2 font-bold text-[#111111] mb-1">기본 설정</h2>
        <p className="text-body-2 text-[#999999]">테스트에 대한 정보를 입력해 주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">
            이름 <span className="text-[#FF5B5B]">*</span>
          </Label>
          <Input
            placeholder="테스트 이름을 입력하세요."
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="h-10 border-[#E6E6E6] rounded-lg text-body-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">설명</Label>
          <Textarea
            placeholder="테스트에 대한 설명을 입력하세요."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="border-[#E6E6E6] rounded-lg text-body-2 resize-none min-h-[80px]"
            maxLength={200}
          />
          <p className="text-body-4 text-[#BFBFBF] text-right">{form.description.length}/200</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-body-3 font-medium text-[#444444]">테스트 참여방식</Label>
          <div className="flex flex-col gap-2">
            <ParticipationOption
              value="random"
              selected={form.participation_type === 'random'}
              onSelect={() => update('participation_type', 'random')}
              title="랜덤 나눔으로 참여"
              desc="링크에 접속하면 A/B 중 하나가 자동으로 배정됩니다."
            />
            <ParticipationOption
              value="manual"
              selected={form.participation_type === 'manual'}
              onSelect={() => update('participation_type', 'manual')}
              title="프로토팀 입력으로 참여"
              desc="대시보드에서 참여자를 보며 직접 A/B를 배정합니다."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function VariantStep({
  variant, form, update,
}: {
  variant: 'A' | 'B'
  form: FormData
  update: (k: keyof FormData, v: string) => void
}) {
  const prefix = variant === 'A' ? 'variant_a' : 'variant_b'
  const nameKey = `${prefix}_name` as keyof FormData
  const descKey = `${prefix}_description` as keyof FormData
  const urlKey  = `${prefix}_url` as keyof FormData
  const color   = variant === 'A' ? '#F5A623' : '#06C755'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <span className="text-body-3 font-black" style={{ color }}>{variant}</span>
          </div>
          <h2 className="text-title-2 font-bold text-[#111111]">베리언트 {variant} 설정</h2>
        </div>
        <p className="text-body-2 text-[#999999]">베리언트에 대한 정보를 입력해 주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">
            이름 <span className="text-[#FF5B5B]">*</span>
          </Label>
          <Input
            placeholder={`Flow ${variant}`}
            value={form[nameKey] as string}
            onChange={(e) => update(nameKey, e.target.value)}
            className="h-10 border-[#E6E6E6] rounded-lg text-body-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">설명</Label>
          <Textarea
            placeholder="베리언트에 대한 설명을 입력하세요."
            value={form[descKey] as string}
            onChange={(e) => update(descKey, e.target.value)}
            className="border-[#E6E6E6] rounded-lg text-body-2 resize-none min-h-[80px]"
            maxLength={130}
          />
          <p className="text-body-4 text-[#BFBFBF] text-right">{(form[descKey] as string).length}/130</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">
            프로토타입 링크 <span className="text-[#FF5B5B]">*</span>
          </Label>
          <Input
            placeholder="https://www.figma.com/... 또는 바이브코딩 링크"
            value={form[urlKey] as string}
            onChange={(e) => update(urlKey, e.target.value)}
            className="h-10 border-[#E6E6E6] rounded-lg text-body-2"
          />
          <p className="text-body-4 text-[#999999]">Figma(Figma → Share → Get prototype link) 또는 바이브코딩 프로토타입 링크를 입력하세요.</p>
        </div>
      </div>
    </div>
  )
}

function Step4({ form, update }: { form: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-title-2 font-bold text-[#111111] mb-1">테스트 과제 설정</h2>
        <p className="text-body-2 text-[#999999]">테스트 참여자들에게 제공할 과제 정보를 입력해 주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">
            제목 <span className="text-[#FF5B5B]">*</span>
          </Label>
          <Input
            placeholder="과제 제목을 입력하세요."
            value={form.task_title}
            onChange={(e) => update('task_title', e.target.value)}
            className="h-10 border-[#E6E6E6] rounded-lg text-body-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-body-3 font-medium text-[#444444]">설명</Label>
          <Textarea
            placeholder="참여자에게 전달할 지시문을 입력하세요."
            value={form.task_description}
            onChange={(e) => update('task_description', e.target.value)}
            className="border-[#E6E6E6] rounded-lg text-body-2 resize-none min-h-[120px]"
          />
        </div>
      </div>
    </div>
  )
}

/* ── 참여방식 옵션 ── */
function ParticipationOption({
  value, selected, onSelect, title, desc,
}: {
  value: string
  selected: boolean
  onSelect: () => void
  title: string
  desc: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
        selected
          ? 'border-[#111111] bg-[#F7F7F7]'
          : 'border-[#E6E6E6] bg-white hover:border-[#CCCCCC]'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          selected ? 'border-[#111111]' : 'border-[#D9D9D9]'
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-[#111111]" />}
      </div>
      <div>
        <p className="text-body-3 font-medium text-[#111111]">{title}</p>
        <p className="text-body-4 text-[#999999] mt-0.5">{desc}</p>
      </div>
    </button>
  )
}

/* ── Figma URL → embed URL 변환 ── */
function toEmbedUrl(url: string): string {
  if (!url) return ''
  // 이미 embed URL인 경우
  if (url.includes('figma.com/embed')) return url
  // Figma 링크인 경우 embed 포맷으로 변환
  if (url.includes('figma.com')) {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
  }
  // 그 외 링크 (바이브코딩 등)는 그대로
  return url
}

/* ── 스텝별 미리보기 ── */
function StepPreview({ step, form }: { step: Step; form: FormData }) {
  if (step === 1) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-[#E6E6E6] flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="4" width="14" height="14" rx="3" fill="#06C755" opacity="0.8"/>
            <rect x="22" y="4" width="14" height="14" rx="3" fill="#06C755" opacity="0.4"/>
            <rect x="4" y="22" width="14" height="14" rx="3" fill="#06C755" opacity="0.4"/>
            <rect x="22" y="22" width="14" height="14" rx="3" fill="#06C755" opacity="0.2"/>
          </svg>
        </div>
        <div>
          <p className="text-title-3 font-semibold text-[#111111] mb-1">A/B 테스트 만들기</p>
          <p className="text-body-3 text-[#999999]">기본 정보를 입력해주세요.</p>
        </div>
      </div>
    )
  }

  if (step === 2 || step === 3) {
    const isA = step === 2
    const url = isA ? form.variant_a_url : form.variant_b_url
    const color = isA ? '#F5A623' : '#06C755'
    const variant = isA ? 'A' : 'B'

    return (
      <div className="w-full h-full flex flex-col gap-3 px-8 py-6">
        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-4 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <p className="text-body-3 font-semibold text-[#111111]">프로토타입 {variant}</p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-4 text-[#4B96F3] hover:underline"
              >
                열기 ↗
              </a>
            )}
          </div>
          {url ? (
            <div className="flex-1 bg-[#F7F7F7] rounded-lg overflow-hidden min-h-0">
              <iframe
                src={toEmbedUrl(url)}
                className="w-full h-full border-0"
                title={`Variant ${variant} Preview`}
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex-1 bg-[#F7F7F7] rounded-lg flex items-center justify-center min-h-0">
              <div className="text-center px-4">
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center text-3xl font-black"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {variant}
                </div>
                <p className="text-body-3 font-medium text-[#999999] mb-1">왼쪽에 링크를 입력하면</p>
                <p className="text-body-4 text-[#BFBFBF]">프로토타입 미리보기가 여기에 표시됩니다.</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-body-4 text-[#999999] text-center flex-shrink-0">2개의 플로우를 생성하기</p>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-8">
        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6 w-full">
          <div className="w-10 h-10 bg-[#F7F7F7] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <h3 className="text-title-4 font-semibold text-[#111111] text-center mb-1">
            {form.task_title || 'AB Test'}
          </h3>
          <div className="space-y-2 mt-3">
            <div className="h-2 bg-[#F2F2F2] rounded w-full" />
            <div className="h-2 bg-[#F2F2F2] rounded w-4/5" />
            <div className="h-2 bg-[#F2F2F2] rounded w-3/5" />
          </div>
        </div>
        <p className="text-body-4 text-[#999999] text-center">
          A/B 테스트 과제
          <br />
          <span className="text-[#CCCCCC]">테스트 참여자들에게 제공할 과제 정보를 입력해 주세요.</span>
        </p>
      </div>
    )
  }

  return null
}
