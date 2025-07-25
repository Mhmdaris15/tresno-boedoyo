'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BatikService } from '@/services/batikService'
import { GeneratedBatik, GenerationLimit } from '@/types/batik'
import GenerationLimitDisplay from '@/components/ui/GenerationLimitDisplay'
import BatchGeneration from '@/components/ui/BatchGeneration'
import PublicGallery from '@/components/ui/PublicGallery'
import CollectionsManager from '@/components/ui/CollectionsManager'
import BatikCard from '@/components/ui/BatikCard'

interface BatikGenerationRequest {
  prompt: string
  motif: string
  style: string
  colors: string[]
  region: string
  complexity: string
}

const batikMotifs = [
  { value: 'parang', label: 'Parang', description: 'Diagonal parallel lines representing strength and bravery' },
  { value: 'kawung', label: 'Kawung', description: 'Four-petal flower pattern symbolizing human desire control' },
  { value: 'mega_mendung', label: 'Mega Mendung', description: 'Cloud motif from Cirebon, representing calmness' },
  { value: 'sido_mukti', label: 'Sido Mukti', description: 'Prosperity pattern for special occasions' },
  { value: 'truntum', label: 'Truntum', description: 'Flower motif symbolizing love and guidance' },
  { value: 'sekar_jagad', label: 'Sekar Jagad', description: 'Flower of the world, representing diversity' },
  { value: 'ceplok', label: 'Ceplok', description: 'Geometric repetitive pattern' },
  { value: 'nitik', label: 'Nitik', description: 'Small dots pattern, often combined with other motifs' }
]

const batikStyles = [
  { value: 'traditional', label: 'Traditional', description: 'Classic hand-drawn batik style' },
  { value: 'contemporary', label: 'Contemporary', description: 'Modern interpretation with traditional elements' },
  { value: 'geometric', label: 'Geometric', description: 'Focus on geometric patterns and symmetry' },
  { value: 'naturalistic', label: 'Naturalistic', description: 'Nature-inspired with flora and fauna' },
  { value: 'abstract', label: 'Abstract', description: 'Modern abstract interpretation' }
]

const batikRegions = [
  { value: 'solo', label: 'Solo (Surakarta)', description: 'Elegant and refined patterns' },
  { value: 'yogyakarta', label: 'Yogyakarta', description: 'Royal court tradition with earth tones' },
  { value: 'cirebon', label: 'Cirebon', description: 'Chinese-influenced coastal style' },
  { value: 'pekalongan', label: 'Pekalongan', description: 'Vibrant colors and innovative designs' },
  { value: 'indramayu', label: 'Indramayu', description: 'Coastal motifs with bold colors' },
  { value: 'madura', label: 'Madura', description: 'Bold and vibrant patterns' },
  { value: 'bali', label: 'Bali', description: 'Hindu-influenced spiritual motifs' }
]

