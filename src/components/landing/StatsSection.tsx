export default function StatsSection() {
  const stats = [
    { value: '£2.4M+', label: 'Prize Pool Distributed' },
    { value: '18,000+', label: 'Active Members' },
    { value: '40+', label: 'Partner Charities' },
    { value: '£890K+', label: 'Donated to Charity' },
  ]

  return (
    <section className="py-16 border-y border-cream-200/10 bg-forest-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-3xl sm:text-4xl text-lime-500 mb-1">{value}</div>
              <div className="text-sm text-cream-200/50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
