'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Award, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import type { Winning } from '@/types'

export default function WinningsPage() {
  const { user } = useAuth()
  const [winnings, setWinnings] = useState<(Winning & { draw_result?: { matches: number; match_type: string; draw?: { draw_month: string } } })[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [proofStatus, setProofStatus] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)
  const [activeWinning, setActiveWinning] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data } = await supabase
        .from('winnings')
        .select('*, draw_result:draw_results(matches, match_type, draw:draws(draw_month))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      setWinnings(data || [])

      // Load proof statuses
      const winningIds = (data || []).map((w: Winning) => w.id)
      if (winningIds.length > 0) {
        const { data: proofs } = await supabase
          .from('proof_uploads')
          .select('winning_id, admin_status')
          .in('winning_id', winningIds)
        const statusMap: Record<string, string> = {}
        ;(proofs || []).forEach((p: { winning_id: string; admin_status: string }) => { statusMap[p.winning_id] = p.admin_status })
        setProofStatus(statusMap)
      }
      setLoading(false)
    }
    load()
  }, [user])

  async function uploadProof(winningId: string, file: File) {
    setUploading(winningId)
    const ext = file.name.split('.').pop()
    const path = `proofs/${user!.id}/${winningId}.${ext}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proof-uploads')
      .upload(path, file, { upsert: true })

    if (uploadError) { setUploading(null); return }

    const { data: urlData } = supabase.storage.from('proof-uploads').getPublicUrl(uploadData.path)

    await supabase.from('proof_uploads').upsert({
      winning_id: winningId,
      user_id: user!.id,
      file_url: urlData.publicUrl,
      admin_status: 'pending',
    })

    setProofStatus(prev => ({ ...prev, [winningId]: 'pending' }))
    setUploading(null)
  }

  const totalEarned = winnings.reduce((sum, w) => sum + Number(w.amount), 0)
  const totalPaid = winnings.filter(w => w.payment_status === 'paid').reduce((sum, w) => sum + Number(w.amount), 0)

  if (loading) {
    return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cream-100 mb-1">Winnings</h1>
        <p className="text-cream-200/60 text-sm">Upload proof to claim your prizes. Admin reviews within 24 hours.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <Award className="w-5 h-5 text-lime-500 mb-3" />
          <p className="text-xs text-cream-200/50 mb-1">Total Earned</p>
          <p className="font-bold text-2xl text-cream-100">{formatCurrency(totalEarned)}</p>
        </div>
        <div className="card">
          <CheckCircle className="w-5 h-5 text-lime-500 mb-3" />
          <p className="text-xs text-cream-200/50 mb-1">Total Paid</p>
          <p className="font-bold text-2xl text-cream-100">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {winnings.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-12 h-12 text-cream-200/20 mx-auto mb-4" />
          <p className="text-cream-200/50">No winnings yet. Enter a draw to win!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winnings.map(w => {
            const status = proofStatus[w.id]
            const isPaid = w.payment_status === 'paid'
            const dr = w.draw_result as { matches: number; match_type: string; draw?: { draw_month: string } } | undefined

            return (
              <div key={w.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-cream-100">{dr?.match_type || 'Prize'}</h3>
                      {isPaid ? (
                        <span className="badge badge-active text-xs">Paid</span>
                      ) : (
                        <span className="badge badge-pending text-xs">Pending</span>
                      )}
                    </div>
                    <p className="text-xs text-cream-200/50">
                      {dr?.draw && formatDate(dr.draw.draw_month)} · {dr?.matches} matches
                    </p>
                  </div>
                  <p className="font-bold text-2xl text-lime-500">{formatCurrency(Number(w.amount))}</p>
                </div>

                {!isPaid && (
                  <div className="border-t border-cream-200/10 pt-4">
                    {!status ? (
                      <div>
                        <p className="text-xs text-cream-200/50 mb-3">Upload proof of your win to claim payment</p>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => { if (e.target.files?.[0]) uploadProof(w.id, e.target.files[0]) }}
                        />
                        <button
                          onClick={() => { setActiveWinning(w.id); fileRef.current?.click() }}
                          disabled={uploading === w.id}
                          className="btn-secondary text-sm py-2 px-4"
                        >
                          <Upload className="w-4 h-4" />
                          {uploading === w.id ? 'Uploading...' : 'Upload Proof'}
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${
                        status === 'approved' ? 'bg-lime-500/10 text-lime-500' :
                        status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                         status === 'rejected' ? <AlertCircle className="w-3.5 h-3.5" /> :
                         <Clock className="w-3.5 h-3.5" />}
                        Proof {status === 'pending' ? 'under review' : status}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
