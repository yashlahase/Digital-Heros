import { ClipboardList, Shuffle, DollarSign, Heart } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Enter Your Scores',
    description: 'Log up to 5 Stableford scores each month. New scores automatically replace your oldest one.',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    step: '02',
    icon: Shuffle,
    title: 'Monthly Draw',
    description: 'On the last day of each month, our draw runs. Match 3, 4, or 5 of the winning numbers to win.',
    color: 'bg-lime-500/10 text-lime-500 border-lime-500/20',
  },
  {
    step: '03',
    icon: DollarSign,
    title: 'Collect Winnings',
    description: 'Winners upload proof and receive their prize. Jackpot rolls over if no 5-match winner.',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    step: '04',
    icon: Heart,
    title: 'Give to Your Charity',
    description: 'A minimum 10% of your subscription goes to your chosen charity every single month.',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-tag mb-6 mx-auto w-fit">How It Works</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream-100 mb-4">
            Simple. Rewarding.{' '}
            <span className="italic text-lime-500">Meaningful.</span>
          </h2>
          <p className="text-cream-200/60 max-w-xl mx-auto">
            Four steps from signup to making an impact. No complexity, just golf and purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, icon: Icon, title, description, color }, i) => (
            <div key={step} className="card-hover relative group">
              <div className="absolute top-6 right-6 font-bold text-4xl text-cream-200/5 font-display">{step}</div>
              <div className={`inline-flex p-3 rounded-2xl border ${color} mb-5`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-cream-100 mb-3">{title}</h3>
              <p className="text-sm text-cream-200/60 leading-relaxed">{description}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-cream-200/10 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
