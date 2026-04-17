import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Check, ArrowRight, Zap } from 'lucide-react'
import CheckoutButton from '@/components/CheckoutButton'
import { PRICE_DISPLAY } from '@/lib/razorpay'

export const metadata = {
  title: 'Pricing — PlayForPurpose',
  description: 'Simple subscription plans to play golf, win prizes, and give back.',
}

const plans = [
  {
    name: 'Monthly',
    price: PRICE_DISPLAY.monthly.amount,
    period: `per ${PRICE_DISPLAY.monthly.period}`,
    priceId: 'monthly' as const,
    features: [
      'Stableford score tracking (up to 5)',
      'Monthly prize draw entry',
      'Min 10% charity contribution',
      'Full dashboard & analytics',
      'Winner verification system',
      'Draw results notifications',
    ],
    cta: 'Start Monthly Plan',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: PRICE_DISPLAY.yearly.amount,
    period: `per ${PRICE_DISPLAY.yearly.period}`,
    priceId: 'yearly' as const,
    savings: PRICE_DISPLAY.yearly.savings,
    monthlyEquiv: 'Just ₹708/month equivalent',
    features: [
      'Everything in Monthly',
      '2 months completely free',
      'Priority draw entry',
      'Exclusive leaderboard access',
      'Early access to new features',
      'Dedicated support',
    ],
    cta: 'Start Yearly Plan',
    highlighted: true,
  },
]

const faqs = [
  ...
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              ...
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
              {plans.map(plan => (
                <div key={plan.name} className={`card relative ${plan.highlighted ? 'border-lime-500/40 bg-gradient-to-b from-lime-500/8 to-forest-800/60' : ''}`}>
                  ...
                  <div className="flex items-baseline gap-2 my-4">
                    <span className="font-display font-bold text-5xl text-cream-100">{plan.price}</span>
                    <span className="text-cream-200/50 text-sm">{plan.period}</span>
                  </div>
                  {plan.monthlyEquiv && <p className="text-xs text-lime-500 mb-4">{plan.monthlyEquiv}</p>}
                  <ul className="space-y-3 mb-8">
                    ...
                  </ul>
                  <CheckoutButton
                    planId={plan.priceId}
                    cta={plan.cta}
                    className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                  />
                </div>
              ))}
            </div>
            ...

            {/* FAQ */}
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-cream-100 text-center mb-10">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {faqs.map(({ q, a }) => (
                  <div key={q} className="card">
                    <h3 className="font-semibold text-cream-100 mb-2 text-sm">{q}</h3>
                    <p className="text-sm text-cream-200/60 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
