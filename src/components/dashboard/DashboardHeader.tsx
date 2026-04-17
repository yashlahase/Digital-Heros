'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Bell } from 'lucide-react'

export default function DashboardHeader() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 py-4 border-b border-cream-200/10 bg-forest-950/90 backdrop-blur-xl">
      <div className="pl-10 lg:pl-0">
        <h2 className="text-sm font-semibold text-cream-100">
          {greeting}, {user?.full_name?.split(' ')[0] || 'Golfer'} 👋
        </h2>
        <p className="text-xs text-cream-200/40">
          {new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-forest-800 text-cream-200/60 hover:text-cream-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-lime-500" />
        </button>
      </div>
    </header>
  )
}
