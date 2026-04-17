'use client'

import Link from 'next/link'
import { ArrowRight, Trophy, Target, Heart } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="absolute inset-0 bg-gradient-radial from-lime-500/10 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(198,241,53,0.12) 0%, transparent 70%)' }} />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-lime-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-lime-500/5 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500/10 text-lime-500 text-sm font-semibold rounded-full border border-lime-500/20 mb-8 animate-fade-in">
          <Trophy className="w-3.5 h-3.5" />
          Golf · Prize Draws · Charity Impact
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-cream-100 leading-[1.05] mb-6 animate-slide-up">
          Play Golf.{' '}
          <span className="italic text-lime-500">Win Prizes.</span>
          <br />
          Change Lives.
        </h1>

        <p className="text-lg sm:text-xl text-cream-200/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
          Every month, track your Stableford scores, enter our prize draw, and contribute
          to the charity you love — all in one subscription.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-4 animate-glow">
            Start Playing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/how-it-works" className="btn-secondary text-base px-8 py-4">
            How It Works
          </Link>
        </div>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
          {[
            { icon: Target, label: 'Track Scores', desc: 'Stableford scoring system built-in', color: 'text-blue-400' },
            { icon: Trophy, label: 'Monthly Draw', desc: 'Win from a growing prize pool', color: 'text-lime-500' },
            { icon: Heart, label: 'Give Back', desc: 'Min 10% goes to your chosen charity', color: 'text-rose-400' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="glass p-5 text-left group hover:border-lime-500/20 transition-all duration-300">
              <Icon className={`w-6 h-6 ${color} mb-3`} />
              <p className="font-semibold text-cream-100 text-sm">{label}</p>
              <p className="text-xs text-cream-200/50 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
