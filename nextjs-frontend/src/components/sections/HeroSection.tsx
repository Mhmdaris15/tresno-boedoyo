import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-heritage-50 pt-16 pb-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Preserve Indonesia's
            <span className="block text-primary-600">Cultural Heritage</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with heritage sites, contribute to preservation efforts, and be part of safeguarding Indonesia's rich cultural legacy for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Join as Volunteer
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button size="lg" variant="outline">
                Explore Opportunities
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/api/placeholder/1200/600"
              alt="Indonesian Heritage Sites"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
