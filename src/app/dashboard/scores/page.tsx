'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Target, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import type { Score } from '@/types'

export default function ScoresPage() {
  const { user } = useAuth()
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadScores()
  }, [user])

  async function loadScores() {
    if (!user) return
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
    setScores(data || [])
    setLoading(false)
  }

  async function addScore(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const score = parseInt(newScore)
    if (score < 1 || score > 45) {
      setMessage({ type: 'error', text: 'Score must be between 1 and 45.' })
      setSubmitting(false)
      return
    }

    // Check for duplicate date
    const existing = scores.find(s => s.score_date === newDate)
    if (existing) {
      setMessage({ type: 'error', text: 'You already have a score for this date.' })
      setSubmitting(false)
      return
    }

    const { error } = await supabase
      .from('scores')
      .insert({ user_id: user!.id, score, score_date: newDate })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Score added successfully!' })
      setNewScore('')
      setNewDate('')
      loadScores()
    }
    setSubmitting(false)
  }

  async function deleteScore(id: string) {
    await supabase.from('scores').delete().eq('id', id)
    setScores(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">My Scores</h1>
        <p className="text-cream-200/60 text-sm">Track your Stableford performance. Up to 5 scores — newest replaces oldest.</p>
      </div>

      {/* Add Score */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-4 h-4 text-lime-500" />
          <h2 className="font-semibold text-cream-100">Add New Score</h2>
        </div>

        {message && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-5 ${
            message.type === 'success'
              ? 'bg-lime-500/10 border border-lime-500/20 text-lime-500'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <form onSubmit={addScore} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Score (1–45)</label>
              <input
                id="score-input"
                type="number"
                min={1}
                max={45}
                className="input"
                placeholder="e.g. 28"
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Date played</label>
              <input
                id="score-date"
                type="date"
                className="input"
                max={new Date().toISOString().split('T')[0]}
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            id="add-score-btn"
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center disabled:opacity-70"
          >
            {submitting ? 'Saving...' : 'Add Score'}
          </button>
        </form>
      </div>

      {/* Scores List */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-cream-100">Score History</h2>
          <span className="badge badge-active text-xs">{scores.length}/5 scores</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-10">
            <Target className="w-10 h-10 text-cream-200/20 mx-auto mb-3" />
            <p className="text-sm text-cream-200/50">No scores recorded yet. Add your first round!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((score, i) => {
              const barWidth = (score.score / 45) * 100
              return (
                <div key={score.id} className="flex items-center gap-4 px-4 py-4 bg-forest-800/40 rounded-2xl border border-cream-200/8 group">
                  <div className="w-7 h-7 rounded-lg bg-forest-700 flex items-center justify-center text-xs text-cream-200/60 shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-cream-200/70">{formatDate(score.score_date)}</span>
                      <span className="font-bold text-2xl text-lime-500">{score.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-forest-700 overflow-hidden">
                      <div className="h-full bg-lime-500/60 rounded-full" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteScore(score.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-cream-200/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
