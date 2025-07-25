'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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
  requirements: string[]
  skills: string[]
  benefits: string[]
  createdAt: string
  coordinator: {
    firstName: string
    lastName: string
    email: string
  }
  participants: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    joinedAt: string
    status: string
  }>
}

export default function OpportunityDetail() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
    
    if (!loading && user?.role !== 'ADMIN' && user?.role !== 'COORDINATOR') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, user, router])

  useEffect(() => {
    if (params.id) {
      fetchOpportunity(params.id as string)
    }
  }, [params.id])

  const fetchOpportunity = async (id: string) => {
    try {
      // TODO: Replace with real API call
      // const response = await apiClient.get(`/admin/opportunities/${id}`)
      // setOpportunity(response.data.data)
      
      // Mock data for now
      setOpportunity({
        id: '1',
        title: 'Borobudur Temple Documentation',
        description: 'Help document and preserve the ancient reliefs of Borobudur Temple through digital photography and cataloging. This project aims to create a comprehensive digital archive of the temple\'s cultural and historical significance.',
        type: 'DOCUMENTATION',
        location: 'Magelang, Central Java',
        startDate: '2025-08-01',
        endDate: '2025-08-15',
        maxParticipants: 20,
        currentParticipants: 12,
        status: 'ACTIVE',
        requirements: [
          'Basic photography skills',
          'Physical fitness for outdoor work',
          'Minimum 3 days availability',
          'Own camera equipment preferred'
        ],
        skills: [
          'Digital Photography',
          'Cultural Documentation',
          'Heritage Preservation',
          'Research Skills'
        ],
        benefits: [
          'Heritage preservation certificate',
          'Professional networking opportunities',
          'Cultural learning experience',
          'Meals and accommodation provided',
          'Travel reimbursement'
        ],
        createdAt: '2025-07-20',
        coordinator: {
          firstName: 'Sari',
          lastName: 'Dewi',
          email: 'sari.dewi@heritage.id'
        },
        participants: [
          {
            id: 'p1',
            firstName: 'Ahmad',
            lastName: 'Rizki',
            email: 'ahmad.rizki@email.com',
            joinedAt: '2025-07-22',
            status: 'APPROVED'
          },
          {
            id: 'p2',
            firstName: 'Lisa',
            lastName: 'Putri',
            email: 'lisa.putri@email.com',
            joinedAt: '2025-07-23',
            status: 'APPROVED'
          }
        ]
      })
    } catch (error) {
      console.error('Error fetching opportunity:', error)
      router.push('/admin/opportunities')
    } finally {
      setIsLoading(false)
    }
  }

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
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'COORDINATOR')) {
    return null
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Opportunity not found</h2>
          <Link href="/admin/opportunities" className="text-heritage-600 hover:text-blue-800">
            Return to Opportunities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <h1 className="text-xl font-bold text-heritage-600">Tresno Boedoyo</h1>
              </Link>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Opportunity Details</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/admin/opportunities/${opportunity.id}/edit`}
                className="bg-heritage-600 text-white px-4 py-2 rounded-lg hover:bg-heritage-700"
              >
                Edit Opportunity
              </Link>
              <Link 
                href="/admin/opportunities"
                className="text-gray-600 hover:text-heritage-600 font-medium"
              >
                Back to Opportunities
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-heritage-600">{opportunity.currentParticipants}</p>
                  <p className="text-sm text-gray-600">Current Participants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{opportunity.maxParticipants}</p>
                  <p className="text-sm text-gray-600">Max Participants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.ceil((new Date(opportunity.endDate).getTime() - new Date(opportunity.startDate).getTime()) / (1000 * 3600 * 24))}
                  </p>
                  <p className="text-sm text-gray-600">Duration (days)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round((opportunity.currentParticipants / opportunity.maxParticipants) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Filled</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {opportunity.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-heritage-600 mr-2">•</span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-2">
                {opportunity.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-gray-900">{opportunity.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <p className="text-gray-900">{new Date(opportunity.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">End Date</p>
                  <p className="text-gray-900">{new Date(opportunity.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-gray-900">{new Date(opportunity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Coordinator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coordinator</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-heritage-600">
                    {opportunity.coordinator.firstName[0]}{opportunity.coordinator.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {opportunity.coordinator.firstName} {opportunity.coordinator.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{opportunity.coordinator.email}</p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants ({opportunity.participants.length})</h3>
              <div className="space-y-3">
                {opportunity.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </p>
                      <p className="text-xs text-gray-600">
                        Joined: {new Date(participant.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {participant.status}
                    </span>
                  </div>
                ))}
                {opportunity.participants.length === 0 && (
                  <p className="text-sm text-gray-500">No participants yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
