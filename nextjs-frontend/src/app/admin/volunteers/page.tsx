'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Volunteer {
  id: string
  email: string
  isActive: boolean
  createdAt: string
  volunteer: {
    firstName: string
    lastName: string
    phone: string
    dateOfBirth: string
    nationality: string
    bio: string
    skills: Array<{
      name: string
      level: string
      category: string
    }>
    participations: Array<{
      opportunityTitle: string
      status: string
      joinedAt: string
    }>
  }
}

export default function AdminVolunteers() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('ALL')
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
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await apiClient.get('/admin/volunteers')
      // setVolunteers(response.data.data)
      
      // Mock data for now
      setVolunteers([
        {
          id: 'v1',
          email: 'ahmad.rizki@email.com',
          isActive: true,
          createdAt: '2025-07-15',
          volunteer: {
            firstName: 'Ahmad',
            lastName: 'Rizki',
            phone: '+62812345678',
            dateOfBirth: '1995-03-15',
            nationality: 'Indonesian',
            bio: 'Passionate about heritage preservation and photography.',
            skills: [
              { name: 'Photography', level: 'ADVANCED', category: 'Documentation' },
              { name: 'Research', level: 'INTERMEDIATE', category: 'Research' }
            ],
            participations: [
              { opportunityTitle: 'Borobudur Documentation', status: 'ACTIVE', joinedAt: '2025-07-20' }
            ]
          }
        },
        {
          id: 'v2',
          email: 'sari.putri@email.com',
          isActive: true,
          createdAt: '2025-07-10',
          volunteer: {
            firstName: 'Sari',
            lastName: 'Putri',
            phone: '+62812345679',
            dateOfBirth: '1992-08-22',
            nationality: 'Indonesian',
            bio: 'Stone conservation expert with 5 years of experience.',
            skills: [
              { name: 'Stone Conservation', level: 'EXPERT', category: 'Restoration' },
              { name: 'Project Management', level: 'ADVANCED', category: 'Management' }
            ],
            participations: [
              { opportunityTitle: 'Prambanan Conservation', status: 'COMPLETED', joinedAt: '2025-06-15' },
              { opportunityTitle: 'Heritage Training', status: 'ACTIVE', joinedAt: '2025-07-18' }
            ]
          }
        },
        {
          id: 'v3',
          email: 'budi.santoso@email.com',
          isActive: false,
          createdAt: '2025-06-20',
          volunteer: {
            firstName: 'Budi',
            lastName: 'Santoso',
            phone: '+62812345680',
            dateOfBirth: '1988-12-10',
            nationality: 'Indonesian',
            bio: 'Former teacher interested in heritage education.',
            skills: [
              { name: 'Teaching', level: 'ADVANCED', category: 'Education' },
              { name: 'Cultural Studies', level: 'INTERMEDIATE', category: 'Research' }
            ],
            participations: []
          }
        }
      ])
    } catch (error) {
      console.error('Failed to fetch volunteers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (volunteerId: string, currentStatus: boolean) => {
    try {
      // TODO: Replace with real API call
      // await apiClient.patch(`/admin/volunteers/${volunteerId}`, { isActive: !currentStatus })
      
      setVolunteers(prev => 
        prev.map(vol => 
          vol.id === volunteerId ? { ...vol, isActive: !currentStatus } : vol
        )
      )
    } catch (error) {
      console.error('Failed to update volunteer status:', error)
    }
  }

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesFilter = filter === 'ALL' || 
                         (filter === 'ACTIVE' && volunteer.isActive) ||
                         (filter === 'INACTIVE' && !volunteer.isActive)
    
    const matchesSearch = 
      volunteer.volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

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
              <h2 className="text-lg font-medium text-gray-900">Volunteer Management</h2>
            </div>
            <Link 
              href="/admin"
              className="text-gray-600 hover:text-heritage-600 font-medium"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Management</h2>
          <p className="text-gray-600">
            Manage registered volunteers and their participation in heritage preservation activities
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
                <option value="ALL">All Volunteers</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Volunteers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVolunteers.map((volunteer) => (
            <div key={volunteer.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-heritage-600">
                      {volunteer.volunteer.firstName[0]}{volunteer.volunteer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {volunteer.volunteer.firstName} {volunteer.volunteer.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{volunteer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    volunteer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {volunteer.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(volunteer.id, volunteer.isActive)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      volunteer.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {volunteer.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Contact Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Phone: {volunteer.volunteer.phone}</p>
                    <p>Nationality: {volunteer.volunteer.nationality}</p>
                    <p>Joined: {new Date(volunteer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.volunteer.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                    {volunteer.volunteer.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{volunteer.volunteer.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Participations */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Participations ({volunteer.volunteer.participations.length})
                  </h4>
                  {volunteer.volunteer.participations.length > 0 ? (
                    <div className="space-y-2">
                      {volunteer.volunteer.participations.slice(0, 2).map((participation, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-900">{participation.opportunityTitle}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            participation.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            participation.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {participation.status}
                          </span>
                        </div>
                      ))}
                      {volunteer.volunteer.participations.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{volunteer.volunteer.participations.length - 2} more participations
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No participations yet</p>
                  )}
                </div>

                {/* Bio */}
                {volunteer.volunteer.bio && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {volunteer.volunteer.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                <button className="text-heritage-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Send Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVolunteers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No volunteers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No volunteers match your current filters.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
