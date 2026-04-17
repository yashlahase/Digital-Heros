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
  {
    q: "How do I enter the draws?",
    a: "Every week we take your best 5 scores from the last 30 days. If your points meet the threshold, you're automatically entered!"
  },
  {
    q: "How are winners notified?",
    a: "Winners are notified via email and SMS within 24 hours of the draw being conducted."
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel at any time from your dashboard. Your entries will remain valid until the end of your billing period."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-500 text-xs font-bold uppercase tracking-widest mb-4">
                Transparent Pricing
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-4">
                Choose your play style
              </h1>
              <p className="max-w-xl mx-auto text-cream-200/60 leading-relaxed">
                Unlock full access to score tracking, prize draws, and support your favorite charities with simple recurring billing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
              {plans.map(plan => (
                <div key={plan.name} className={`card relative ${plan.highlighted ? 'border-lime-500/40 bg-gradient-to-b from-lime-500/8 to-forest-800/60' : ''}`}>
                  {plan.savings && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-lime-500 text-forest-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Save {plan.savings}
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-cream-100">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 my-4">
                    <span className="font-display font-bold text-5xl text-cream-100">{plan.price}</span>
                    <span className="text-cream-200/50 text-sm">{plan.period}</span>
                  </div>
                  {plan.monthlyEquiv && <p className="text-xs text-lime-500 mb-4">{plan.monthlyEquiv}</p>}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm text-cream-200/70">
                        <Check className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    planId={plan.priceId}
                    cta={plan.cta}
                    className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                  />
                </div>
              ))}
            </div>
            <div className="text-center bg-forest-800/20 rounded-3xl p-10 border border-cream-200/5 mb-20">
              <Zap className="w-10 h-10 text-lime-500 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-cream-100 mb-4">Charity Impact</h2>
              <p className="text-cream-200/60 max-w-lg mx-auto leading-relaxed mb-6">
                For every subscription, a minimum of 10% goes directly to the charity of your choice.
                With our yearly plan, you save money and help more.
              </p>
              <div className="flex justify-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-lime-500">₹2M+</p>
                  <p className="text-[10px] text-cream-200/40 uppercase tracking-widest">Raised</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-lime-500">1.2k</p>
                  <p className="text-[10px] text-cream-200/40 uppercase tracking-widest">Charities</p>
                </div>
              </div>
            </div>

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
