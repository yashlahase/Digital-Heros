'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users, CreditCard, DollarSign, Heart, TrendingUp, Trophy } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalPrizePool: 0,
    totalCharityContributions: 0,
    pendingWinners: 0,
    totalDraws: 0,
  })
  const [recentUsers, setRecentUsers] = useState<{ id: string; full_name: string | null; email: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [usersRes, subsRes, drawsRes, winnersRes, recentUsersRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('draws').select('prize_pool, status'),
        supabase.from('winnings').select('id', { count: 'exact', head: true }).eq('payment_status', 'pending'),
        supabase.from('users').select('id, full_name, email, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const totalPrize = (drawsRes.data || []).reduce((s: number, d: { prize_pool: string | number }) => s + Number(d.prize_pool), 0)

      setStats({
        totalUsers: usersRes.count || 0,
        activeSubscriptions: subsRes.count || 0,
        totalPrizePool: totalPrize,
        totalCharityContributions: totalPrize * 0.1, // approximate
        pendingWinners: winnersRes.count || 0,
        totalDraws: (drawsRes.data || []).length,
      })
      setRecentUsers(recentUsersRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'bg-blue-500/10 text-blue-400' },
    { icon: CreditCard, label: 'Active Subs', value: stats.activeSubscriptions.toLocaleString(), color: 'bg-lime-500/10 text-lime-500' },
    { icon: Trophy, label: 'Total Draws', value: stats.totalDraws.toLocaleString(), color: 'bg-amber-500/10 text-amber-400' },
    { icon: DollarSign, label: 'Prize Pool', value: formatCurrency(stats.totalPrizePool), color: 'bg-emerald-500/10 text-emerald-400' },
    { icon: Heart, label: 'Charity Fund', value: formatCurrency(stats.totalCharityContributions), color: 'bg-rose-500/10 text-rose-400' },
    { icon: TrendingUp, label: 'Pending Claims', value: stats.pendingWinners.toLocaleString(), color: 'bg-purple-500/10 text-purple-400' },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Analytics Overview</h1>
        <p className="text-cream-200/60 text-sm">Platform performance at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2.5 rounded-xl ${color} mb-4`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-cream-200/50 mb-1">{label}</p>
            <p className="font-bold text-2xl text-cream-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="card">
        <h2 className="font-semibold text-cream-100 mb-6">Recent Signups</h2>
        <div className="space-y-3">
          {recentUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between py-3 border-b border-cream-200/8 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-lime-500/10 flex items-center justify-center text-lime-500 text-xs font-bold">
                  {(u.full_name || u.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-cream-100">{u.full_name || '—'}</p>
                  <p className="text-xs text-cream-200/50">{u.email}</p>
                </div>
              </div>
              <p className="text-xs text-cream-200/40">{formatDate(u.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
