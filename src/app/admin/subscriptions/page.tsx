'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, formatCurrency } from '@/lib/utils'
import { CreditCard } from 'lucide-react'

interface SubRow {
  id: string
  plan: string
  status: string
  current_period_end: string | null
  created_at: string
  razorpay_subscription_id: string | null
  user: { full_name: string | null; email: string }
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'cancelled'>('all')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('subscriptions')
        .select('*, user:users(full_name, email)')
        .order('created_at', { ascending: false })
      setSubs(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = subs.filter(s => filter === 'all' || s.status === filter)
  const activeCount = subs.filter(s => s.status === 'active').length
  const monthlyRevenue = activeCount * 849 // Estimated in INR

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Subscriptions</h1>
        <p className="text-cream-200/60 text-sm">{activeCount} active subscriptions · Est. monthly revenue {formatCurrency(monthlyRevenue)}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: subs.length, status: 'all' },
          { label: 'Active', count: subs.filter(s => s.status === 'active').length, status: 'active' },
          { label: 'Cancelled', count: subs.filter(s => s.status === 'cancelled').length, status: 'cancelled' },
          { label: 'Past Due', count: subs.filter(s => s.status === 'past_due').length, status: 'inactive' },
        ].map(({ label, count, status }) => (
          <button
            key={label}
            onClick={() => setFilter(status as typeof filter)}
            className={`card text-left transition-all ${filter === status ? 'border-lime-500/40' : ''}`}
          >
            <CreditCard className="w-4 h-4 text-cream-200/40 mb-3" />
            <p className="font-bold text-2xl text-cream-100">{count}</p>
            <p className="text-xs text-cream-200/50">{label}</p>
          </button>
        ))}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200/10">
                {['User', 'Plan', 'Status', 'Renews', 'Razorpay ID'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-cream-200/50">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-cream-200/50">No subscriptions found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="border-b border-cream-200/5 hover:bg-forest-800/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm text-cream-100">{s.user?.full_name || '—'}</p>
                    <p className="text-xs text-cream-200/50">{s.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 capitalize text-sm text-cream-100">{s.plan}</td>
                  <td className="px-5 py-4">
                    <span className={`badge text-xs ${s.status === 'active' ? 'badge-active' : s.status === 'cancelled' ? 'badge-inactive' : 'badge-pending'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-cream-200/50">
                    {s.current_period_end ? formatDate(s.current_period_end) : '—'}
                  </td>
                  <td className="px-5 py-4 text-xs text-cream-200/30 font-mono truncate max-w-[120px]">
                    {s.razorpay_subscription_id || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
