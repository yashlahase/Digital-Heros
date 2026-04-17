'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowRight } from 'lucide-react'

interface CheckoutButtonProps {
  planId: 'monthly' | 'yearly'
  cta: string
  className?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutButton({ planId, cta, className }: CheckoutButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      router.push(`/auth/signup?plan=${planId}`)
      return
    }

    setLoading(true)
    try {
      // 1. Create subscription on server
      const res = await fetch('/api/razorpay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          userId: user.id,
          email: user.email,
        }),
      })

      const { subscription_id, key_id, error } = await res.json()

      if (error) throw new Error(error)

      // 2. Open Razorpay Modal
      const options = {
        key: key_id,
        subscription_id: subscription_id,
        name: 'PlayForPurpose',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Subscription`,
        image: '/logo.png', // Replace with actual logo path
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              plan: planId,
            }),
          })

          if (verifyRes.ok) {
            router.push('/dashboard?success=true')
          } else {
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user.email.split('@')[0], // Fallback name
          email: user.email,
        },
        theme: {
          color: '#C6F135', // Lime-500
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} w-full justify-center disabled:opacity-70`}
    >
      {loading ? 'Processing...' : (
        <>{cta} <ArrowRight className="w-4 h-4 ml-2 inline-block" /></>
      )}
    </button>
  )
}
