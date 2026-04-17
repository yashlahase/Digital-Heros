import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Prize pool split: 5-match=40%, 4-match=35%, 3-match=25%
const PRIZE_SPLIT = { 5: 0.40, 4: 0.35, 3: 0.25 }

function generateWinningNumbers(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers)
}

function weightedSelect(users: { id: string; weight: number }[]): { id: string; weight: number } {
  const totalWeight = users.reduce((s, u) => s + u.weight, 0)
  let rand = Math.random() * totalWeight
  for (const user of users) {
    rand -= user.weight
    if (rand <= 0) return user
  }
  return users[users.length - 1]
}

export async function POST(req: NextRequest) {
  try {
    const { mode = 'random', publish = false } = await req.json()

    // Calculate prize pool: number of active subscriptions × $9.99 × (1 - charity%)
    const { count: activeSubCount } = await supabaseAdmin
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    const prizePool = (activeSubCount || 0) * 9.99 * 0.6 // 60% to prize pool, 10% min to charity

    // Get previous jackpot rollover
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('jackpot_rollover, winning_numbers')
      .eq('status', 'published')
      .order('draw_month', { ascending: false })
      .limit(1)
      .single()

    const jackpotRollover = lastDraw?.jackpot_rollover || 0
    const totalPool = prizePool + jackpotRollover

    // Generate winning numbers
    const winningNumbers = generateWinningNumbers()

    // Get all active subscribers with their scores
    const { data: subs } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')

    const userIds = (subs || []).map((s: { user_id: string }) => s.user_id)

    if (userIds.length === 0) {
      return NextResponse.json({ winning_numbers: winningNumbers, results: [], message: 'No active users' })
    }

    const { data: scores } = await supabaseAdmin
      .from('scores')
      .select('user_id, score')
      .in('user_id', userIds)

    // Group scores by user
    const userScores: Record<string, number[]> = {}
    for (const s of (scores || [])) {
      if (!userScores[s.user_id]) userScores[s.user_id] = []
      userScores[s.user_id].push(s.score)
    }

    // Match scores against winning numbers
    const winningSet = new Set(winningNumbers)
    const matchResults: Record<number, string[]> = { 5: [], 4: [], 3: [] }

    for (const [userId, userScoreList] of Object.entries(userScores)) {
      const matches = userScoreList.filter(score => winningSet.has(score)).length
      if (matches >= 3) {
        matchResults[matches as 3 | 4 | 5]?.push(userId)
      }
    }

    // Calculate prizes
    const results = []
    let newJackpotRollover = 0

    for (const [tier, winners] of Object.entries(matchResults)) {
      const matchCount = parseInt(tier)
      if (winners.length === 0) {
        if (matchCount === 5) newJackpotRollover = totalPool * PRIZE_SPLIT[5]
        continue
      }
      const tierPool = totalPool * PRIZE_SPLIT[matchCount as 3 | 4 | 5]
      const prizePerWinner = tierPool / winners.length
      results.push({ tier: `${matchCount}-match`, count: winners.length, amount: prizePerWinner, winners })
    }

    if (!publish) {
      return NextResponse.json({ winning_numbers: winningNumbers, results: results.map(r => ({ tier: r.tier, count: r.count, amount: r.amount })) })
    }

    // Publish: create draw record and results
    const drawMonth = new Date()
    drawMonth.setDate(1)

    const { data: draw } = await supabaseAdmin
      .from('draws')
      .insert({
        draw_month: drawMonth.toISOString().split('T')[0],
        mode,
        prize_pool: prizePool,
        jackpot_rollover: jackpotRollover,
        status: 'published',
        winning_numbers: winningNumbers,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!draw) throw new Error('Failed to create draw record')

    // Insert draw results and winnings
    for (const result of results) {
      for (const winnerId of result.winners) {
        const { data: drawResult } = await supabaseAdmin
          .from('draw_results')
          .insert({
            draw_id: draw.id,
            user_id: winnerId,
            matches: parseInt(result.tier),
            prize_amount: result.amount,
            match_type: result.tier,
          })
          .select()
          .single()

        if (drawResult) {
          await supabaseAdmin.from('winnings').insert({
            user_id: winnerId,
            draw_result_id: drawResult.id,
            amount: result.amount,
            payment_status: 'pending',
          })
        }
      }
    }

    // Update jackpot rollover if no 5-match winner
    if (newJackpotRollover > 0) {
      await supabaseAdmin
        .from('draws')
        .update({ jackpot_rollover: newJackpotRollover })
        .eq('id', draw.id)
    }

    return NextResponse.json({ success: true, draw_id: draw.id, winning_numbers: winningNumbers, results })
  } catch (err) {
    console.error('Draw run error:', err)
    return NextResponse.json({ error: 'Failed to run draw' }, { status: 500 })
  }
}
