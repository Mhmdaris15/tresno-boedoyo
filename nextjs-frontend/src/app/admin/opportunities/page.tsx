'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Opportunity {
  id: string
  title: string
  description: string
  type: 'FIELD_WORK' | 'RESEARCH' | 'DOCUMENTATION' | 'EDUCATION' | 'MAINTENANCE'
  location: string
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DRAFT'
  createdAt: string
  coordinator?: {
    firstName: string
    lastName: string
  }
}

export default function AdminOpportunities() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
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
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await apiClient.get('/admin/opportunities')
      // setOpportunities(response.data.data)
      
      // Mock data for now
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
          status: 'ACTIVE',
          createdAt: '2025-07-20',
          coordinator: { firstName: 'Sari', lastName: 'Dewi' }
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
          status: 'ACTIVE',
          createdAt: '2025-07-18',
          coordinator: { firstName: 'Budi', lastName: 'Santoso' }
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
          status: 'COMPLETED',
          createdAt: '2025-07-15',
          coordinator: { firstName: 'Ahmad', lastName: 'Rahman' }
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
          status: 'DRAFT',
          createdAt: '2025-07-22',
          coordinator: { firstName: 'Lisa', lastName: 'Putri' }
        }
      ])
    } catch (error) {
      console.error('Failed to fetch opportunities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return
    
    try {
      // TODO: Replace with real API call
      // await apiClient.delete(`/admin/opportunities/${id}`)
      setOpportunities(prev => prev.filter(opp => opp.id !== id))
    } catch (error) {
      console.error('Failed to delete opportunity:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // TODO: Replace with real API call
      // await apiClient.patch(`/admin/opportunities/${id}`, { status: newStatus })
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === id ? { ...opp, status: newStatus as any } : opp
        )
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = filter === 'ALL' || opp.status === filter
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.type.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h2 className="text-lg font-medium text-gray-900">Opportunity Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/opportunities/create"
                className="bg-heritage-600 text-white px-4 py-2 rounded-lg hover:bg-heritage-700 font-medium"
              >
                Create Opportunity
              </Link>
              <Link 
                href="/admin"
                className="text-gray-600 hover:text-heritage-600 font-medium"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Opportunities</h2>
          <p className="text-gray-600">
            Create, edit, and manage heritage preservation opportunities
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
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

        {/* Opportunities Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinator
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {opportunity.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {opportunity.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={opportunity.status}
                        onChange={(e) => handleStatusChange(opportunity.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(opportunity.status)}`}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opportunity.currentParticipants}/{opportunity.maxParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(opportunity.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(opportunity.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opportunity.coordinator?.firstName} {opportunity.coordinator?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/opportunities/${opportunity.id}`}
                          className="text-heritage-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/opportunities/${opportunity.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-3v3m0 0v3" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new opportunity.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/opportunities/create"
                className="bg-heritage-600 text-white px-4 py-2 rounded-lg hover:bg-heritage-700 font-medium"
              >
                Create New Opportunity
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
