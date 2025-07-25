'use client'

import { useState } from 'react'
import { PublicGalleryFilters } from '@/types/batik'

interface GalleryFiltersProps {
  filters: PublicGalleryFilters
  onFilterChange: (filters: Partial<PublicGalleryFilters>) => void
}

const motifOptions = [
  { value: '', label: 'All Motifs' },
  { value: 'parang', label: 'Parang' },
  { value: 'kawung', label: 'Kawung' },
  { value: 'mega_mendung', label: 'Mega Mendung' },
  { value: 'sido_mukti', label: 'Sido Mukti' },
  { value: 'truntum', label: 'Truntum' },
  { value: 'sekar_jagad', label: 'Sekar Jagad' },
  { value: 'ceplok', label: 'Ceplok' },
  { value: 'nitik', label: 'Nitik' }
]

const styleOptions = [
  { value: '', label: 'All Styles' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'naturalistic', label: 'Naturalistic' },
  { value: 'abstract', label: 'Abstract' }
]

const regionOptions = [
  { value: '', label: 'All Regions' },
  { value: 'solo', label: 'Solo (Surakarta)' },
  { value: 'yogyakarta', label: 'Yogyakarta' },
  { value: 'cirebon', label: 'Cirebon' },
  { value: 'pekalongan', label: 'Pekalongan' },
  { value: 'indramayu', label: 'Indramayu' },
  { value: 'madura', label: 'Madura' },
  { value: 'bali', label: 'Bali' }
]

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'downloads', label: 'Most Downloaded' }
]

export default function GalleryFilters({ filters, onFilterChange }: GalleryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search || '')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ search: searchInput.trim() || undefined })
  }

  const handleFilterSelect = (key: keyof PublicGalleryFilters, value: string) => {
    onFilterChange({ [key]: value || undefined })
  }

  const clearFilters = () => {
    setSearchInput('')
    onFilterChange({
      search: undefined,
      motif: undefined,
      style: undefined,
      region: undefined,
      sortBy: 'recent'
    })
  }

  const hasActiveFilters = filters.search || filters.motif || filters.style || filters.region || filters.sortBy !== 'recent'

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search patterns by title, description, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                onFilterChange({ search: undefined })
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg
            className={`w-4 h-4 mr-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Advanced Filters
        </button>

        <div className="flex items-center space-x-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-heritage-600 hover:text-blue-800 underline"
            >
              Clear All
            </button>
          )}
          
          {/* Sort Dropdown */}
          <select
            value={filters.sortBy || 'recent'}
            onChange={(e) => handleFilterSelect('sortBy', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Motif Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif
            </label>
            <select
              value={filters.motif || ''}
              onChange={(e) => handleFilterSelect('motif', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {motifOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <select
              value={filters.style || ''}
              onChange={(e) => handleFilterSelect('style', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={filters.region || ''}
              onChange={(e) => handleFilterSelect('region', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={() => onFilterChange({ search: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-heritage-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filters.motif && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Motif: {motifOptions.find(o => o.value === filters.motif)?.label}
                <button
                  onClick={() => onFilterChange({ motif: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filters.style && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Style: {styleOptions.find(o => o.value === filters.style)?.label}
                <button
                  onClick={() => onFilterChange({ style: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filters.region && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Region: {regionOptions.find(o => o.value === filters.region)?.label}
                <button
                  onClick={() => onFilterChange({ region: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
