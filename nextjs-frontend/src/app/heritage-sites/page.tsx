'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import HeritageMap to avoid SSR issues
const HeritageMap = dynamic(() => import('@/components/heritage/HeritageMap'), {
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
  category: string
  latitude: number
  longitude: number
  province: string
  city: string
  unescoStatus: boolean
  conservationStatus: string
  images: string[]
  opportunities?: number
  significance?: string
  openingHours?: string
  entryFee?: string
  lastAssessment?: string
}

export default function HeritageSitesPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [sites, setSites] = useState<HeritageSite[]>([])
  const [filteredSites, setFilteredSites] = useState<HeritageSite[]>([])
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [provinceFilter, setProvinceFilter] = useState('ALL')
  const [conservationFilter, setConservationFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUNESCOOnly, setShowUNESCOOnly] = useState(false)

  // Remove authentication requirement - heritage sites should be publicly accessible
  // useEffect(() => {
  //   if (!loading && !isAuthenticated) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchHeritageSites = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to fetch from backend API first
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/heritage-sites`)
          
          if (response.ok) {
            const data = await response.json()
            console.log('✅ Fetched heritage sites from API:', data.data?.length || 0)
            
            // Convert API data to match our interface
            const apiSites: HeritageSite[] = data.data.map((site: any) => ({
              id: site.id,
              name: site.name,
              description: site.description,
              type: site.type,
              category: site.category || site.type,
              latitude: site.latitude,
              longitude: site.longitude,
              province: site.province,
              city: site.city,
              unescoStatus: site.unescoStatus,
              conservationStatus: site.conservationStatus,
              images: site.images,
              opportunities: site.opportunityCount || 0,
              significance: site.significance || '',
              openingHours: site.openingHours || '',
              entryFee: site.entryFee || '',
              lastAssessment: site.lastAssessment || ''
            }))
            
            setSites(apiSites)
            setFilteredSites(apiSites)
            return
          }
        } catch (apiError) {
          console.warn('🚧 API not available, using mock data:', apiError)
        }

        // Fallback to mock data if API is not available
        const mockSites: HeritageSite[] = [
          {
            id: '1',
            name: 'Borobudur Temple',
            description: 'A 9th-century Mahayana Buddhist temple and UNESCO World Heritage Site, featuring intricate stone reliefs and stupas.',
            type: 'TEMPLE',
            category: 'Buddhist Temple',
            latitude: -7.6079,
            longitude: 110.2038,
            province: 'Central Java',
            city: 'Magelang',
            unescoStatus: true,
            conservationStatus: 'GOOD',
            images: ['/images/heritage/borobudur.jpg'],
            opportunities: 3,
            significance: 'One of the greatest Buddhist monuments in the world',
            openingHours: '06:00 - 17:00',
            entryFee: 'IDR 50,000',
            lastAssessment: '2024-12-15'
          },
          {
            id: '2',
            name: 'Prambanan Temple Complex',
            description: 'A collection of Hindu temples built in the 9th century, dedicated to the Trimurti: Brahma, Vishnu, and Shiva.',
            type: 'TEMPLE',
            category: 'Hindu Temple',
            latitude: -7.7520,
            longitude: 110.4915,
            province: 'Central Java',
            city: 'Yogyakarta',
            unescoStatus: true,
            conservationStatus: 'FAIR',
            images: ['/images/heritage/prambanan.jpg'],
            opportunities: 2,
            significance: 'Largest Hindu temple site in Indonesia',
            openingHours: '06:00 - 18:00',
            entryFee: 'IDR 40,000',
            lastAssessment: '2024-11-20'
          },
          {
            id: '3',
            name: 'Yogyakarta Sultan Palace',
            description: 'The primary royal palace of the Sultanate of Yogyakarta, still functioning as a royal residence.',
            type: 'PALACE',
            category: 'Royal Palace',
            latitude: -7.8053,
            longitude: 110.3644,
            province: 'Special Region of Yogyakarta',
            city: 'Yogyakarta',
            unescoStatus: false,
            conservationStatus: 'EXCELLENT',
            images: ['/images/heritage/kraton.jpg'],
            opportunities: 1,
            significance: 'Center of Javanese culture and tradition',
            openingHours: '09:00 - 14:00',
            entryFee: 'IDR 15,000',
            lastAssessment: '2024-10-05'
          },
          {
            id: '4',
            name: 'Tana Toraja Cultural Landscape',
            description: 'Traditional villages known for elaborate funeral rites and cliff-carved graves.',
            type: 'CULTURAL_LANDSCAPE',
            category: 'Traditional Village',
            latitude: -2.9889,
            longitude: 119.8853,
            province: 'South Sulawesi',
            city: 'Tana Toraja',
            unescoStatus: false,
            conservationStatus: 'GOOD',
            images: ['/images/heritage/toraja.jpg'],
            opportunities: 4,
            significance: 'Unique death rituals and traditional architecture',
            openingHours: 'Always accessible',
            entryFee: 'Free',
            lastAssessment: '2024-09-12'
          },
          {
            id: '5',
            name: 'Bagan Siapiapi Archaeological Site',
            description: 'Ancient Buddhist temple ruins from the Srivijaya period.',
            type: 'ARCHAEOLOGICAL_SITE',
            category: 'Archaeological Site',
            latitude: 2.0833,
            longitude: 101.3500,
            province: 'Riau',
            city: 'Rokan Hilir',
            unescoStatus: false,
            conservationStatus: 'POOR',
            images: ['/images/heritage/bagan.jpg'],
            opportunities: 5,
            significance: 'Evidence of Srivijaya maritime empire',
            openingHours: '08:00 - 16:00',
            entryFee: 'IDR 10,000',
            lastAssessment: '2024-08-18'
          }
        ]
        
        setSites(mockSites)
        setFilteredSites(mockSites)
        
      } catch (error) {
        console.error('Error fetching heritage sites:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch heritage sites')
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch heritage sites data regardless of authentication status
    fetchHeritageSites()
  }, []) // Remove isAuthenticated dependency

  // Apply filters
  useEffect(() => {
    let filtered = sites

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(site => site.type === typeFilter)
    }

    // Province filter
    if (provinceFilter !== 'ALL') {
      filtered = filtered.filter(site => site.province === provinceFilter)
    }

    // Conservation status filter
    if (conservationFilter !== 'ALL') {
      filtered = filtered.filter(site => site.conservationStatus === conservationFilter)
    }

    // UNESCO filter
    if (showUNESCOOnly) {
      filtered = filtered.filter(site => site.unescoStatus)
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(site => 
        site.name.toLowerCase().includes(search) ||
        site.description.toLowerCase().includes(search) ||
        site.city.toLowerCase().includes(search) ||
        site.province.toLowerCase().includes(search)
      )
    }

    setFilteredSites(filtered)
  }, [sites, typeFilter, provinceFilter, conservationFilter, showUNESCOOnly, searchTerm])

  const getUniqueProvinces = () => {
    return Array.from(new Set(sites.map(site => site.province))).sort()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'text-green-600 bg-green-100'
      case 'GOOD': return 'text-blue-600 bg-blue-100'
      case 'FAIR': return 'text-yellow-600 bg-yellow-100'
      case 'POOR': return 'text-orange-600 bg-orange-100'
      case 'CRITICAL': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-heritage-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading heritage sites...</p>
        </div>
      </div>
    )
  }

  // Remove authentication requirement - heritage sites are public
  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-heritage-600">Tresno Boedoyo</h1>
              </Link>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Heritage Sites Discovery</h2>
            </div>
            <Link 
              href="/dashboard"
              className="text-gray-600 hover:text-heritage-600 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Indonesian Heritage Sites</h2>
          <p className="text-gray-600">
            Explore Indonesia's rich cultural heritage through interactive maps and detailed site information
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-heritage-500 focus:border-heritage-500 text-gray-700"
              >
                <option value="ALL">All Types</option>
                <option value="TEMPLE">Temples</option>
                <option value="PALACE">Palaces</option>
                <option value="TRADITIONAL_VILLAGE">Villages</option>
                <option value="ARCHAEOLOGICAL_SITE">Archaeological</option>
                <option value="CULTURAL_LANDSCAPE">Landscapes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-heritage-500 focus:border-heritage-500 text-gray-700"
              >
                <option value="ALL">All Provinces</option>
                {getUniqueProvinces().map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conservation</label>
              <select
                value={conservationFilter}
                onChange={(e) => setConservationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-heritage-500 focus:border-heritage-500 text-gray-700"
              >
                <option value="ALL">All Status</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"

                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-heritage-500 focus:border-heritage-500 text-gray-700"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showUNESCOOnly}
                  onChange={(e) => setShowUNESCOOnly(e.target.checked)}
                  className="rounded border-gray-300 text-heritage-600 focus:ring-heritage-500"
                />
                <span className="ml-2 text-sm text-gray-700">UNESCO only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Heritage Sites Map</h3>
            <span className="text-sm text-gray-500">
              Showing {filteredSites.length} of {sites.length} sites
            </span>
          </div>
          
          <HeritageMap
            sites={filteredSites}
            height="500px"
            onSiteSelect={(site) => setSelectedSite(site)}
          />
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <div key={site.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                {site.images.length > 0 ? (
                  <img 
                    src={site.images[0]} 
                    alt={site.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                  {site.unescoStatus && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                      UNESCO
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(site.conservationStatus)}`}>
                    {site.conservationStatus}
                  </span>
                </div>

                {site.opportunities && site.opportunities > 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-heritage-600 text-white text-xs rounded-full font-medium">
                      {site.opportunities} opportunities
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {site.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {site.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {site.city}, {site.province}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {site.category}
                  </div>
                  {site.openingHours && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {site.openingHours}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Link 
                    href={`/heritage-sites/${site.id}`}
                    className="flex-1 bg-heritage-600 text-white py-2 px-4 rounded-lg hover:bg-heritage-700 text-sm font-medium text-center"
                  >
                    Learn More
                  </Link>
                  {site.opportunities && site.opportunities > 0 && (
                    <Link 
                      href={`/opportunities?site=${site.id}`}
                      className="border border-heritage-600 text-heritage-600 py-2 px-4 rounded-lg hover:bg-heritage-50 text-sm font-medium"
                    >
                      View Opportunities
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No heritage sites found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
