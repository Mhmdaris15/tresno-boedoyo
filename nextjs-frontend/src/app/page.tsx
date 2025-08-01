'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import LogoImage from '@/assets/tresno-budoyo-logo.png'

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 4000) // Splash screen will show for 3 seconds

    return () => clearTimeout(timer)
  }, [])

   if (showSplash) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-heritage-50 z-50">
          <div className="text-center">
            <div className="animate-pulse">
              <Image
                src={LogoImage}
                alt="Tresno Boedoyo Logo"
                width={150}
                className="mx-auto mb-4"
              />
              <p className="text-md text-heritage-900 px-5">Preserving Indonesia's Cultural Heritage</p>
            </div>
            <div className="mt-8">
              <div className="h-2 w-32 bg-heritage-800 rounded-full mx-auto animate-bounce"></div>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-heritage-600">Tresno Boedoyo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/heritage-sites" className="text-gray-700 hover:text-heritage-600">
                Heritage Sites
              </Link>
              <Link href="/museums" className="text-gray-700 hover:text-heritage-600">
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Preserve Indonesia's
            <span className="block text-heritage-600">Cultural Heritage</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with heritage sites, contribute to preservation efforts, and be part of safeguarding Indonesia's rich cultural legacy for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/heritage-sites" className="bg-heritage-600 text-white px-8 py-3 rounded-lg hover:bg-heritage-700 font-medium">
              Explore Heritage Sites
            </Link>
            <Link href="/museums" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Visit Museums
            </Link>
            <Link href="/register" className="border border-heritage-600 text-heritage-600 px-8 py-3 rounded-lg hover:bg-heritage-50 font-medium">
              Join as Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Tresno Boedoyo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join a platform designed to make heritage preservation accessible, rewarding, and impactful for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-heritage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interactive Heritage Map
              </h3>
              <p className="text-gray-600">
                Explore Indonesia's heritage sites through interactive maps, from Borobudur to traditional villages across the archipelago.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pandu Museum Guide
              </h3>
              <p className="text-gray-600">
                Experience interactive museum tours with AI-powered storytelling, floor plan navigation, and personalized artifact discovery.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Community Collaboration
              </h3>
              <p className="text-gray-600">
                Connect with like-minded volunteers and coordinators passionate about heritage preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-heritage-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Preserve Indonesia's Heritage?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of heritage preservationists and make a lasting impact on Indonesia's cultural legacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-heritage-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium">
              Get Started Today
            </Link>
            <Link href="/about" className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-heritage-600 font-medium">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}