'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      try {
        // Attempt to check if user is admin, but don't let it hang the whole login
        const { data: userData, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.session.user.id)
          .single()

        if (profileError || !userData) {
          console.warn('Profile not found yet, redirecting to dashboard anyway.')
          router.push('/dashboard')
          return
        }

        router.push(userData.role === 'admin' ? '/admin' : '/dashboard')
      } catch (err) {
        // Fallback redirect if anything goes wrong during role check
        router.push('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-forest-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-lime-500/5 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(198,241,53,0.08) 0%, transparent 70%)' }} />
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-forest-900" />
            </div>
            <span className="font-bold text-xl">Play<span className="text-lime-500">ForPurpose</span></span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-cream-100 mb-2">Welcome back</h1>
          <p className="text-cream-200/60 text-sm">Log in to continue playing with purpose</p>
        </div>

        <div className="card border-cream-200/10">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <input
                id="email"
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
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-200/40 hover:text-cream-200/70 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : (
                <>Log in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-cream-200/50 mt-6">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-lime-500 hover:text-lime-400 font-medium">Sign up</Link>
          </p>
        </div>

        {/* Demo creds */}
        <div className="mt-4 p-4 bg-forest-800/40 border border-cream-200/10 rounded-2xl text-xs text-cream-200/50">
          <p className="font-semibold mb-1 text-cream-200/70">Test credentials</p>
          <p>User: <span className="font-mono text-cream-200/80">user@plaforpurpose.com</span> / <span className="font-mono text-cream-200/80">Test1234!</span></p>
          <p>Admin: <span className="font-mono text-cream-200/80">admin@plaforpurpose.com</span> / <span className="font-mono text-cream-200/80">Admin1234!</span></p>
        </div>
      </div>
    </div>
  )
}
