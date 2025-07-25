'use client'

import { useState, useEffect } from 'react'
import { BatikService } from '@/services/batikService'
import { BatikCollection } from '@/types/batik'
import CollectionModal from './CollectionModal'

interface CollectionsManagerProps {
  onCollectionSelect?: (collection: BatikCollection) => void
  selectedBatikId?: string
}

export default function CollectionsManager({ 
  onCollectionSelect, 
  selectedBatikId 
}: CollectionsManagerProps) {
  const [collections, setCollections] = useState<BatikCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const data = await BatikService.getUserCollections()
      setCollections(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (collectionData: {
    name: string
    description?: string
    isPublic?: boolean
  }) => {
    try {
      const newCollection = await BatikService.createCollection(collectionData)
      setCollections(prev => [newCollection, ...prev])
      setShowCreateModal(false)
      
      // If we have a selected batik, add it to the new collection
      if (selectedBatikId) {
        await handleAddToCollection(newCollection.id, selectedBatikId)
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create collection')
    }
  }

  const handleAddToCollection = async (collectionId: string, batikId: string) => {
    try {
      setActionLoading(collectionId)
      await BatikService.addBatikToCollection(collectionId, batikId)
      // Refresh collections to get updated item counts
      await fetchCollections()
    } catch (err: any) {
      console.error('Failed to add to collection:', err)
      alert('Failed to add pattern to collection')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-red-600 text-sm">
            <span className="font-medium">Error:</span> {error}
          </div>
          <button
            onClick={fetchCollections}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedBatikId ? 'Add to Collection' : 'My Collections'}
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-heritage-600 text-white text-sm rounded-md hover:bg-heritage-700 transition-colors"
        >
          + New Collection
        </button>
      </div>

      {/* Collections List */}
      {collections.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No collections yet</h3>
          <p className="text-gray-600 mb-4">Create your first collection to organize your batik patterns</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-heritage-600 text-white rounded-md hover:bg-heritage-700 transition-colors"
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onCollectionSelect?.(collection)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {collection.name}
                  </h4>
                  {collection.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
                
                {/* Privacy indicator */}
                <div className="ml-2 flex-shrink-0">
                  {collection.isPublic ? (
                    <div title="Public">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div title="Private">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {collection.itemsCount || 0} pattern{(collection.itemsCount || 0) !== 1 ? 's' : ''}
                </span>
                <span>{formatDate(collection.createdAt)}</span>
              </div>

              {/* Add to collection button for selected batik */}
              {selectedBatikId && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCollection(collection.id, selectedBatikId)
                    }}
                    disabled={actionLoading === collection.id}
                    className="w-full px-3 py-1.5 text-xs font-medium bg-blue-50 text-heritage-600 rounded border border-blue-200 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === collection.id ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
                        </svg>
                        Adding...
                      </div>
                    ) : (
                      'Add to Collection'
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <CollectionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCollection}
        />
      )}
    </div>
  )
}
