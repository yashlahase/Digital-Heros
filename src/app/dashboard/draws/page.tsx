'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatMonthYear } from '@/lib/utils'
import { Trophy, Zap, Star, Shield } from 'lucide-react'
import type { Draw, DrawResult } from '@/types'

export default function DrawsPage() {
  const { user } = useAuth()
  const [draws, setDraws] = useState<Draw[]>([])
  const [myResults, setMyResults] = useState<Record<string, DrawResult>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [drawsRes, resultsRes] = await Promise.all([
        supabase.from('draws').select('*').eq('status', 'published').order('draw_month', { ascending: false }).limit(10),
        supabase.from('draw_results').select('*, draw:draws(draw_month, winning_numbers)').eq('user_id', user!.id),
      ])
      setDraws(drawsRes.data || [])
      const resultsMap: Record<string, DrawResult> = {}
      ;(resultsRes.data || []).forEach((r: DrawResult) => { resultsMap[r.draw_id] = r })
      setMyResults(resultsMap)
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Draw History</h1>
        <p className="text-cream-200/60 text-sm">Your participation and results in past monthly draws.</p>
      </div>

      {draws.length === 0 ? (
        <div className="card text-center py-16">
          <Trophy className="w-12 h-12 text-cream-200/20 mx-auto mb-4" />
          <p className="text-cream-200/50">No published draws yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {draws.map(draw => {
            const result = myResults[draw.id]
            const didWin = !!result
            const matchIcon = result?.matches === 5 ? Zap : result?.matches === 4 ? Star : Shield

            return (
              <div key={draw.id} className={`card transition-all ${didWin ? 'border-lime-500/30 bg-lime-500/5' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-cream-100">{formatMonthYear(draw.draw_month)}</h3>
                      {didWin ? (
                        <span className="badge badge-active text-xs">Winner!</span>
                      ) : (
                        <span className="badge badge-inactive text-xs">No match</span>
                      )}
                    </div>
                    <p className="text-xs text-cream-200/50 mb-3">Prize pool: <span className="text-cream-100 font-medium">{formatCurrency(Number(draw.prize_pool))}</span></p>
                    <div className="flex gap-2">
                      {draw.winning_numbers.map((n: number) => (
                        <span key={n} className="w-9 h-9 rounded-xl bg-forest-700 text-cream-100 text-sm font-bold flex items-center justify-center">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  {didWin && result && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        {(() => { const Icon = matchIcon; return <Icon className="w-4 h-4 text-lime-500" /> })()}
                        <span className="font-bold text-lime-500">{result.match_type}</span>
                      </div>
                      <p className="font-bold text-2xl text-cream-100">{formatCurrency(Number(result.prize_amount))}</p>
                      <p className="text-xs text-cream-200/50 mt-1">Your prize</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
