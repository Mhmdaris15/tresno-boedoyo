'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiClient } from '@/services/apiClient'

interface BatikGenerationRequest {
  prompt: string
  motif: string
  style: string
  colors: string[]
  region: string
  complexity: string
}

interface GeneratedBatik {
  id: string
  prompt: string
  imageUrl: string
  imageBase64: string
  motif: string
  style: string
  colors: string[]
  region: string
  createdAt: string
  userId: string
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

export default function BatikStudio() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBatiks, setGeneratedBatiks] = useState<GeneratedBatik[]>([])
  const [currentGeneration, setCurrentGeneration] = useState<GeneratedBatik | null>(null)
  const [error, setError] = useState('')

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
      const response = await apiClient.getBatikHistory({ limit: 10 })
      setGeneratedBatiks(response.data)
    } catch (error) {
      console.error('Error fetching batik history:', error)
      // Keep empty array as fallback
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
    if (isGenerating) return

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

      // Call the real API
      const response = await apiClient.generateBatik(generationRequest)
      setCurrentGeneration(response.data)
      setGeneratedBatiks(prev => [response.data, ...prev])
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate batik pattern')
    } finally {
      setIsGenerating(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/dashboard')} className="text-blue-600 hover:text-blue-800">
                <h1 className="text-xl font-bold">Tresno Boedoyo</h1>
              </button>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Batik AI Studio</h2>
            </div>
            <div className="text-sm text-gray-600">
              Create traditional Indonesian batik patterns with AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                      className="mt-1 text-blue-600"
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
                      className="mt-1 text-blue-600"
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
                  <div key={palette.name} className="cursor-pointer" onClick={() => handleColorPaletteChange(palette.name)}>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="palette"
                        checked={selectedPalette === palette.name}
                        onChange={() => handleColorPaletteChange(palette.name)}
                        className="text-blue-600"
                      />
                      <div className="flex space-x-1">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{palette.name}</div>
                        <div className="text-sm text-gray-600">{palette.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Region Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Style</h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {batikRegions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label} - {region.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pattern Complexity</h3>
              <div className="space-y-2">
                {complexityLevels.map((complexity) => (
                  <label key={complexity.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="complexity"
                      value={complexity.value}
                      checked={selectedComplexity === complexity.value}
                      onChange={(e) => setSelectedComplexity(e.target.value)}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{complexity.label}</div>
                      <div className="text-sm text-gray-600">{complexity.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateBatik}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Batik...</span>
                </div>
              ) : (
                'Generate Batik Pattern'
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Generated Image and Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Generation */}
            {(currentGeneration || isGenerating) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Batik Pattern</h3>
                
                {isGenerating ? (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Creating your beautiful batik pattern...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
                    </div>
                  </div>
                ) : currentGeneration ? (
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={currentGeneration.imageUrl}
                        alt="Generated Batik Pattern"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Pattern Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Motif:</span>
                        <span className="ml-2 text-gray-900">{batikMotifs.find(m => m.value === currentGeneration.motif)?.label}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Style:</span>
                        <span className="ml-2 text-gray-900">{batikStyles.find(s => s.value === currentGeneration.style)?.label}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Region:</span>
                        <span className="ml-2 text-gray-900">{batikRegions.find(r => r.value === currentGeneration.region)?.label}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Created:</span>
                        <span className="ml-2 text-gray-900">{new Date(currentGeneration.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Color Palette */}
                    <div>
                      <span className="font-medium text-gray-600 text-sm">Colors:</span>
                      <div className="flex space-x-2 mt-1">
                        {currentGeneration.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Download Pattern
                      </button>
                      <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        Save to Gallery
                      </button>
                      <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                        Share Pattern
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Generated Prompt Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Prompt Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{constructPrompt()}</p>
              </div>
            </div>

            {/* Previous Generations */}
            {generatedBatiks.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Generations</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedBatiks.slice(0, 6).map((batik) => (
                    <div key={batik.id} className="cursor-pointer group" onClick={() => setCurrentGeneration(batik)}>
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={batik.imageUrl}
                          alt={`Batik ${batik.motif}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        {batikMotifs.find(m => m.value === batik.motif)?.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Indonesian Batik</h3>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  Batik is a traditional Indonesian textile art that uses a wax-resist dyeing technique. 
                  Each region has its own distinctive styles, motifs, and cultural significance.
                </p>
                <p>
                  UNESCO recognized Indonesian batik as a Masterpiece of Oral and Intangible Heritage 
                  of Humanity in 2009, highlighting its cultural importance and artistic value.
                </p>
                <p>
                  This AI Studio helps preserve and innovate upon these traditional patterns while 
                  respecting their cultural heritage and symbolic meanings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
