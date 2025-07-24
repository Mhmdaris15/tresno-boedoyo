'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Application {
  id: string
  volunteer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    skills: Array<{
      name: string
      level: string
      category: string
    }>
  }
  opportunity: {
    id: string
    title: string
    type: string
    location: string
    startDate: string
    endDate: string
  }
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  appliedAt: string
  message: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

export default function AdminApplications() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState('PENDING')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
    
    if (!loading && user?.role !== 'ADMIN' && user?.role !== 'COORDINATOR') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, user, router])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await apiClient.get('/admin/applications')
      // setApplications(response.data.data)
      
      // Mock data for now
      setApplications([
        {
          id: '1',
          volunteer: {
            id: 'v1',
            firstName: 'Ahmad',
            lastName: 'Rizki',
            email: 'ahmad.rizki@email.com',
            phone: '+62812345678',
            skills: [
              { name: 'Photography', level: 'ADVANCED', category: 'Documentation' },
              { name: 'Research', level: 'INTERMEDIATE', category: 'Research' }
            ]
          },
          opportunity: {
            id: '1',
            title: 'Borobudur Temple Documentation',
            type: 'DOCUMENTATION',
            location: 'Magelang, Central Java',
            startDate: '2025-08-01',
            endDate: '2025-08-15'
          },
          status: 'PENDING',
          appliedAt: '2025-07-22',
          message: 'I am very passionate about heritage preservation and have experience in digital photography. I would love to contribute to documenting this UNESCO World Heritage site.'
        },
        {
          id: '2',
          volunteer: {
            id: 'v2',
            firstName: 'Sari',
            lastName: 'Putri',
            email: 'sari.putri@email.com',
            phone: '+62812345679',
            skills: [
              { name: 'Stone Conservation', level: 'EXPERT', category: 'Restoration' },
              { name: 'Project Management', level: 'ADVANCED', category: 'Management' }
            ]
          },
          opportunity: {
            id: '2',
            title: 'Prambanan Stone Conservation',
            type: 'MAINTENANCE',
            location: 'Yogyakarta',
            startDate: '2025-08-10',
            endDate: '2025-08-25'
          },
          status: 'APPROVED',
          appliedAt: '2025-07-20',
          message: 'I have 5 years of experience in stone conservation and am certified in heritage preservation techniques.',
          reviewedAt: '2025-07-21',
          reviewedBy: 'Admin',
          reviewNotes: 'Excellent qualifications and experience. Approved for the project.'
        },
        {
          id: '3',
          volunteer: {
            id: 'v3',
            firstName: 'Budi',
            lastName: 'Santoso',
            email: 'budi.santoso@email.com',
            phone: '+62812345680',
            skills: [
              { name: 'Teaching', level: 'ADVANCED', category: 'Education' },
              { name: 'Cultural Studies', level: 'INTERMEDIATE', category: 'Research' }
            ]
          },
          opportunity: {
            id: '4',
            title: 'Heritage Education Program',
            type: 'EDUCATION',
            location: 'Jakarta',
            startDate: '2025-09-01',
            endDate: '2025-09-30'
          },
          status: 'PENDING',
          appliedAt: '2025-07-23',
          message: 'As a former teacher, I am excited to share knowledge about Indonesian heritage with young students.'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewApplication = async (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      // TODO: Replace with real API call
      // await apiClient.patch(`/admin/applications/${applicationId}`, {
      //   status,
      //   reviewNotes
      // })
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                status, 
                reviewedAt: new Date().toISOString(),
                reviewedBy: user?.email || 'Admin',
                reviewNotes 
              }
            : app
        )
      )
      
      toast.success(`Application ${status.toLowerCase()} successfully!`)
      setShowReviewModal(false)
      setSelectedApplication(null)
      setReviewNotes('')
    } catch (error) {
      console.error('Failed to review application:', error)
      toast.error('Failed to review application. Please try again.')
    }
  }

  const openReviewModal = (application: Application) => {
    setSelectedApplication(application)
    setReviewNotes(application.reviewNotes || '')
    setShowReviewModal(true)
  }

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'ALL' || app.status === filter
    const matchesSearch = 
      app.volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
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
                <h1 className="text-xl font-bold text-blue-600">Tresno Boedoyo</h1>
              </Link>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Application Management</h2>
            </div>
            <Link 
              href="/admin"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Applications</h2>
          <p className="text-gray-600">
            Review and manage volunteer applications for heritage preservation opportunities
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
                <option value="ALL">All Applications</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.volunteer.firstName} {application.volunteer.lastName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Applied for: <span className="font-medium">{application.opportunity.title}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                {application.status === 'PENDING' && (
                  <button
                    onClick={() => openReviewModal(application)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Review
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volunteer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Volunteer Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Email: {application.volunteer.email}</p>
                    <p>Phone: {application.volunteer.phone}</p>
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mt-3 mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {application.volunteer.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Opportunity Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Opportunity Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Type: {application.opportunity.type.replace('_', ' ')}</p>
                    <p>Location: {application.opportunity.location}</p>
                    <p>Duration: {new Date(application.opportunity.startDate).toLocaleDateString()} - {new Date(application.opportunity.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Application Message */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Application Message</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {application.message}
                </p>
              </div>

              {/* Review Notes (if reviewed) */}
              {application.reviewNotes && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Review Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {application.reviewNotes}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed by {application.reviewedBy} on {application.reviewedAt && new Date(application.reviewedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No applications match your current filters.
            </p>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Application
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Application from {selectedApplication.volunteer.firstName} {selectedApplication.volunteer.lastName} for {selectedApplication.opportunity.title}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes about your decision..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false)
                  setSelectedApplication(null)
                  setReviewNotes('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewApplication(selectedApplication.id, 'REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleReviewApplication(selectedApplication.id, 'APPROVED')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
