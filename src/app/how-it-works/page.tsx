import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, ClipboardList, Shuffle, DollarSign, Heart, Zap, Star, Shield, Trophy } from 'lucide-react'

export const metadata = {
  title: 'How It Works — PlayForPurpose',
  description: 'Learn how PlayForPurpose combines Stableford golf tracking, monthly prize draws, and charity contributions.',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-cream-200/10">
          <div className="max-w-3xl mx-auto">
            <div className="section-tag mb-6 mx-auto w-fit">How It Works</div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream-100 mb-4">
              Golf.<span className="text-lime-500 italic"> Purpose.</span>
              <br />
              Prizes.
            </h1>
            <p className="text-cream-200/60 text-lg leading-relaxed">
              PlayForPurpose combines three powerful things into one monthly subscription.
              Here&apos;s exactly how it all works.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-16">

            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-5">
                  <ClipboardList className="w-6 h-6 text-blue-400" />
                </div>
                <div className="font-display font-bold text-6xl text-cream-200/5 mb-2">01</div>
                <h2 className="font-display text-3xl font-bold text-cream-100 mb-4">Track Your Stableford Scores</h2>
                <p className="text-cream-200/60 leading-relaxed mb-4">
                  After each round, log your Stableford score (1–45 points). PlayForPurpose stores your 5 most recent scores.
                  When you add a 6th, your oldest score is automatically replaced.
                </p>
                <ul className="space-y-2 text-sm text-cream-200/70">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-lime-500" />Score range: 1 to 45 points</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-lime-500" />Maximum 5 scores stored at once</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-lime-500" />One score per calendar date</li>
                </ul>
              </div>
              <div className="glass p-6 rounded-3xl">
                <p className="text-xs text-cream-200/50 mb-4 uppercase tracking-widest">Your Score Card</p>
                {[
                  { date: 'Apr 14', score: 31 },
                  { date: 'Apr 9', score: 28 },
                  { date: 'Apr 3', score: 24 },
                  { date: 'Mar 28', score: 33 },
                  { date: 'Mar 21', score: 27 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between mb-3">
                    <span className="text-sm text-cream-200/60">{s.date}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-forest-700 overflow-hidden w-24">
                        <div className="h-full bg-lime-500/60 rounded-full" style={{ width: `${(s.score / 45) * 100}%` }} />
                      </div>
                      <span className="font-bold text-lime-500 w-8 text-right">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="md:order-2">
                <div className="inline-flex p-3 bg-lime-500/10 border border-lime-500/20 rounded-2xl mb-5">
                  <Shuffle className="w-6 h-6 text-lime-500" />
                </div>
                <div className="font-display font-bold text-6xl text-cream-200/5 mb-2">02</div>
                <h2 className="font-display text-3xl font-bold text-cream-100 mb-4">Enter the Monthly Draw</h2>
                <p className="text-cream-200/60 leading-relaxed mb-4">
                  On the last day of each month, 5 winning Stableford scores are drawn. Your logged scores are your tickets.
                  Match 3, 4, or 5 of the drawn numbers to win a prize.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Zap, tier: '5-match', share: '40%', desc: 'Jackpot — rolls over if unclaimed', color: 'text-lime-500 bg-lime-500/10 border-lime-500/20' },
                    { icon: Star, tier: '4-match', share: '35%', desc: 'Split among all 4-match winners', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    { icon: Shield, tier: '3-match', share: '25%', desc: 'Split among all 3-match winners', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  ].map(({ icon: Icon, tier, share, desc, color }) => (
                    <div key={tier} className={`flex items-center gap-4 p-3 rounded-xl border ${color}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-sm">{tier}</span>
                        <span className="text-xs ml-2 opacity-70">{desc}</span>
                      </div>
                      <span className="font-bold">{share}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-6 rounded-3xl md:order-1">
                <p className="text-xs text-cream-200/50 mb-3 uppercase tracking-widest">Draw Results</p>
                <div className="flex gap-2 mb-5">
                  {[7, 24, 31, 12, 28].map(n => (
                    <div key={n} className="w-11 h-11 rounded-xl bg-lime-500 text-forest-900 font-bold text-sm flex items-center justify-center">{n}</div>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-lime-500/10 border border-lime-500/20 rounded-xl px-4 py-3 text-sm">
                  <Trophy className="w-4 h-4 text-lime-500" />
                  <span className="text-lime-500 font-semibold">3-match winner! You win £140 🎉</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-5">
                  <Heart className="w-6 h-6 text-rose-400" />
                </div>
                <div className="font-display font-bold text-6xl text-cream-200/5 mb-2">03</div>
                <h2 className="font-display text-3xl font-bold text-cream-100 mb-4">Give to Your Charity</h2>
                <p className="text-cream-200/60 leading-relaxed mb-4">
                  Every subscription funnels at least 10% directly to your chosen charity each month.
                  Want to give more? Adjust your contribution percentage anytime from your dashboard.
                </p>
                <ul className="space-y-2 text-sm text-cream-200/70">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />Minimum 10% of subscription</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />Change charity anytime</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />40+ partner charities across categories</li>
                </ul>
              </div>
              <div className="glass p-6 rounded-3xl">
                <p className="text-xs text-cream-200/50 mb-4 uppercase tracking-widest">Your Impact This Month</p>
                <div className="text-center py-4">
                  <p className="font-display font-bold text-4xl text-lime-500 mb-1">£1.00</p>
                  <p className="text-xs text-cream-200/50">donated from your £9.99 subscription</p>
                </div>
                <div className="h-2 rounded-full bg-forest-700 overflow-hidden mb-4">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: '10%' }} />
                </div>
                <p className="text-xs text-cream-200/50 text-center">10% contribution · St. Jude&apos;s Children&apos;s Hospital</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-cream-200/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold text-cream-100 mb-4">Ready to start?</h2>
            <p className="text-cream-200/60 mb-8">Subscribe today and play every round with purpose.</p>
            <Link href="/auth/signup" className="btn-primary text-base px-10 py-4">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
