import Link from 'next/link'
import { Trophy, Globe, Share2, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-cream-200/10 bg-forest-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-forest-900" />
              </div>
              <span className="font-bold text-lg">Play<span className="text-lime-500">ForPurpose</span></span>
            </Link>
            <p className="text-cream-200/60 text-sm leading-relaxed max-w-sm">
              Golf performance tracking meets monthly prize draws and genuine charity impact.
              Every subscription does more.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-cream-200/50 hover:text-lime-500 hover:bg-forest-700 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-cream-200/50 hover:text-lime-500 hover:bg-forest-700 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-cream-200/50 hover:text-lime-500 hover:bg-forest-700 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-cream-100 mb-4 text-sm">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Charities', href: '/charities' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Draw Results', href: '/draws' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-cream-200/60 hover:text-lime-500 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream-100 mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-cream-200/60 hover:text-lime-500 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-200/40">
            © {new Date().getFullYear()} PlayForPurpose. All rights reserved.
          </p>
          <p className="text-xs text-cream-200/40">
            Made with ❤️ for golfers who give back.
          </p>
        </div>
      </div>
    </footer>
  )
}
