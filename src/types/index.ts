export type UserRole = 'user' | 'admin'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'
export type DrawMode = 'random' | 'weighted'
export type DrawStatus = 'pending' | 'simulated' | 'published'
export type PaymentStatus = 'pending' | 'paid'
export type ProofStatus = 'pending' | 'approved' | 'rejected'
export type MatchType = '3-match' | '4-match' | '5-match'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  razorpay_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Charity {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website: string | null
  category: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  razorpay_subscription_id: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  score_date: string
  created_at: string
}

export interface UserCharitySelection {
  id: string
  user_id: string
  charity_id: string
  contribution_percentage: number
  selected_at: string
  charity?: Charity
}

export interface Draw {
  id: string
  draw_month: string
  mode: DrawMode
  prize_pool: number
  jackpot_rollover: number
  status: DrawStatus
  winning_numbers: number[]
  created_at: string
  published_at: string | null
}

export interface DrawResult {
  id: string
  draw_id: string
  user_id: string
  matches: number
  prize_amount: number
  match_type: MatchType
  created_at: string
  user?: User
  draw?: Draw
}

export interface Winning {
  id: string
  user_id: string
  draw_result_id: string
  amount: number
  payment_status: PaymentStatus
  paid_at: string | null
  created_at: string
  draw_result?: DrawResult
}

export interface ProofUpload {
  id: string
  winning_id: string
  user_id: string
  file_url: string
  admin_status: ProofStatus
  admin_notes: string | null
  reviewed_at: string | null
  created_at: string
  winning?: Winning
  user?: User
}

export interface DashboardStats {
  subscription: Subscription | null
  scores: Score[]
  charitySelection: UserCharitySelection | null
  recentDraw: Draw | null
  drawResult: DrawResult | null
  totalWinnings: number
}

export interface AdminAnalytics {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  prizePool: number
  charityContributions: number
  recentUsers: User[]
}
