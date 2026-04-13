export type TestStatus = 'pending' | 'active' | 'ended'
export type ParticipationType = 'random' | 'manual'
export type VariantType = 'A' | 'B'
export type ParticipantStatus = 'assigned' | 'started' | 'completed'

export interface Test {
  id: string
  user_id: string
  name: string
  description?: string
  participation_type: ParticipationType
  status: TestStatus
  start_at?: string
  end_at?: string
  created_at: string
  variants?: Variant[]
  task?: Task
}

export interface Variant {
  id: string
  test_id: string
  type: VariantType
  name: string
  description?: string
  prototype_url: string
}

export interface Task {
  id: string
  test_id: string
  title: string
  description: string
}

export interface Participant {
  id: string
  test_id: string
  variant_id?: string
  nickname: string
  email: string
  status: ParticipantStatus
  started_at?: string
  completed_at?: string
  created_at: string
  variant?: Variant
}

export interface ClickEvent {
  id: string
  participant_id: string
  variant_id: string
  page_index: number
  x: number
  y: number
  clicked_at: string
}

export interface PageView {
  id: string
  participant_id: string
  page_index: number
  entered_at: string
  left_at?: string
  duration_ms?: number
}

export interface TestResult {
  variant_a: VariantStats
  variant_b: VariantStats
  srm: SRMResult
  page_clicks: PageClickStat[]
  page_dwell: PageDwellStat[]
  page_bounce: PageBounceStat[]
}

export interface VariantStats {
  variant_id: string
  variant_name: string
  participant_count: number
  completed_count: number
  goal_rate: number
  avg_time_ms: number
  total_clicks: number
}

export interface SRMResult {
  ratio_a: number
  ratio_b: number
  status: 'normal' | 'warning'
}

export interface PageClickStat {
  page_index: number
  variant_type: VariantType
  avg_clicks: number
}

export interface PageDwellStat {
  page_index: number
  variant_type: VariantType
  avg_duration_ms: number
}

export interface PageBounceStat {
  page_index: number
  variant_type: VariantType
  bounce_rate: number
}
