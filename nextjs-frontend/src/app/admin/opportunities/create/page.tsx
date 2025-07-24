'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface OpportunityForm {
  title: string
  description: string
  type: string
  location: string
  startDate: string
  endDate: string
  maxParticipants: number
  requirements: string[]
  skills: string[]
  benefits: string[]
  status: string
}

export default function CreateOpportunity() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OpportunityForm>({
    title: '',
    description: '',
    type: 'DOCUMENTATION',
    location: '',
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    requirements: [''],
    skills: [''],
    benefits: [''],
    status: 'DRAFT'
  })

  const opportunityTypes = [
    { value: 'DOCUMENTATION', label: 'Documentation' },
    { value: 'RESEARCH', label: 'Research' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'FIELD_WORK', label: 'Field Work' }
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
    
    if (!loading && user?.role !== 'ADMIN' && user?.role !== 'COORDINATOR') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, user, router])

  const handleInputChange = (field: keyof OpportunityForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayFieldChange = (field: 'requirements' | 'skills' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayField = (field: 'requirements' | 'skills' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayField = (field: 'requirements' | 'skills' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent, saveAs: 'DRAFT' | 'ACTIVE') => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        status: saveAs,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        benefits: formData.benefits.filter(benefit => benefit.trim() !== '')
      }

      // TODO: Replace with real API call
      // await apiClient.post('/admin/opportunities', submitData)
      
      console.log('Creating opportunity:', submitData)
      
      toast.success(`Opportunity ${saveAs === 'DRAFT' ? 'saved as draft' : 'published'} successfully!`)
      router.push('/admin/opportunities')
    } catch (error) {
      console.error('Error creating opportunity:', error)
      toast.error('Failed to create opportunity. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
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
              <h2 className="text-lg font-medium text-gray-900">Create Opportunity</h2>
            </div>
            <Link 
              href="/admin/opportunities"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Back to Opportunities
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Opportunity</h2>
          <p className="text-gray-600">
            Fill in the details to create a new heritage preservation opportunity
          </p>
        </div>

        <form className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter opportunity title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {opportunityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the opportunity, goals, and what volunteers will do"
                  required
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter requirement"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('requirements', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Requirement
            </button>
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter required skill"
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('skills', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('skills')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Skill
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits for Volunteers</h3>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter benefit"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('benefits', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('benefits')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Benefit
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/opportunities"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'DRAFT')}
              disabled={isSubmitting}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'ACTIVE')}
              disabled={isSubmitting || !formData.title || !formData.description}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
