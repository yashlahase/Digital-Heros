'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Heart, Plus, Edit2, Trash2, Star, X } from 'lucide-react'
import type { Charity } from '@/types'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Charity | null>(null)
  const [form, setForm] = useState({ name: '', description: '', category: '', website: '', logo_url: '', is_featured: false })

  useEffect(() => { loadCharities() }, [])

  async function loadCharities() {
    const { data } = await supabase.from('charities').select('*').order('is_featured', { ascending: false })
    setCharities(data || [])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm({ name: '', description: '', category: '', website: '', logo_url: '', is_featured: false }); setShowForm(true) }
  function openEdit(c: Charity) { setEditing(c); setForm({ name: c.name, description: c.description || '', category: c.category || '', website: c.website || '', logo_url: c.logo_url || '', is_featured: c.is_featured }); setShowForm(true) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('charities').update(form).eq('id', editing.id)
    } else {
      await supabase.from('charities').insert({ ...form, is_active: true })
    }
    setShowForm(false)
    loadCharities()
  }

  async function deactivate(id: string) {
    await supabase.from('charities').update({ is_active: false }).eq('id', id)
    setCharities(prev => prev.filter(c => c.id !== id))
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from('charities').update({ is_featured: !current }).eq('id', id)
    setCharities(prev => prev.map(c => c.id === id ? { ...c, is_featured: !current } : c))
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Charities</h1>
          <p className="text-cream-200/60 text-sm">Manage charity listings shown to users.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" /> Add Charity
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-cream-100">{editing ? 'Edit Charity' : 'Add Charity'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-forest-700 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div><label className="label">Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div><label className="label">Description</label><textarea className="input h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label><input className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
                <div><label className="label">Website</label><input type="url" className="input" value={form.website} onChange={e => setForm({...form, website: e.target.value})} /></div>
              </div>
              <div><label className="label">Logo URL</label><input type="url" className="input" value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} /></div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="accent-lime-500" />
                <span className="text-sm text-cream-100">Featured charity</span>
              </label>
              <button type="submit" className="btn-primary w-full justify-center py-3">{editing ? 'Update' : 'Create'} Charity</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center py-12"><div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : charities.map(c => (
          <div key={c.id} className="card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {c.is_featured && <span className="badge badge-active text-xs mb-2">Featured</span>}
                <h3 className="font-semibold text-cream-100 text-sm leading-tight mt-1">{c.name}</h3>
                <span className="text-xs text-cream-200/50">{c.category}</span>
              </div>
            </div>
            <p className="text-xs text-cream-200/50 mb-4 line-clamp-2">{c.description}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-cream-200/10">
              <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-cream-200/60 hover:text-cream-100 hover:bg-forest-700 transition-all">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => toggleFeatured(c.id, c.is_featured)} className={`p-1.5 rounded-lg transition-all ${c.is_featured ? 'text-amber-400 bg-amber-500/10' : 'text-cream-200/40 hover:text-amber-400'}`}>
                <Star className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deactivate(c.id)} className="p-1.5 rounded-lg text-cream-200/40 hover:text-red-400 hover:bg-red-500/10 transition-all ml-auto">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
