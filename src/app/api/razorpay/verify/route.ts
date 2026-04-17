import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_subscription_id, 
      razorpay_signature,
      userId,
      plan
    } = await req.json()

    // 1. Verify the signature
    // Razorpay signature formula: HMAC-SHA256(subscription_id + "|" + payment_id, secret)
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_subscription_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 2. Signature is valid. Update the subscription in database.
    // Note: Webhook will also handle this, but verifying here provides immediate UI feedback.
    
    // Calculate period end (approximate, webhook will provide source of truth)
    const now = new Date()
    const periodEnd = new Date()
    if (plan === 'yearly') {
      periodEnd.setFullYear(now.getFullYear() + 1)
    } else {
      periodEnd.setMonth(now.getMonth() + 1)
    }

    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      razorpay_subscription_id: razorpay_subscription_id,
      plan: plan,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    }, { onConflict: 'razorpay_subscription_id' })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Signature verification error:', err)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
