'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LayoutDashboard, Users, CreditCard, Trophy, Heart, Award, BarChart2, LogOut, Trophy as Logo } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Analytics' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { href: '/admin/draws', icon: Trophy, label: 'Draws' },
  { href: '/admin/charities', icon: Heart, label: 'Charities' },
  { href: '/admin/winners', icon: Award, label: 'Winners' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-forest-900 border-r border-cream-200/10 z-40">
      <div className="p-6 border-b border-cream-200/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
            <Logo className="w-4 h-4 text-forest-900" />
          </div>
          <span className="font-bold text-sm">Play<span className="text-lime-500">ForPurpose</span></span>
        </Link>
        <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 font-semibold">
          Admin Panel
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
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

      <div className="p-4 border-t border-cream-200/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
            {getInitials(user?.full_name || 'A')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-cream-100 truncate">{user?.full_name || 'Admin'}</p>
            <p className="text-xs text-amber-400/70">Administrator</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm text-cream-200/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  )
}
