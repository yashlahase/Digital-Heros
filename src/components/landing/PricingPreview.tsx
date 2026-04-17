import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    features: [
      'Stableford score tracking',
      'Monthly prize draw entry',
      'Charity contribution (min 10%)',
      'Dashboard & analytics',
      'Winner verification',
    ],
    cta: 'Start Monthly',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: '$99.99',
    period: 'per year',
    savings: 'Save $19.89',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority draw entry',
      'Exclusive leaderboard',
      'Early feature access',
    ],
    cta: 'Start Yearly',
    highlighted: true,
  },
]

export default function PricingPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-800/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-tag mb-6 mx-auto w-fit">Pricing</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream-100 mb-4">
            Simple,{' '}
            <span className="italic text-lime-500">transparent</span>{' '}
            pricing.
          </h2>
          <p className="text-cream-200/60">One subscription. Scores, draws, and charity impact included.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`card relative ${plan.highlighted
                ? 'border-lime-500/40 bg-gradient-to-b from-lime-500/10 to-forest-800/60'
                : 'border-cream-200/10'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge bg-lime-500 text-forest-900 text-xs font-bold px-3 py-1">Most Popular</span>
                </div>
              )}
              {plan.savings && (
                <div className="badge badge-active text-xs mb-4">{plan.savings}</div>
              )}
              <h3 className="font-bold text-cream-100 text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display font-bold text-4xl text-cream-100">{plan.price}</span>
                <span className="text-cream-200/50 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-cream-200/80">
                    <Check className="w-4 h-4 text-lime-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={plan.highlighted ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
