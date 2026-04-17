'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Heart, Search, CheckCircle, AlertCircle } from 'lucide-react'
import type { Charity } from '@/types'

export default function CharityPage() {
  const { user } = useAuth()
  const [charities, setCharities] = useState<Charity[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [contribution, setContribution] = useState(10)
  const [currentCharity, setCurrentCharity] = useState<{ charity_id: string; contribution_percentage: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      if (!user) return
      const [charitiesRes, selectionRes] = await Promise.all([
        supabase.from('charities').select('*').eq('is_active', true).order('is_featured', { ascending: false }),
        supabase.from('user_charity_selections').select('*').eq('user_id', user.id).single(),
      ])
      setCharities(charitiesRes.data || [])
      if (selectionRes.data) {
        setCurrentCharity(selectionRes.data)
        setSelected(selectionRes.data.charity_id)
        setContribution(selectionRes.data.contribution_percentage)
      }
    }
    load()
  }, [user])

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  async function saveSelection() {
    if (!selected || !user) return
    setSaving(true)
    setMessage(null)

    if (currentCharity) {
      const { error } = await supabase
        .from('user_charity_selections')
        .update({ charity_id: selected, contribution_percentage: contribution })
        .eq('user_id', user.id)
      if (error) { setMessage({ type: 'error', text: error.message }); setSaving(false); return }
    } else {
      const { error } = await supabase
        .from('user_charity_selections')
        .insert({ user_id: user.id, charity_id: selected, contribution_percentage: contribution })
      if (error) { setMessage({ type: 'error', text: error.message }); setSaving(false); return }
    }

    setCurrentCharity({ charity_id: selected, contribution_percentage: contribution })
    setMessage({ type: 'success', text: 'Charity selection saved!' })
    setSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">My Charity</h1>
        <p className="text-cream-200/60 text-sm">Choose the charity that receives your monthly contribution (minimum 10%).</p>
      </div>

      {/* Contribution slider */}
      <div className="card">
        <h2 className="font-semibold text-cream-100 mb-4">Contribution Percentage</h2>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            min={10}
            max={100}
            value={contribution}
            onChange={e => setContribution(Number(e.target.value))}
            className="flex-1 h-2 accent-lime-500"
          />
          <span className="font-bold text-2xl text-lime-500 w-16 text-right">{contribution}%</span>
        </div>
        <p className="text-xs text-cream-200/50">Minimum 10% of your subscription goes to your chosen charity. You can increase this anytime.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-200/40" />
        <input
          type="text"
          className="input pl-12"
          placeholder="Search charities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
          message.type === 'success' ? 'bg-lime-500/10 border border-lime-500/20 text-lime-500' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Charity grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(charity => {
          const isSelected = selected === charity.id
          return (
            <button
              key={charity.id}
              onClick={() => setSelected(charity.id)}
              className={`card text-left transition-all duration-200 cursor-pointer ${
                isSelected ? 'border-lime-500/50 bg-lime-500/8' : 'hover:border-cream-200/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {charity.is_featured && <span className="badge badge-active text-xs mb-2">Featured</span>}
                  <h3 className="font-semibold text-cream-100 text-sm leading-tight mt-1">{charity.name}</h3>
                  <span className="text-xs text-cream-200/50">{charity.category}</span>
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-lime-500 shrink-0 ml-2" />
                )}
              </div>
              <p className="text-xs text-cream-200/50 leading-relaxed line-clamp-2">{charity.description}</p>
            </button>
          )
        })}
      </div>

      <button
        onClick={saveSelection}
        disabled={!selected || saving}
        className="btn-primary w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Charity Selection'}
      </button>
    </div>
  )
}
