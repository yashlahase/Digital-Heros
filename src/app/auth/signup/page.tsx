'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'user' } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const passwordStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }
  const strength = passwordStrength()
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-lime-500']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-forest-950 py-16">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(198,241,53,0.08) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-forest-900" />
            </div>
            <span className="font-bold text-xl">Play<span className="text-lime-500">ForPurpose</span></span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-cream-100 mb-2">Create your account</h1>
          <p className="text-cream-200/60 text-sm">Start your journey — golf, prizes, and purpose await</p>
        </div>

        <div className="card border-cream-200/10">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="label">Full name</label>
              <input
                id="full-name"
                type="text"
                className="input"
                placeholder="Your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                id="signup-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-200/40 hover:text-cream-200/70 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : 'bg-forest-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-cream-200/50">{strengthLabels[strength - 1] || 'Too short'}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-lime-500/5 border border-lime-500/20 rounded-xl">
              <p className="text-xs text-lime-500/80 font-semibold mb-2">What you get</p>
              {['Score tracking & draws', 'Monthly prize entry', 'Min 10% to your charity'].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-cream-200/60 mt-1">
                  <Check className="w-3.5 h-3.5 text-lime-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <button
              id="signup-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-cream-200/50 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-lime-500 hover:text-lime-400 font-medium">Log in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-cream-200/30 mt-4">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline">Terms</Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
