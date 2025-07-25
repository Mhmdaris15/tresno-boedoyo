'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Google Maps component
const HeritageMapGoogle = dynamic(() => import('./HeritageMapGoogle'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heritage-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading heritage map...</p>
      </div>
    </div>
  )
})

interface HeritageSite {
  id: string
  name: string
  description: string
  type: string
  category?: string
  latitude: number
  longitude: number
  province: string
  city: string
  unescoStatus: boolean
  conservationStatus: string
  images: string[]
  opportunities?: number // Number of active opportunities
  significance?: string
  openingHours?: string
  entryFee?: string
}

interface HeritageMapProps {
  sites: HeritageSite[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  onSiteSelect?: (site: HeritageSite) => void
  forceFallback?: boolean // Force fallback UI for testing
}

export default function HeritageMap({ 
  sites, 
  center = { lat: -2.5489, lng: 118.0149 }, // Center of Indonesia
  zoom = 5,
  height = '500px',
  onSiteSelect,
  forceFallback = false
}: HeritageMapProps) {
  // Check if Google Maps API key is available
  const hasApiKey = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Use Google Maps if API key is available and not forcing fallback
  if (hasApiKey && !forceFallback) {
    return (
      <HeritageMapGoogle
        sites={sites}
        center={center}
        zoom={zoom}
        height={height}
        onSiteSelect={onSiteSelect}
      />
    )
  }

  // Fallback to grid-based UI
  return <FallbackHeritageMap 
    sites={sites}
    height={height}
    onSiteSelect={onSiteSelect}
  />
}

// Fallback component for when Google Maps is not available
function FallbackHeritageMap({ 
  sites, 
  height, 
  onSiteSelect 
}: {
  sites: HeritageSite[]
  height: string
  onSiteSelect?: (site: HeritageSite) => void
}) {
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null)

  const handleSiteClick = useCallback((site: HeritageSite) => {
    setSelectedSite(site)
    onSiteSelect?.(site)
  }, [onSiteSelect])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800'
      case 'GOOD':
        return 'bg-blue-100 text-blue-800'
      case 'FAIR':
        return 'bg-yellow-100 text-yellow-800'
      case 'POOR':
        return 'bg-orange-100 text-orange-800'
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMarkerColor = (site: HeritageSite) => {
    if (site.unescoStatus) return '#3B82F6' // Blue for UNESCO
    switch (site.conservationStatus) {
      case 'EXCELLENT': return '#10B981' // Green
      case 'GOOD': return '#3B82F6' // Blue
      case 'FAIR': return '#F59E0B' // Yellow
      case 'POOR': return '#F97316' // Orange
      case 'CRITICAL': return '#EF4444' // Red
      default: return '#6B7280' // Gray
    }
  }

  // For now, we'll show a placeholder map interface
  // This would be replaced with actual Google Maps integration
  return (
    <div className="relative">
      <div 
        style={{ height }}
        className="w-full rounded-lg border border-gray-300 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden"
      >
        {/* Map Header */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Heritage Sites Map</h3>
              <div className="text-sm text-gray-500">
                {sites.length} sites found
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Site Grid */}
        <div className="absolute inset-0 pt-20 pb-4 px-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <div
                key={site.id}
                onClick={() => handleSiteClick(site)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedSite?.id === site.id ? 'ring-2 ring-heritage-500 shadow-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {site.name}
                  </h4>
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0 ml-2"
                    style={{ backgroundColor: getMarkerColor(site) }}
                    title={site.unescoStatus ? 'UNESCO World Heritage Site' : site.conservationStatus}
                  />
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {site.city}, {site.province}
                  </div>
                  <div>Lat: {site.latitude.toFixed(4)}, Lng: {site.longitude.toFixed(4)}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {site.unescoStatus && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        UNESCO
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(site.conservationStatus)}`}>
                      {site.conservationStatus}
                    </span>
                  </div>
                  {site.opportunities && site.opportunities > 0 && (
                    <span className="text-xs text-heritage-600 font-medium">
                      {site.opportunities} opp.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className='text-gray-800'>UNESCO / Good</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className='text-gray-800'>Excellent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className='text-gray-800'>Fair</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className='text-gray-800'>Poor</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className='text-gray-800'>Critical</span>
            </div>
          </div>
        </div>

        {/* Google Maps Integration Notice */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm text-center">
          <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          <p className="text-sm text-blue-700 font-medium mb-1">Interactive Map View</p>
          <p className="text-xs text-blue-600">
            Google Maps integration available with API key setup
          </p>
        </div>
      </div>

      {/* Selected Site Details */}
      {selectedSite && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{selectedSite.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{selectedSite.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <p>{selectedSite.city}, {selectedSite.province}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <p>{selectedSite.category || selectedSite.type}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p>{selectedSite.conservationStatus}</p>
            </div>
            {selectedSite.opportunities && selectedSite.opportunities > 0 && (
              <div>
                <span className="font-medium text-gray-700">Opportunities:</span>
                <p className="text-heritage-600">{selectedSite.opportunities} active</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
