'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Users, Search, Shield, User } from 'lucide-react'

interface UserRow {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  subscription?: { status: string }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('users')
        .select('*, subscription:subscriptions(status)')
        .order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    await supabase.from('users').update({ role: newRole }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Users</h1>
          <p className="text-cream-200/60 text-sm">{users.length} total registered users</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-200/40" />
        <input type="text" className="input pl-12" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200/10">
                <th className="text-left px-6 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">Subscription</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">Joined</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-cream-200/50">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-cream-200/50">No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-b border-cream-200/5 hover:bg-forest-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-cream-100">{u.full_name || '—'}</p>
                      <p className="text-xs text-cream-200/50">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${u.role === 'admin' ? 'badge-pending' : 'badge-active'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.subscription ? (
                      <span className={`badge text-xs ${(u.subscription as { status: string }).status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {(u.subscription as { status: string }).status}
                      </span>
                    ) : (
                      <span className="text-xs text-cream-200/30">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-cream-200/50">{formatDate(u.created_at)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      className="flex items-center gap-1.5 text-xs text-cream-200/60 hover:text-amber-400 transition-colors"
                    >
                      {u.role === 'admin' ? <User className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      Make {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
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
