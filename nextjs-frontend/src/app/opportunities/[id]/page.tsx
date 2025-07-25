'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/services/apiClient'

interface OpportunityDetail {
  id: string
  title: string
  description: string
  type: string
  location: string
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  status: string
  coordinator: {
    name: string
    email: string
  }
  skills: Array<{
    name: string
    category: string
    required: boolean
    level: string
  }>
  requirements?: string
  benefits?: string
  impactStatement?: string
  duration: number
  applications?: Array<{
    id: string
    status: string
    volunteer: {
      name: string
      email: string
    }
    appliedAt: string
    message: string
  }>
  createdAt: string
  updatedAt: string
}

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiClient.getOpportunity(params.id)
        setOpportunity(response)
      } catch (error) {
        console.error('Error fetching opportunity:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch opportunity')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && params.id) {
      fetchOpportunity()
    }
  }, [isAuthenticated, params.id])

  const handleApply = async () => {
    if (!opportunity) return

    try {
      setApplying(true)
      await apiClient.applyToOpportunity(opportunity.id, {
        message: 'I am very interested in participating in this heritage preservation opportunity.'
      })
      
      // Refresh opportunity data
      const response = await apiClient.getOpportunity(params.id)
      setOpportunity(response)
      
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying:', error)
      alert(error instanceof Error ? error.message : 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-heritage-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Opportunity not found</h3>
            <p className="mt-1 text-sm text-gray-500">{error || 'The opportunity you\'re looking for doesn\'t exist.'}</p>
            <Link 
              href="/opportunities"
              className="mt-4 inline-block bg-heritage-600 text-white px-4 py-2 rounded-lg hover:bg-heritage-700"
            >
              Back to Opportunities
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canApply = opportunity.status === 'ACTIVE' && 
                   opportunity.currentParticipants < opportunity.maxParticipants

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
              <Link href="/opportunities" className="text-gray-600 hover:text-heritage-600">
                Opportunities
              </Link>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Opportunity Details</h2>
            </div>
            <Link 
              href="/opportunities"
              className="text-gray-600 hover:text-heritage-600 font-medium"
            >
              Back to Opportunities
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            {/* Title and Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(opportunity.status)}`}>
                    {opportunity.status}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {opportunity.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {canApply && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-heritage-600 text-white px-6 py-3 rounded-lg hover:bg-heritage-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Opportunity</h2>
              <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 4h6m-2 4v3a2 2 0 11-4 0v-3" />
                      </svg>
                      {new Date(opportunity.startDate).toLocaleDateString()} - {new Date(opportunity.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {opportunity.duration} hours
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                      </svg>
                      {opportunity.currentParticipants}/{opportunity.maxParticipants} participants
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coordinator</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{opportunity.coordinator.name}</p>
                  <p>{opportunity.coordinator.email}</p>
                </div>
              </div>
            </div>

            {/* Skills Required */}
            {opportunity.skills && opportunity.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {opportunity.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className="block text-sm text-gray-500">{skill.category}</span>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${skill.required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {skill.required ? 'Required' : 'Optional'}
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">{skill.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="space-y-6">
              {opportunity.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <p className="text-gray-700">{opportunity.requirements}</p>
                </div>
              )}

              {opportunity.benefits && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                  <p className="text-gray-700">{opportunity.benefits}</p>
                </div>
              )}

              {opportunity.impactStatement && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Statement</h3>
                  <p className="text-gray-700">{opportunity.impactStatement}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                {canApply ? (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="bg-heritage-600 text-white px-6 py-3 rounded-lg hover:bg-heritage-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Applying...' : 'Apply to This Opportunity'}
                  </button>
                ) : (
                  <div className="text-gray-500">
                    {opportunity.status === 'COMPLETED' ? 'This opportunity has been completed' :
                     opportunity.status === 'CANCELLED' ? 'This opportunity has been cancelled' :
                     opportunity.currentParticipants >= opportunity.maxParticipants ? 'This opportunity is full' :
                     'This opportunity is not accepting applications'}
                  </div>
                )}
                <Link 
                  href="/opportunities"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back to Opportunities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
