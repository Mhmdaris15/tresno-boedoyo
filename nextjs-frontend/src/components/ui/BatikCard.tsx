'use client'

import { useState } from 'react'
import { PublicBatik } from '@/types/batik'

interface BatikCardProps {
  batik: PublicBatik
  onLike?: (batikId: string) => Promise<void>
  onDownload?: (batikId: string) => Promise<void>
  onAddToCollection?: (batikId: string) => void
  showInteractions?: boolean
  showUser?: boolean
}

export default function BatikCard({
  batik,
  onLike,
  onDownload,
  onAddToCollection,
  showInteractions = true,
  showUser = true
}: BatikCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleLike = async () => {
    if (!onLike || isLiking) return
    try {
      setIsLiking(true)
      await onLike(batik.id)
    } catch (error) {
      console.error('Failed to like batik:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDownload = async () => {
    if (!onDownload || isDownloading) return
    try {
      setIsDownloading(true)
      await onDownload(batik.id)
    } catch (error) {
      console.error('Failed to download batik:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getMotifDisplayName = (motif: string) => {
    const motifMap: Record<string, string> = {
      'parang': 'Parang',
      'kawung': 'Kawung',
      'mega_mendung': 'Mega Mendung',
      'sido_mukti': 'Sido Mukti',
      'truntum': 'Truntum',
      'sekar_jagad': 'Sekar Jagad',
      'ceplok': 'Ceplok',
      'nitik': 'Nitik'
    }
    return motifMap[motif] || motif.charAt(0).toUpperCase() + motif.slice(1)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        <img
          src={batik.imageUrl}
          alt={batik.title || `${getMotifDisplayName(batik.motif)} batik pattern`}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Overlay with motif and style info */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
            {getMotifDisplayName(batik.motif)}
          </span>
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
            {batik.style.charAt(0).toUpperCase() + batik.style.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {batik.title || `${getMotifDisplayName(batik.motif)} Pattern`}
          </h3>
          {batik.description && (
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">
              {batik.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {batik.tags && batik.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {batik.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {batik.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{batik.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Region info */}
        <div className="text-xs text-gray-500 mb-3">
          From {batik.region.charAt(0).toUpperCase() + batik.region.slice(1)}
        </div>

        {/* User info */}
        {showUser && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>By {batik.user.name}</span>
            <span>{formatDate(batik.createdAt)}</span>
          </div>
        )}

        {/* Interactions */}
        {showInteractions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* Stats */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {batik.likesCount}
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {batik.commentsCount}
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                {batik.downloadCount}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {onLike && (
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Like this pattern"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {onDownload && (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                  title="Download pattern"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              )}

              {onAddToCollection && (
                <button
                  onClick={() => onAddToCollection(batik.id)}
                  className="p-1.5 text-gray-400 hover:text-green-500 transition-colors"
                  title="Add to collection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
