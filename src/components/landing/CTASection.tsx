import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative card border-lime-500/30 bg-gradient-to-br from-lime-500/10 via-forest-800/60 to-forest-800/40 py-16 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-lime-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-cream-100 mb-6">
              Ready to play with{' '}
              <span className="italic text-lime-500">purpose?</span>
            </h2>
            <p className="text-cream-200/70 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of golfers tracking their game, winning prizes, and making a difference every month.
            </p>
            <Link href="/auth/signup" className="btn-primary text-base px-10 py-4 animate-glow">
              Get Started Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-cream-200/40 mt-4">No credit card required for first 7 days</p>
          </div>
        </div>
      </div>
    </section>
  )
}