const complexityLevels = [
  { value: 'simple', label: 'Simple', description: 'Clean, minimalist patterns' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced detail and spacing' },
  { value: 'intricate', label: 'Intricate', description: 'Highly detailed traditional complexity' }
]

const colorPalettes = [
  { name: 'Sogan', colors: ['#8B4513', '#DEB887', '#F4E4BC'], description: 'Traditional brown earth tones' },
  { name: 'Indigo Blue', colors: ['#191970', '#4169E1', '#87CEEB'], description: 'Classic blue variations' },
  { name: 'Royal Court', colors: ['#800080', '#FFD700', '#8B4513'], description: 'Purple, gold, and brown' },
  { name: 'Coastal', colors: ['#008080', '#40E0D0', '#F0E68C'], description: 'Teal and yellow coastal colors' },
  { name: 'Modern Earth', colors: ['#228B22', '#CD853F', '#D2691E'], description: 'Green and orange earth tones' },
  { name: 'Vibrant', colors: ['#FF6347', '#FFD700', '#32CD32'], description: 'Bright contemporary colors' }
]

type ActiveTab = 'create' | 'batch' | 'gallery' | 'collections' | 'history'

export default function BatikStudio() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>('create')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBatiks, setGeneratedBatiks] = useState<GeneratedBatik[]>([])
  const [currentGeneration, setCurrentGeneration] = useState<GeneratedBatik | null>(null)
  const [error, setError] = useState('')
  const [generationLimit, setGenerationLimit] = useState<GenerationLimit | null>(null)

  // Form states
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedMotif, setSelectedMotif] = useState('parang')
  const [selectedStyle, setSelectedStyle] = useState('traditional')
  const [selectedColors, setSelectedColors] = useState<string[]>(colorPalettes[0].colors)
  const [selectedPalette, setSelectedPalette] = useState('Sogan')
  const [selectedRegion, setSelectedRegion] = useState('solo')
  const [selectedComplexity, setSelectedComplexity] = useState('moderate')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchGeneratedBatiks()
    }
  }, [isAuthenticated])

  const fetchGeneratedBatiks = async () => {
    try {
      const response = await BatikService.getBatikHistory({ limit: 10 })
      setGeneratedBatiks(response.batiks || [])
    } catch (error) {
      console.error('Error fetching batik history:', error)
      setGeneratedBatiks([])
    }
  }

  const handleColorPaletteChange = (paletteName: string) => {
    const palette = colorPalettes.find(p => p.name === paletteName)
    if (palette) {
      setSelectedPalette(paletteName)
      setSelectedColors(palette.colors)
    }
  }

  const constructPrompt = () => {
    const motif = batikMotifs.find(m => m.value === selectedMotif)
    const style = batikStyles.find(s => s.value === selectedStyle)
    const region = batikRegions.find(r => r.value === selectedRegion)
    const complexity = complexityLevels.find(c => c.value === selectedComplexity)
    
    const colorNames = selectedColors.join(', ')
    
    let prompt = `A high-resolution, seamless digital pattern of Indonesian Batik, ${motif?.label} motif from ${region?.label}. `
    prompt += `The design features ${motif?.description.toLowerCase()}. `
    prompt += `Style: ${style?.description.toLowerCase()}. `
    prompt += `Color palette: ${colorNames} in ${selectedPalette.toLowerCase()} style. `
    prompt += `Complexity: ${complexity?.description.toLowerCase()}. `
    prompt += `2D vector style, traditional Indonesian heritage art, suitable for textile printing.`
    
    if (customPrompt.trim()) {
      prompt += ` Additional details: ${customPrompt}`
    }
    
    return prompt
  }

  const handleGenerateBatik = async () => {
    if (isGenerating || !generationLimit?.canGenerate) return

    try {
      setIsGenerating(true)
      setError('')
      
      const prompt = constructPrompt()
      
      const generationRequest: BatikGenerationRequest = {
        prompt,
        motif: selectedMotif,
        style: selectedStyle,
        colors: selectedColors,
        region: selectedRegion,
        complexity: selectedComplexity
      }

      const response = await BatikService.generateBatik(generationRequest)
      setCurrentGeneration(response)
      setGeneratedBatiks(prev => [response, ...prev])
      
      // Refresh generation limit
      const newLimit = await BatikService.getGenerationLimit()
      setGenerationLimit(newLimit)
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate batik pattern')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBatchComplete = (results: GeneratedBatik[]) => {
    setGeneratedBatiks(prev => [...results, ...prev])
    // Refresh generation limit after batch
    BatikService.getGenerationLimit().then(setGenerationLimit)
  }

  const handleDownloadBatik = async (batikId: string) => {
    try {
      const downloadData = await BatikService.downloadBatik(batikId)
      
      // Create a download link
      const link = document.createElement('a')
      link.href = downloadData.downloadUrl
      link.download = downloadData.filename || `batik-pattern-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Failed to download batik:', error)
      alert('Failed to download pattern')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const tabs = [
    { id: 'create' as ActiveTab, label: 'Create Pattern', icon: '🎨' },
    { id: 'batch' as ActiveTab, label: 'Batch Generate', icon: '⚡' },
    { id: 'gallery' as ActiveTab, label: 'Public Gallery', icon: '🌐' },
    { id: 'collections' as ActiveTab, label: 'My Collections', icon: '📁' },
    { id: 'history' as ActiveTab, label: 'My Patterns', icon: '📜' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/dashboard')} className="text-heritage-600 hover:text-blue-800">
                <h1 className="text-xl font-bold">Tresno Boedoyo</h1>
              </button>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Batik AI Studio</h2>
            </div>
            <div className="text-sm text-gray-600">
              Create and explore traditional Indonesian batik patterns with AI
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-heritage-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Generation Limit Display */}
        <div className="mb-8">
          <GenerationLimitDisplay onLimitUpdate={setGenerationLimit} />
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Custom Prompt */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Prompt</h3>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add custom details to enhance your batik design..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-700"
                />
              </div>

              {/* Motif Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Batik Motif</h3>
                <div className="space-y-2">
                  {batikMotifs.map((motif) => (
                    <label key={motif.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="motif"
                        value={motif.value}
                        checked={selectedMotif === motif.value}
                        onChange={(e) => setSelectedMotif(e.target.value)}
                        className="mt-1 text-heritage-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{motif.label}</div>
                        <div className="text-sm text-gray-600">{motif.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Art Style</h3>
                <div className="space-y-2">
                  {batikStyles.map((style) => (
                    <label key={style.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="style"
                        value={style.value}
                        checked={selectedStyle === style.value}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="mt-1 text-heritage-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{style.label}</div>
                        <div className="text-sm text-gray-600">{style.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h3>
                <div className="space-y-3">
                  {colorPalettes.map((palette) => (
                    <label key={palette.name} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="palette"
                        value={palette.name}
                        checked={selectedPalette === palette.name}
                        onChange={() => handleColorPaletteChange(palette.name)}
                        className="text-heritage-600"
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="flex space-x-1">
                          {palette.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{palette.name}</div>
                          <div className="text-xs text-gray-600">{palette.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Region</h3>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                >
                  {batikRegions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity</h3>
                <div className="space-y-2">
                  {complexityLevels.map((level) => (
                    <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="complexity"
                        value={level.value}
                        checked={selectedComplexity === level.value}
                        onChange={(e) => setSelectedComplexity(e.target.value)}
                        className="mt-1 text-heritage-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateBatik}
                disabled={isGenerating || !generationLimit?.canGenerate}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                  isGenerating || !generationLimit?.canGenerate
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-heritage-600 hover:bg-heritage-700'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
                    </svg>
                    Generating Pattern...
                  </div>
                ) : !generationLimit?.canGenerate ? (
                  'Monthly Limit Reached'
                ) : (
                  'Generate Batik Pattern'
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Panel - Generated Result & History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Generation */}
              {currentGeneration && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Pattern</h3>
                  <BatikCard
                    batik={currentGeneration as any}
                    onDownload={handleDownloadBatik}
                    showInteractions={false}
                    showUser={false}
                  />
                </div>
              )}

              {/* Pattern History */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patterns</h3>
                {generatedBatiks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No patterns generated yet</p>
                    <p className="text-sm">Create your first batik pattern to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedBatiks.slice(0, 6).map((batik) => (
                      <BatikCard
                        key={batik.id}
                        batik={batik as any}
                        onDownload={handleDownloadBatik}
                        showInteractions={false}
                        showUser={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Batch Generation Tab */}
        {activeTab === 'batch' && (
          <BatchGeneration
            onBatchComplete={handleBatchComplete}
            disabled={!generationLimit?.canGenerate}
          />
        )}

        {/* Public Gallery Tab */}
        {activeTab === 'gallery' && <PublicGallery />}

        {/* Collections Tab */}
        {activeTab === 'collections' && <CollectionsManager />}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Patterns</h2>
              <button
                onClick={fetchGeneratedBatiks}
                className="px-4 py-2 text-sm font-medium text-heritage-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>

            {generatedBatiks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No patterns yet</h3>
                <p className="text-gray-600 mb-4">Start creating beautiful batik patterns with AI</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-heritage-600 text-white rounded-md hover:bg-heritage-700"
                >
                  Create Your First Pattern
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {generatedBatiks.map((batik) => (
                  <BatikCard
                    key={batik.id}
                    batik={batik as any}
                    onDownload={handleDownloadBatik}
                    showInteractions={false}
                    showUser={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
