import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import CharitiesPreview from '@/components/landing/CharitiesPreview'
import DrawExplainer from '@/components/landing/DrawExplainer'
import PricingPreview from '@/components/landing/PricingPreview'
import StatsSection from '@/components/landing/StatsSection'
import CTASection from '@/components/landing/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <DrawExplainer />
        <CharitiesPreview />
        <PricingPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
