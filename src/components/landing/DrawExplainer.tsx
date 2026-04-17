import { Zap, Shield, Trophy, Star } from 'lucide-react'

export default function DrawExplainer() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <div className="section-tag mb-6">The Draw System</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream-100 mb-6">
              A draw built on{' '}
              <span className="italic text-lime-500">your performance.</span>
            </h2>
            <p className="text-cream-200/70 leading-relaxed mb-8">
              Each month, five winning numbers are drawn. Your Stableford scores from that month
              are your tickets. Match 3, 4, or 5 numbers to win a share of the prize pool.
            </p>

            <div className="space-y-4">
              {[
                { icon: Zap, label: '5-match Jackpot', desc: '40% of prize pool — rolls over if unclaimed', color: 'text-lime-500', bg: 'bg-lime-500/10' },
                { icon: Star, label: '4-match Prize', desc: '35% split among 4-match winners', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { icon: Shield, label: '3-match Prize', desc: '25% split among 3-match winners', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              ].map(({ icon: Icon, label, desc, color, bg }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${bg} mt-0.5 shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-cream-100 text-sm">{label}</p>
                    <p className="text-sm text-cream-200/50 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual Draw Card */}
          <div className="relative">
            <div className="glass p-8 rounded-4xl border border-lime-500/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-cream-200/50 mb-1">April 2026 Draw</p>
                  <p className="font-bold text-cream-100">Prize Pool</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-3xl text-lime-500">£4,840</p>
                  <p className="text-xs text-cream-200/50">+£840 rollover</p>
                </div>
              </div>

              <p className="text-xs text-cream-200/50 mb-3 uppercase tracking-widest">Winning Numbers</p>
              <div className="flex gap-3 mb-8">
                {[12, 24, 7, 33, 19].map(n => (
                  <div key={n} className="w-12 h-12 rounded-2xl bg-lime-500 flex items-center justify-center font-bold text-forest-900 text-lg">
                    {n}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { tier: '5-match', prize: '£1,936', winners: '1 winner', bg: 'bg-lime-500/15', border: 'border-lime-500/30' },
                  { tier: '4-match', prize: '£560', winners: '3 winners', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                  { tier: '3-match', prize: '£280', winners: '7 winners', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                ].map(row => (
                  <div key={row.tier} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${row.bg} ${row.border}`}>
                    <div>
                      <span className="font-semibold text-cream-100 text-sm">{row.tier}</span>
                      <span className="text-xs text-cream-200/50 ml-2">{row.winners}</span>
                    </div>
                    <span className="font-bold text-cream-100">{row.prize}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-4xl bg-lime-500/5 blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
