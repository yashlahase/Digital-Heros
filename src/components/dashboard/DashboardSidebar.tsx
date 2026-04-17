'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Target,
  Heart,
  Trophy,
  Award,
  LogOut,
  Trophy as Logo,
  X,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/scores', icon: Target, label: 'My Scores' },
  { href: '/dashboard/charity', icon: Heart, label: 'My Charity' },
  { href: '/dashboard/draws', icon: Trophy, label: 'Draw History' },
  { href: '/dashboard/winnings', icon: Award, label: 'Winnings' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-cream-200/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
            <Logo className="w-4 h-4 text-forest-900" />
          </div>
          <span className="font-bold text-sm">Play<span className="text-lime-500">ForPurpose</span></span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-lime-500/15 text-lime-500 border border-lime-500/25'
                  : 'text-cream-200/60 hover:text-cream-100 hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-cream-200/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-500 text-xs font-bold">
            {getInitials(user?.full_name || user?.email || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-cream-100 truncate">{user?.full_name || 'User'}</p>
            <p className="text-xs text-cream-200/40 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm text-cream-200/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-forest-900 border-r border-cream-200/10 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center bg-forest-800 border border-cream-200/10 rounded-xl text-cream-200/70"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 flex flex-col bg-forest-900 border-r border-cream-200/10 z-50">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
