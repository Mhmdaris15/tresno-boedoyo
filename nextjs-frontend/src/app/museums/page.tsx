'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Map as MapIcon,
  Headphones,
  Brain
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MuseumFeature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

interface FeaturedMuseum {
  id: string;
  name: string;
  location: string;
  description: string;
  artifacts: number;
  tours: number;
  openingHours: string;
  image: string;
  featured: boolean;
}

const museumFeatures: MuseumFeature[] = [
  {
    id: 'interactive-maps',
    icon: MapIcon,
    title: 'Interactive Floor Plans',
    description: 'Navigate museum layouts with precise artifact positioning and real-time location tracking.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'ai-tours',
    icon: Brain,
    title: 'AI-Powered Tours',
    description: 'Experience personalized tours optimized by artificial intelligence for the best learning experience.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'audio-guide',
    icon: Headphones,
    title: 'Audio Storytelling',
    description: 'Immersive audio narratives that bring artifacts and exhibitions to life.',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'real-time',
    icon: Sparkles,
    title: 'Real-time Guidance',
    description: 'Live tour management with progress tracking and dynamic route optimization.',
    color: 'bg-yellow-100 text-yellow-600'
  }
];

const featuredMuseums: FeaturedMuseum[] = [
  {
    id: 'demo-national-museum',
    name: 'National Museum of Indonesia',
    location: 'Jakarta, DKI Jakarta',
    description: 'Also known as Museum Gajah, featuring extensive collections of Indonesian cultural artifacts from prehistoric times to the present.',
    artifacts: 7,
    tours: 3,
    openingHours: 'Tue-Sun: 08:00-16:00',
    image: '/images/museums/national-museum.jpg',
    featured: true
  },
  {
    id: 'borobudur-museum',
    name: 'Borobudur Archaeological Museum',
    location: 'Magelang, Central Java',
    description: 'Dedicated to the archaeological finds from Borobudur and surrounding temples.',
    artifacts: 12,
    tours: 2,
    openingHours: 'Daily: 08:00-17:00',
    image: '/images/museums/borobudur-museum.jpg',
    featured: false
  },
  {
    id: 'textile-museum',
    name: 'Museum Tekstil Jakarta',
    location: 'Jakarta, DKI Jakarta',
    description: 'Showcasing Indonesia\'s rich textile heritage with traditional fabrics and weaving techniques.',
    artifacts: 15,
    tours: 4,
    openingHours: 'Tue-Sun: 09:00-15:00',
    image: '/images/museums/textile-museum.jpg',
    featured: false
  }
];

export default function MuseumsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-heritage-600">
                Tresno Boedoyo
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/heritage-sites" className="text-gray-700 hover:text-heritage-600">
                Heritage Sites
              </Link>
              <Link href="/museums" className="text-heritage-600 font-medium">
                Pandu Museum
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-heritage-600">
                Login
              </Link>
              <Link href="/register" className="bg-heritage-600 text-white px-4 py-2 rounded-lg hover:bg-heritage-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by AI
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Pandu Museum
            <span className="block text-blue-600">Interactive Guide System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience Indonesia's museums like never before with AI-powered tours, interactive floor plans, 
            and immersive storytelling that brings cultural artifacts to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/museum">
              <Button className="bg-blue-600 text-white px-8 py-3 text-lg hover:bg-blue-700">
                <Building className="w-5 h-5 mr-2" />
                Enter Museum Experience
              </Button>
            </Link>
            <Button variant="outline" className="border-blue-600 text-blue-600 px-8 py-3 text-lg hover:bg-blue-50">
              <MapIcon className="w-5 h-5 mr-2" />
              Browse Museums
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Revolutionary Museum Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how Pandu transforms traditional museum visits into interactive, 
              personalized journeys through Indonesia's cultural heritage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {museumFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Museums Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Museums
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore Indonesia's premier cultural institutions enhanced with Pandu's 
              intelligent guidance system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredMuseums.map((museum) => (
              <Card key={museum.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${museum.featured ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 relative">
                  {museum.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Live Demo
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">{museum.artifacts} Artifacts</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {museum.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{museum.location}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {museum.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {museum.tours} Tours
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {museum.openingHours.split(':')[0]}
                      </div>
                    </div>
                  </div>
                  <Link href={museum.featured ? "/museum" : "#"}>
                    <Button 
                      className={`w-full ${museum.featured ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      disabled={!museum.featured}
                    >
                      {museum.featured ? (
                        <>
                          Visit Museum
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        'Coming Soon'
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Pandu Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a seamless blend of technology and culture in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Choose Your Journey
              </h3>
              <p className="text-gray-600">
                Select from AI-optimized tours or create your own personalized path through the museum's collections.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interactive Navigation
              </h3>
              <p className="text-gray-600">
                Follow interactive floor plans with real-time guidance to discover artifacts and exhibitions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Immersive Learning
              </h3>
              <p className="text-gray-600">
                Experience rich storytelling with AI-generated narratives that bring historical artifacts to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Museum Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of visitors discovering Indonesia's cultural heritage through 
            Pandu's intelligent museum guide system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/museum">
              <Button className="bg-white text-blue-600 px-8 py-3 text-lg hover:bg-gray-100">
                <Building className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white px-8 py-3 text-lg hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
