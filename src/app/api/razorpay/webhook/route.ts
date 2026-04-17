import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('x-razorpay-signature')!
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

  // 1. Verify webhook signature
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  if (expectedSig !== sig) {
    console.error('Razorpay webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  try {
    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.charged': {
        const sub = event.payload.subscription.entity
        const payment = event.payload.payment?.entity
        const userId = sub.notes?.user_id
        const plan = sub.notes?.plan

        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          razorpay_subscription_id: sub.id,
          plan: plan || (sub.plan_id === process.env.RAZORPAY_YEARLY_PLAN_ID ? 'yearly' : 'monthly'),
          status: 'active',
          current_period_start: new Date(sub.current_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_end * 1000).toISOString(),
        }, { onConflict: 'razorpay_subscription_id' })
        
        break
      }

      case 'subscription.cancelled':
      case 'subscription.completed': {
        const sub = event.payload.subscription.entity
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('razorpay_subscription_id', sub.id)
        break
      }

      case 'subscription.pending':
      case 'subscription.halted': {
        const sub = event.payload.subscription.entity
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('razorpay_subscription_id', sub.id)
        break
      }
    }
  } catch (err) {
    console.error('Razorpay webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
