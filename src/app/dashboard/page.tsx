'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/utils'
import Link from 'next/link'
import { CreditCard, Target, Trophy, Award, ArrowRight, TrendingUp, Heart, CheckCircle, AlertTriangle } from 'lucide-react'
import type { Score, Subscription, UserCharitySelection, Draw } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [scores, setScores] = useState<Score[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [charitySelection, setCharitySelection] = useState<UserCharitySelection & { charity?: { name: string } } | null>(null)
  const [recentDraw, setRecentDraw] = useState<Draw | null>(null)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [scoresRes, subRes, charityRes, drawRes, winningsRes] = await Promise.all([
        supabase.from('scores').select('*').eq('user_id', user!.id).order('score_date', { ascending: false }).limit(5),
        supabase.from('subscriptions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('user_charity_selections').select('*, charity:charities(name)').eq('user_id', user!.id).single(),
        supabase.from('draws').select('*').eq('status', 'published').order('draw_month', { ascending: false }).limit(1).single(),
        supabase.from('winnings').select('amount').eq('user_id', user!.id),
      ])
      setScores(scoresRes.data || [])
      setSubscription(subRes.data)
      setCharitySelection(charityRes.data)
      setRecentDraw(drawRes.data)
      const total = (winningsRes.data || []).reduce((sum: number, w: { amount: number }) => sum + Number(w.amount), 0)
      setTotalWinnings(total)
      setLoading(false)
    }
    load()
  }, [user])

  const avgScore = scores.length ? Math.round(scores.reduce((s, sc) => s + sc.score, 0) / scores.length) : 0
  const isActive = subscription?.status === 'active'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Subscription alert */}
      {!isActive && (
        <div className="flex items-center gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-400">No active subscription</p>
            <p className="text-xs text-cream-200/60 mt-0.5">Subscribe to enter monthly draws and track your scores.</p>
          </div>
          <Link href="/pricing" className="btn-primary text-sm py-2 px-4 shrink-0">Subscribe</Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: CreditCard,
            label: 'Subscription',
            value: isActive ? subscription?.plan || 'Active' : 'Inactive',
            sub: isActive && subscription?.current_period_end ? `Renews ${formatDate(subscription.current_period_end)}` : 'Not subscribed',
            color: isActive ? 'text-lime-500 bg-lime-500/10' : 'text-amber-400 bg-amber-500/10',
            badge: isActive,
          },
          {
            icon: Target,
            label: 'Avg Score',
            value: avgScore || '—',
            sub: `${scores.length} of 5 scores entered`,
            color: 'text-blue-400 bg-blue-500/10',
            badge: null,
          },
          {
            icon: Trophy,
            label: 'Last Draw',
            value: recentDraw ? formatMonthYear(recentDraw.draw_month) : '—',
            sub: recentDraw ? `Prize pool: ${formatCurrency(Number(recentDraw.prize_pool))}` : 'No draws yet',
            color: 'text-amber-400 bg-amber-500/10',
            badge: null,
          },
          {
            icon: Award,
            label: 'Total Winnings',
            value: formatCurrency(totalWinnings),
            sub: 'All-time prize earnings',
            color: 'text-rose-400 bg-rose-500/10',
            badge: null,
          },
        ].map(({ icon: Icon, label, value, sub, color, badge }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2.5 rounded-xl ${color} mb-4`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-cream-200/50 mb-1">{label}</p>
            <p className="font-bold text-lg text-cream-100 capitalize">
              {String(value)}
              {badge && <span className="ml-2 badge badge-active text-xs">Active</span>}
            </p>
            <p className="text-xs text-cream-200/40 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Grid: Scores + Charity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scores */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-cream-100">My Scores</h3>
              <p className="text-xs text-cream-200/50 mt-1">Last 5 Stableford scores</p>
            </div>
            <Link href="/dashboard/scores" className="btn-ghost text-xs gap-1.5">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {scores.length === 0 ? (
            <div className="text-center py-10">
              <Target className="w-10 h-10 text-cream-200/20 mx-auto mb-3" />
              <p className="text-sm text-cream-200/50">No scores yet</p>
              <Link href="/dashboard/scores" className="btn-primary text-sm mt-4 inline-flex">Add your first score</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, i) => (
                <div key={score.id} className="flex items-center justify-between px-4 py-3 bg-forest-800/40 rounded-xl border border-cream-200/8">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-forest-700 flex items-center justify-center text-xs text-cream-200/60">#{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-cream-100">{formatDate(score.score_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-lime-500">{score.score}</span>
                    <span className="text-xs text-cream-200/40">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charity & Draw */}
        <div className="space-y-4">
          {/* Charity card */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="font-semibold text-cream-100 text-sm">My Charity</h3>
            </div>
            {charitySelection ? (
              <>
                <p className="font-medium text-cream-100 text-sm leading-tight">{(charitySelection.charity as { name?: string })?.name ?? 'Unknown'}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-cream-200/50">Contribution</span>
                    <span className="text-lime-500 font-semibold">{charitySelection.contribution_percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-forest-700 overflow-hidden">
                    <div className="h-full bg-lime-500 rounded-full transition-all duration-700" style={{ width: `${charitySelection.contribution_percentage}%` }} />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <p className="text-sm text-cream-200/50 mb-3">No charity selected</p>
                <Link href="/dashboard/charity" className="btn-primary text-xs py-2 inline-flex">Select charity</Link>
              </div>
            )}
          </div>

          {/* Draw card */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-cream-100 text-sm">Draw Status</h3>
            </div>
            {isActive ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-lime-500 shrink-0" />
                <p className="text-sm text-cream-200/70">Entered in next draw</p>
              </div>
            ) : (
              <p className="text-sm text-cream-200/50">Subscribe to participate</p>
            )}
            {recentDraw && (
              <div className="mt-4 pt-4 border-t border-cream-200/10">
                <p className="text-xs text-cream-200/50 mb-2">Last draw winning numbers</p>
                <div className="flex gap-2 flex-wrap">
                  {recentDraw.winning_numbers.map((n: number) => (
                    <span key={n} className="w-8 h-8 rounded-lg bg-lime-500/20 text-lime-500 text-xs font-bold flex items-center justify-center">{n}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
