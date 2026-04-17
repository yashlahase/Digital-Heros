import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function generateWinningNumbers(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers)
}

const PRIZE_SPLIT: Record<number, number> = { 5: 0.40, 4: 0.35, 3: 0.25 }

export async function POST(req: NextRequest) {
  try {
    const { mode = 'random' } = await req.json()

    const { count: activeSubCount } = await supabaseAdmin
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    const prizePool = (activeSubCount || 100) * 9.99 * 0.6

    const winningNumbers = generateWinningNumbers()

    const { data: subs } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')

    const userIds = (subs || []).map((s: { user_id: string }) => s.user_id)

    const { data: scores } = await supabaseAdmin
      .from('scores')
      .select('user_id, score')
      .in('user_id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000'])

    const userScores: Record<string, number[]> = {}
    for (const s of (scores || [])) {
      if (!userScores[s.user_id]) userScores[s.user_id] = []
      userScores[s.user_id].push(s.score)
    }

    const winningSet = new Set(winningNumbers)
    const matchResults: Record<number, string[]> = { 5: [], 4: [], 3: [] }

    for (const [userId, userScoreList] of Object.entries(userScores)) {
      const matches = userScoreList.filter(score => winningSet.has(score)).length
      if (matches >= 3 && matchResults[matches]) matchResults[matches].push(userId)
    }

    const results = []
    for (const [tier, winners] of Object.entries(matchResults)) {
      const matchCount = parseInt(tier)
      const count = winners.length
      const tierPool = prizePool * PRIZE_SPLIT[matchCount]
      const amount = count > 0 ? tierPool / count : 0
      results.push({ tier: `${matchCount}-match`, count, amount })
    }

    return NextResponse.json({
      winning_numbers: winningNumbers,
      prize_pool: prizePool,
      results,
    })
  } catch (err) {
    console.error('Simulate error:', err)
    return NextResponse.json({ error: 'Failed to simulate draw' }, { status: 500 })
  }
}
