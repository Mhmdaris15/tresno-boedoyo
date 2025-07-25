'use client'

import { useState, useEffect } from 'react'
import { BatikService } from '@/services/batikService'
import { PublicBatik, PublicGalleryFilters } from '@/types/batik'
import BatikCard from './BatikCard'
import GalleryFilters from './GalleryFilters'

export default function PublicGallery() {
  const [batiks, setBatiks] = useState<PublicBatik[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  
  const [filters, setFilters] = useState<PublicGalleryFilters>({
    page: 1,
    limit: 12,
    sortBy: 'recent'
  })

  useEffect(() => {
    fetchGallery()
  }, [filters])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const response = await BatikService.getPublicGallery(filters)
      setBatiks(response.data)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<PublicGalleryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLike = async (batikId: string) => {
    try {
      await BatikService.toggleLike(batikId)
      // Refresh the gallery to get updated like counts
      fetchGallery()
    } catch (err: any) {
      console.error('Failed to toggle like:', err)
    }
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Failed to load gallery</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={fetchGallery}
            className="px-4 py-2 bg-heritage-600 text-white rounded-md hover:bg-heritage-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Public Gallery</h2>
          <p className="text-gray-600 mt-1">
            Discover beautiful batik patterns created by the community
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {total} pattern{total !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters */}
      <GalleryFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && batiks?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {batiks.map((batik) => (
            <BatikCard
              key={batik.id}
              batik={batik}
              onLike={handleLike}
              showInteractions={true}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && batiks?.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No patterns found</h3>
          <p className="text-gray-600">
            {filters.search || filters.motif || filters.style || filters.region
              ? 'Try adjusting your filters to see more results.'
              : 'Be the first to share a pattern with the community!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let page: number
            if (totalPages <= 7) {
              page = i + 1
            } else if (filters.page <= 4) {
              page = i + 1
            } else if (filters.page >= totalPages - 3) {
              page = totalPages - 6 + i
            } else {
              page = filters.page - 3 + i
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === filters.page
                    ? 'text-white bg-heritage-600 border border-blue-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          })}
          
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
