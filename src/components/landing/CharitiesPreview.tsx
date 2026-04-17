import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const charities = [
  {
    name: "St. Jude Children's Research Hospital",
    category: 'Healthcare',
    raised: '£28,400',
    img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&q=80',
  },
  {
    name: 'World Wildlife Fund',
    category: 'Environment',
    raised: '£19,200',
    img: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80',
  },
  {
    name: 'Save the Children',
    category: 'Children',
    raised: '£22,800',
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80',
  },
]

export default function CharitiesPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-800/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-tag mb-4">Our Charities</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream-100">
              Your game, their{' '}
              <span className="italic text-lime-500">future.</span>
            </h2>
          </div>
          <Link href="/charities" className="btn-secondary text-sm shrink-0">
            View all charities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charities.map(c => (
            <div key={c.name} className="card-hover overflow-hidden group cursor-pointer">
              <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="badge badge-active text-xs mb-3">{c.category}</span>
              <h3 className="font-semibold text-cream-100 mb-2 leading-tight">{c.name}</h3>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200/10">
                <span className="text-xs text-cream-200/50">Total raised</span>
                <span className="text-sm font-bold text-lime-500">{c.raised}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
