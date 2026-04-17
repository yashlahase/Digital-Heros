import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Heart, Globe, ArrowRight, ShieldCheck, Users, Target, CheckCircle2, ChevronLeft } from 'lucide-react'

// Dynamic route for charity profiles
export const revalidate = 3600 // Revalidate every hour

async function getCharity(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('charities')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function CharityProfilePage({ params }: { params: { id: string } }) {
  const charity = await getCharity(params.id)

  if (!charity) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Breadcrumb / Back */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link href="/charities" className="inline-flex items-center gap-2 text-sm text-cream-200/50 hover:text-lime-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to All Charities
          </Link>
        </div>

        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Info & Content */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="badge-active text-xs">Verified Partner</span>
                    <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">{charity.category}</span>
                  </div>
                  <h1 className="font-display text-4xl sm:text-6xl font-bold text-cream-100 mb-6 leading-tight">
                    {charity.name}
                  </h1>
                  <p className="text-xl text-cream-200/70 leading-relaxed max-w-3xl">
                    {charity.description}
                  </p>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Platform Ranking', value: '#12', icon: Target },
                    { label: 'Active Supporters', value: '1,240+', icon: Users },
                    { label: 'Impact Score', value: '9.8', icon: ShieldCheck },
                  ].map((stat) => (
                    <div key={stat.label} className="card bg-forest-800/40">
                      <stat.icon className="w-5 h-5 text-lime-500 mb-2" />
                      <p className="font-bold text-2xl text-cream-100">{stat.value}</p>
                      <p className="text-xs text-cream-200/50 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* About Section */}
                <div className="space-y-6">
                  <h2 className="font-display text-3xl font-bold text-cream-100">About the mission</h2>
                  <div className="prose prose-invert prose-cream max-w-none text-cream-200/60 leading-relaxed">
                    <p>
                      This charity is dedicated to making a profound impact on {charity.category.toLowerCase()} through 
                      sustainable initiatives and direct support programs. By choosing {charity.name} as your 
                      PlayForPurpose partner, you&apos;re ensuring that 10% of your subscription goes directly 
                      to funding their core objectives.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      {[
                        'Direct community support',
                        'Transparent fund allocation',
                        'Sustainability-focused',
                        'Global reach, local impact',
                        'Verified implementation partners',
                        'Monthly progress reporting'
                      ].map(point => (
                        <div key={point} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0" />
                          <span className="text-sm text-cream-100">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA & Links */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-6">
                  {/* Join Card */}
                  <div className="card border-lime-500/30 bg-gradient-to-b from-lime-500/5 to-transparent p-8">
                    <Heart className="w-10 h-10 text-rose-400 mb-6" />
                    <h3 className="text-xl font-bold text-cream-100 mb-4">Support {charity.name}</h3>
                    <p className="text-sm text-cream-200/60 leading-relaxed mb-8">
                      Join PlayForPurpose and select this charity. Your subscription will help fund their mission every single month.
                    </p>
                    <div className="space-y-3">
                      <Link href={`/auth/signup?charity=${charity.id}`} className="btn-primary w-full justify-center py-4">
                        Join & Support <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-[10px] text-center text-cream-200/30 uppercase tracking-tighter">
                        Min. 10% of every subscription goes to {charity.name}
                      </p>
                    </div>
                  </div>

                  {/* Links Card */}
                  <div className="card py-4">
                    {charity.website && (
                      <a 
                        href={charity.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-cream-200/40" />
                          <span className="text-sm font-medium text-cream-100">Official Website</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-cream-200/20 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" />
                      </a>
                    )}
                    <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-cream-200/40" />
                        <span className="text-sm font-medium text-cream-100">Add to Watchlist</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cream-200/20 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
