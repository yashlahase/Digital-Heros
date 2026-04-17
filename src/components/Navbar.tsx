'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Menu, X, Trophy, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cream-200/10 bg-forest-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center group-hover:bg-lime-400 transition-colors">
              <Trophy className="w-4 h-4 text-forest-900" />
            </div>
            <span className="font-bold text-lg text-cream-100">
              Play<span className="text-lime-500">ForPurpose</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/charities" className="btn-ghost text-sm">Charities</Link>
            <Link href="/how-it-works" className="btn-ghost text-sm">How It Works</Link>
            <Link href="/pricing" className="btn-ghost text-sm">Pricing</Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn-ghost text-sm"
                >
                  Dashboard
                </Link>
                <button onClick={signOut} className="btn-secondary text-sm py-2 px-4">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm">Log in</Link>
                <Link href="/auth/signup" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden p-2 text-cream-200/70 hover:text-cream-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-cream-200/10 bg-forest-900/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-2">
          <Link href="/charities" className="btn-ghost text-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Charities</Link>
          <Link href="/how-it-works" className="btn-ghost text-sm w-full justify-start" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/pricing" className="btn-ghost text-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <div className="divider my-2" />
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="btn-secondary text-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link href="/auth/signup" className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
