'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Opportunity {
  id: string
  title: string
  description: string
  type: string
  location: string
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

export default function OpportunitiesPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // TODO: Fetch real opportunities from API
    // For now, using mock data
    setOpportunities([
      {
        id: '1',
        title: 'Borobudur Temple Documentation',
        description: 'Help document and preserve the ancient reliefs of Borobudur Temple through digital photography and cataloging.',
        type: 'DOCUMENTATION',
        location: 'Magelang, Central Java',
        startDate: '2025-08-01',
        endDate: '2025-08-15',
        maxParticipants: 20,
        currentParticipants: 12,
        status: 'ACTIVE'
      },
      {
        id: '2',
        title: 'Prambanan Stone Conservation',
        description: 'Assist in the conservation efforts for Prambanan Temple complex, including cleaning and restoration work.',
        type: 'MAINTENANCE',
        location: 'Yogyakarta',
        startDate: '2025-08-10',
        endDate: '2025-08-25',
        maxParticipants: 15,
        currentParticipants: 8,
        status: 'ACTIVE'
      },
      {
        id: '3',
        title: 'Traditional Batik Research',
        description: 'Research and document traditional batik techniques from Central Java for cultural preservation.',
        type: 'RESEARCH',
        location: 'Solo, Central Java',
        startDate: '2025-07-20',
        endDate: '2025-07-30',
        maxParticipants: 10,
        currentParticipants: 10,
        status: 'COMPLETED'
      },
      {
        id: '4',
        title: 'Heritage Education Program',
        description: 'Develop and deliver educational programs about Indonesian heritage to local schools.',
        type: 'EDUCATION',
        location: 'Jakarta',
        startDate: '2025-09-01',
        endDate: '2025-09-30',
        maxParticipants: 25,
        currentParticipants: 5,
        status: 'ACTIVE'
      }
    ])
  }, [])

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = filter === 'ALL' || opp.status === filter
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DOCUMENTATION': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-green-100 text-green-800'
      case 'RESEARCH': return 'bg-purple-100 text-purple-800'
      case 'EDUCATION': return 'bg-yellow-100 text-yellow-800'
      case 'FIELD_WORK': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-heritage-600">Tresno Boedoyo</h1>
              </Link>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Opportunities</h2>
            </div>
            <Link 
              href="/dashboard"
              className="text-gray-600 hover:text-heritage-600 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Heritage Opportunities</h2>
          <p className="text-gray-600">
            Discover and participate in heritage preservation projects across Indonesia
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {opportunity.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {opportunity.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opportunity.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 4h6m-2 4v3a2 2 0 11-4 0v-3" />
                    </svg>
                    {new Date(opportunity.startDate).toLocaleDateString()} - {new Date(opportunity.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                    {opportunity.currentParticipants}/{opportunity.maxParticipants} participants
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-heritage-600 text-white py-2 px-4 rounded-lg hover:bg-heritage-700 text-sm font-medium">
                    {opportunity.status === 'ACTIVE' ? 'Apply Now' : 'View Details'}
                  </button>
                  <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-3v3m0 0v3" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
