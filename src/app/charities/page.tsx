import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Heart, ArrowRight, Search } from 'lucide-react'

export const metadata = {
  title: 'Charities — PlayForPurpose',
  description: 'Browse and support the charities partnered with PlayForPurpose.',
}

export const revalidate = 3600

async function getCharities() {
  const { data } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
  return data || []
}

export default async function CharitiesPage() {
  const charities = await getCharities()
  const featured = charities.filter((c: { is_featured: boolean }) => c.is_featured)
  const rest = charities.filter((c: { is_featured: boolean }) => !c.is_featured)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="section-tag mb-6 mx-auto w-fit">Our Charities</div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream-100 mb-4">
                Play for the causes{' '}
                <span className="italic text-lime-500">you love.</span>
              </h1>
              <p className="text-cream-200/60 max-w-xl mx-auto">
                Choose your charity at signup. At least 10% of every subscription goes directly to them.
              </p>
            </div>

            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="font-semibold text-cream-100 mb-6 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Featured Charities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((c: { id: string; name: string; category: string; description: string; is_featured: boolean; logo_url: string }) => (
                    <div key={c.id} className="card-hover group overflow-hidden">
                      <div className="h-40 -mx-6 -mt-6 mb-5 overflow-hidden bg-forest-700">
                        {c.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-12 h-12 text-cream-200/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-active text-xs">{c.category}</span>
                        <span className="text-xs text-amber-400 font-semibold">★ Featured</span>
                      </div>
                      <h3 className="font-bold text-cream-100 mb-2 leading-tight">{c.name}</h3>
                      <p className="text-xs text-cream-200/50 leading-relaxed line-clamp-3">{c.description}</p>
                      <div className="mt-4 pt-4 border-t border-cream-200/10">
                        <Link href="/auth/signup" className="flex items-center gap-1.5 text-xs text-lime-500 font-semibold hover:gap-2.5 transition-all">
                          Support this charity <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All charities */}
            {rest.length > 0 && (
              <div>
                <h2 className="font-semibold text-cream-100 mb-6">All Charities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((c: { id: string; name: string; category: string; description: string; logo_url: string }) => (
                    <div key={c.id} className="card-hover">
                      <span className="badge badge-active text-xs mb-3">{c.category}</span>
                      <h3 className="font-semibold text-cream-100 text-sm mb-2 leading-tight">{c.name}</h3>
                      <p className="text-xs text-cream-200/50 line-clamp-2 leading-relaxed">{c.description}</p>
                      <div className="mt-4 pt-4 border-t border-cream-200/10">
                        <Link href="/auth/signup" className="flex items-center gap-1.5 text-xs text-lime-500 font-semibold">
                          Choose this charity <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {charities.length === 0 && (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-cream-200/20 mx-auto mb-4" />
                <p className="text-cream-200/50">Charities coming soon. Check back shortly.</p>
              </div>
            )}

            <div className="mt-16 text-center">
              <p className="text-cream-200/60 mb-4 text-sm">Want your charity listed?</p>
              <Link href="mailto:charities@plaforpurpose.com" className="btn-secondary text-sm">
                Get in touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
