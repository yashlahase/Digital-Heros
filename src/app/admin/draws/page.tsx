'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, formatCurrency, formatMonthYear } from '@/lib/utils'
import { Trophy, Play, Eye, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import type { Draw } from '@/types'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [simulateResult, setSimulateResult] = useState<{ winning_numbers: number[]; results: { tier: string; count: number; amount: number }[] } | null>(null)
  const [mode, setMode] = useState<'random' | 'weighted'>('random')

  useEffect(() => {
    loadDraws()
  }, [])

  async function loadDraws() {
    const { data } = await supabase.from('draws').select('*').order('draw_month', { ascending: false })
    setDraws(data || [])
    setLoading(false)
  }

  async function simulateDraw() {
    setRunning(true)
    setSimulateResult(null)
    const res = await fetch('/api/draws/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) })
    const data = await res.json()
    setSimulateResult(data)
    setRunning(false)
  }

  async function publishDraw() {
    setRunning(true)
    const res = await fetch('/api/draws/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, publish: true }) })
    if (res.ok) {
      setSimulateResult(null)
      loadDraws()
    }
    setRunning(false)
  }

  async function publishExisting(drawId: string) {
    await supabase.from('draws').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', drawId)
    loadDraws()
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Draw Management</h1>
        <p className="text-cream-200/60 text-sm">Run monthly draws, simulate results, and publish winners.</p>
      </div>

      {/* Run Draw */}
      <div className="card border-lime-500/20 bg-lime-500/5">
        <h2 className="font-semibold text-cream-100 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-lime-500" />
          Run New Draw
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <label className="label mb-0">Draw mode:</label>
          <div className="flex gap-3">
            {(['random', 'weighted'] as const).map(m => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="accent-lime-500"
                />
                <span className="text-sm text-cream-100 capitalize">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={simulateDraw} disabled={running} className="btn-secondary text-sm py-2.5 px-5 disabled:opacity-60">
            <Eye className="w-4 h-4" />
            {running ? 'Running...' : 'Simulate'}
          </button>
          <button onClick={publishDraw} disabled={running} className="btn-primary text-sm py-2.5 px-5 disabled:opacity-60">
            <Play className="w-4 h-4" />
            {running ? 'Running...' : 'Run & Publish'}
          </button>
        </div>

        {/* Simulation result */}
        {simulateResult && (
          <div className="mt-6 p-5 bg-forest-800/60 rounded-2xl border border-cream-200/10">
            <p className="text-xs text-cream-200/50 mb-3 uppercase tracking-widest">Simulated Winning Numbers</p>
            <div className="flex gap-2 mb-5">
              {simulateResult.winning_numbers.map(n => (
                <div key={n} className="w-10 h-10 rounded-xl bg-lime-500 text-forest-900 font-bold flex items-center justify-center">{n}</div>
              ))}
            </div>
            <div className="space-y-2">
              {simulateResult.results.map(r => (
                <div key={r.tier} className="flex items-center justify-between text-sm">
                  <span className="text-cream-200/70">{r.tier}</span>
                  <span>{r.count} winner(s) — each {formatCurrency(r.amount)}</span>
                </div>
              ))}
            </div>
            <button onClick={publishDraw} className="btn-primary text-sm mt-4 py-2">Publish This Draw</button>
          </div>
        )}
      </div>

      {/* Historical draws */}
      <div className="card">
        <h2 className="font-semibold text-cream-100 mb-6">Draw History</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : draws.length === 0 ? (
          <div className="text-center py-10 text-cream-200/50">No draws yet</div>
        ) : (
          <div className="space-y-3">
            {draws.map(draw => (
              <div key={draw.id} className="flex items-center justify-between px-4 py-4 bg-forest-800/40 rounded-2xl border border-cream-200/8">
                <div>
                  <p className="font-medium text-cream-100 text-sm">{formatMonthYear(draw.draw_month)}</p>
                  <p className="text-xs text-cream-200/50">
                    Pool: {formatCurrency(Number(draw.prize_pool))} · Mode: {draw.mode}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${draw.status === 'published' ? 'badge-active' : draw.status === 'simulated' ? 'badge-pending' : 'badge-inactive'}`}>{draw.status}</span>
                  {draw.status !== 'published' && (
                    <button onClick={() => publishExisting(draw.id)} className="text-xs text-lime-500 hover:underline">Publish</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
