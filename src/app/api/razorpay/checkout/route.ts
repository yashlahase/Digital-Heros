import { NextRequest, NextResponse } from 'next/server'
import { razorpay, RAZORPAY_PLANS } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email } = await req.json()

    if (!plan || !userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const planId = plan === 'yearly' ? RAZORPAY_PLANS.yearly : RAZORPAY_PLANS.monthly

    // 1. Get or create Razorpay customer if needed? 
    // Razorpay Subscriptions can take customer details directly or use customer_id.
    // For simplicity and matching Stripe flow, we'll try to find/save razorpay_customer_id.
    
    let customerId: string | null = null
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('razorpay_customer_id')
      .eq('id', userId)
      .single()

    if (userData?.razorpay_customer_id) {
      customerId = userData.razorpay_customer_id
    }

    // 2. Create the Razorpay Subscription
    // Note: total_count is required for subscriptions. We set it to a large number (e.g., 120 for 10 years of monthly).
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: plan === 'yearly' ? 10 : 120, 
      notes: {
        user_id: userId,
        plan: plan
      }
    })

    return NextResponse.json({ 
      subscription_id: subscription.id,
      key_id: process.env.RAZORPAY_KEY_ID 
    })
  } catch (err) {
    console.error('Razorpay subscription error:', err)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
