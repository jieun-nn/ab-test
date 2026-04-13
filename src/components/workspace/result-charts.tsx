'use client'

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts'

// 목 데이터
const MOCK_RESULT = {
  avg_time: { a: 30, b: 23 },
  goal_rate: { a: 100.0, b: 85.7 },
  total_clicks: { a: 20, b: 10 },
  srm: { ratio: '45:55', status: '정상' },
  page_clicks: [
    { page: 'Variant A 01', value: 1.2, variant: 'A' },
    { page: 'Variant A 02', value: 0.8, variant: 'A' },
    { page: 'Variant A 03', value: 1.0, variant: 'A' },
    { page: 'Variant A 04', value: 2.2, variant: 'A' },
    { page: 'Variant A 05', value: 0.5, variant: 'A' },
    { page: 'Variant B 01', value: 0.5, variant: 'B' },
    { page: 'Variant B 02', value: 0.9, variant: 'B' },
    { page: 'Variant B 03', value: 2.8, variant: 'B' },
    { page: 'Variant B 04', value: 1.1, variant: 'B' },
  ],
  page_dwell: [
    { page: 'Variant A 01', value: 4, variant: 'A' },
    { page: 'Variant A 02', value: 6, variant: 'A' },
    { page: 'Variant A 03', value: 8, variant: 'A' },
    { page: 'Variant A 04', value: 7, variant: 'A' },
    { page: 'Variant A 05', value: 3, variant: 'A' },
    { page: 'Variant B 01', value: 5, variant: 'B' },
    { page: 'Variant B 02', value: 6, variant: 'B' },
    { page: 'Variant B 03', value: 5, variant: 'B' },
    { page: 'Variant B 04', value: 3, variant: 'B' },
  ],
}

const COLOR_A = '#F5A623'
const COLOR_B = '#06C755'
const GRAY = '#E6E6E6'

interface ResultChartsProps {
  testId: string
  showOutlier: boolean
}

export function ResultCharts({ testId, showOutlier }: ResultChartsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1행: 목표 도달 시간 + 목표 달성률 */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="목표 도달 시간"
          tooltip="테스트 시작부터 목표 페이지 도달까지 평균 시간"
        >
          <div className="flex justify-around items-center py-4">
            <DonutMetric value="30s" label="베리언트 A" color={COLOR_A} percent={60} />
            <DonutMetric value="23s" label="베리언트 B" color={COLOR_B} percent={46} />
          </div>
        </MetricCard>

        <MetricCard
          title="목표 달성률"
          tooltip="전체 참여자 중 목표 페이지에 도달한 비율"
        >
          <div className="flex justify-around items-center py-4">
            <DonutMetric value="100.0%" label="베리언트 A" color={COLOR_A} percent={100} />
            <DonutMetric value="85.7%" label="베리언트 B" color={COLOR_B} percent={85.7} />
          </div>
        </MetricCard>
      </div>

      {/* 2행: 총 클릭 수 + SRM */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="총 클릭 수"
          tooltip="각 베리언트의 전체 클릭 횟수"
        >
          <div className="flex justify-around items-center py-4">
            <DonutMetric value="20" label="베리언트 A" color={COLOR_A} percent={67} />
            <DonutMetric value="10" label="베리언트 B" color={COLOR_B} percent={33} />
          </div>
        </MetricCard>

        <MetricCard
          title="SRM (표본 비율 불일치)"
          tooltip="A/B 그룹의 참여자 비율이 의도한 비율과 다른지 확인"
        >
          <div className="flex justify-center items-center py-4">
            <SRMGauge ratio="45:55" status="정상" />
          </div>
        </MetricCard>
      </div>

      {/* 페이지별 평균 클릭 수 */}
      <MetricCard title="페이지별 평균 클릭 수" tooltip="각 페이지에서 평균적으로 발생한 클릭 수">
        <div className="h-48 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_RESULT.page_clicks} margin={{ left: -20, right: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" vertical={false} />
              <XAxis dataKey="page" tick={{ fontSize: 11, fill: '#999999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#999999' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #E6E6E6', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: '#F7F7F7' }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {MOCK_RESULT.page_clicks.map((entry, index) => (
                  <Cell key={index} fill={entry.variant === 'A' ? COLOR_A : COLOR_B} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </MetricCard>

      {/* 페이지별 평균 체류 시간 */}
      <MetricCard title="페이지별 평균 체류 시간" tooltip="각 페이지에서 평균적으로 머문 시간(초)">
        <div className="h-48 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart margin={{ left: -20, right: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" vertical={false} />
              <XAxis
                dataKey="page"
                type="category"
                allowDuplicatedCategory={false}
                tick={{ fontSize: 11, fill: '#999999' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}s`}
                tick={{ fontSize: 11, fill: '#999999' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ border: '1px solid #E6E6E6', borderRadius: 8, fontSize: 12 }}
                formatter={(val) => [`${val}s`, '체류 시간']}
              />
              <Area
                data={MOCK_RESULT.page_dwell.filter((d) => d.variant === 'A')}
                type="monotone"
                dataKey="value"
                stroke={COLOR_A}
                fill={`${COLOR_A}30`}
                strokeWidth={2}
                name="베리언트 A"
              />
              <Area
                data={MOCK_RESULT.page_dwell.filter((d) => d.variant === 'B')}
                type="monotone"
                dataKey="value"
                stroke={COLOR_B}
                fill={`${COLOR_B}30`}
                strokeWidth={2}
                name="베리언트 B"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </MetricCard>

      {/* 페이지별 이탈률 */}
      <MetricCard title="페이지별 이탈률" tooltip="각 페이지에서 테스트를 이탈한 비율">
        <div className="flex items-center justify-center h-32 text-body-2 text-[#CCCCCC]">
          아직 데이터가 없어요.
        </div>
      </MetricCard>
    </div>
  )
}

/* ── 서브 컴포넌트 ── */

function MetricCard({
  title, tooltip, children,
}: {
  title: string
  tooltip?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#E6E6E6] rounded-xl p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-body-3 font-semibold text-[#111111]">{title}</h3>
          {tooltip && (
            <div className="group relative cursor-help">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <div className="hidden group-hover:block absolute left-0 top-6 bg-[#333333] text-white text-body-4 px-2 py-1 rounded-lg w-48 z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <button className="text-body-4 text-[#4B96F3] hover:underline">성과 인사이트 보기</button>
      </div>
      {children}
    </div>
  )
}

function DonutMetric({
  value, label, color, percent,
}: {
  value: string
  label: string
  color: string
  percent: number
}) {
  const data = [
    { value: percent },
    { value: 100 - percent },
  ]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={42}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill={GRAY} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-title-4 font-bold text-[#111111]">{value}</span>
        </div>
      </div>
      <span className="text-body-4 text-[#999999]">{label}</span>
    </div>
  )
}

function SRMGauge({ ratio, status }: { ratio: string; status: string }) {
  const [left, right] = ratio.split(':').map(Number)
  const leftData = [{ value: left }, { value: 100 - left }]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-32 h-16 overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center">
          <PieChart width={128} height={128}>
            <Pie
              data={leftData}
              cx={64}
              cy={64}
              innerRadius={38}
              outerRadius={56}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={COLOR_A} />
              <Cell fill={COLOR_B} />
            </Pie>
          </PieChart>
        </div>
      </div>
      <span className="text-title-4 font-bold text-[#111111]">{status}</span>
      <span className="text-body-4 text-[#999999]">{ratio}</span>
    </div>
  )
}
