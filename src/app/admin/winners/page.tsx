'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Award, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

interface WinnerRow {
  id: string
  amount: number
  payment_status: string
  created_at: string
  user: { full_name: string | null; email: string }
  draw_result: { match_type: string; matches: number }
  proof: { id: string; file_url: string; admin_status: string } | null
}

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<WinnerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeProof, setActiveProof] = useState<string | null>(null)

  useEffect(() => {
    loadWinners()
  }, [])

  async function loadWinners() {
    const { data } = await supabase
      .from('winnings')
      .select(`
        id, amount, payment_status, created_at,
        user:users(full_name, email),
        draw_result:draw_results(match_type, matches),
        proof:proof_uploads(id, file_url, admin_status)
      `)
      .order('created_at', { ascending: false })
    setWinners((data || []).map((w: unknown) => {
      const winner = w as { id: string; amount: number; payment_status: string; created_at: string; user: { full_name: string | null; email: string }; draw_result: { match_type: string; matches: number }; proof: { id: string; file_url: string; admin_status: string }[] | null }
      return { ...winner, proof: winner.proof?.[0] || null }
    }))
    setLoading(false)
  }

  async function updateProofStatus(proofId: string, status: 'approved' | 'rejected') {
    await supabase.from('proof_uploads').update({ admin_status: status, reviewed_at: new Date().toISOString() }).eq('id', proofId)
    if (status === 'approved') {
      const proof = winners.find(w => w.proof?.id === proofId)
      if (proof) {
        await supabase.from('winnings').update({ payment_status: 'paid', paid_at: new Date().toISOString() }).eq('id', proof.id)
      }
    }
    loadWinners()
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Winner Verification</h1>
        <p className="text-cream-200/60 text-sm">Review proof uploads and approve or reject winner claims.</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200/10">
                {['Winner', 'Prize', 'Match', 'Amount', 'Proof', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-cream-200/50 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-cream-200/50">Loading...</td></tr>
              ) : winners.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-cream-200/50">No winners yet</td></tr>
              ) : winners.map(w => (
                <tr key={w.id} className="border-b border-cream-200/5 hover:bg-forest-800/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm text-cream-100">{w.user?.full_name || '—'}</p>
                    <p className="text-xs text-cream-200/50">{w.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-cream-200/50">{formatDate(w.created_at)}</td>
                  <td className="px-5 py-4">
                    <span className="badge badge-active text-xs">{w.draw_result?.match_type}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-lime-500">{formatCurrency(Number(w.amount))}</td>
                  <td className="px-5 py-4">
                    {w.proof ? (
                      <a href={w.proof.file_url} target="_blank" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                    ) : (
                      <span className="text-xs text-cream-200/30">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge text-xs ${
                      w.payment_status === 'paid' ? 'badge-active' :
                      w.proof?.admin_status === 'rejected' ? 'badge-inactive' :
                      w.proof?.admin_status === 'pending' ? 'badge-pending' : 'badge-inactive'
                    }`}>
                      {w.payment_status === 'paid' ? 'Paid' : w.proof?.admin_status || 'awaiting proof'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {w.proof && w.proof.admin_status === 'pending' && w.payment_status !== 'paid' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateProofStatus(w.proof!.id, 'approved')} className="p-1.5 rounded-lg bg-lime-500/10 text-lime-500 hover:bg-lime-500/20 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => updateProofStatus(w.proof!.id, 'rejected')} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
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
