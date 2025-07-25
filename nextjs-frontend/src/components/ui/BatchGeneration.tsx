'use client'

import { useState } from 'react'
import { BatikService } from '@/services/batikService'
import { BatikGenerationRequest, GeneratedBatik } from '@/types/batik'

interface BatchGenerationProps {
  onBatchComplete?: (results: GeneratedBatik[]) => void
  maxBatchSize?: number
  disabled?: boolean
}

const DEFAULT_REQUEST: Partial<BatikGenerationRequest> = {
  motif: 'parang',
  style: 'traditional',
  colors: ['#8B4513', '#DEB887', '#F4E4BC'],
  region: 'solo',
  complexity: 'moderate'
}

export default function BatchGeneration({ 
  onBatchComplete, 
  maxBatchSize = 3, 
  disabled = false 
}: BatchGenerationProps) {
  const [requests, setRequests] = useState<BatikGenerationRequest[]>([
    { ...DEFAULT_REQUEST, prompt: '' } as BatikGenerationRequest
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const addRequest = () => {
    if (requests.length < maxBatchSize) {
      setRequests([...requests, { ...DEFAULT_REQUEST, prompt: '' } as BatikGenerationRequest])
    }
  }

  const removeRequest = (index: number) => {
    if (requests.length > 1) {
      setRequests(requests.filter((_, i) => i !== index))
    }
  }

  const updateRequest = (index: number, field: keyof BatikGenerationRequest, value: any) => {
    const updated = [...requests]
    updated[index] = { ...updated[index], [field]: value }
    setRequests(updated)
  }

  const handleBatchGenerate = async () => {
    if (disabled || isGenerating) return

    // Validate all requests have prompts
    const validRequests = requests.filter(req => req.prompt.trim())
    if (validRequests.length === 0) {
      setError('Please add at least one prompt')
      return
    }

    try {
      setIsGenerating(true)
      setError('')
      
      const results = await BatikService.batchGenerate({ requests: validRequests })
      onBatchComplete?.(results)
      
      // Reset form
      setRequests([{ ...DEFAULT_REQUEST, prompt: '' } as BatikGenerationRequest])
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate batch')
    } finally {
      setIsGenerating(false)
    }
  }

  const canAddMore = requests.length < maxBatchSize
  const hasValidRequests = requests.some(req => req.prompt.trim())

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Batch Generation</h3>
        <span className="text-sm text-gray-500">
          {requests.length}/{maxBatchSize} patterns
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {requests.map((request, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Pattern {index + 1}</h4>
              {requests.length > 1 && (
                <button
                  onClick={() => removeRequest(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={isGenerating}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prompt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt *
                </label>
                <textarea
                  value={request.prompt}
                  onChange={(e) => updateRequest(index, 'prompt', e.target.value)}
                  placeholder="Describe your batik pattern..."
                  className="w-full h-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  disabled={isGenerating}
                />
              </div>

              {/* Motif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif
                </label>
                <select
                  value={request.motif}
                  onChange={(e) => updateRequest(index, 'motif', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isGenerating}
                >
                  <option value="parang">Parang</option>
                  <option value="kawung">Kawung</option>
                  <option value="mega_mendung">Mega Mendung</option>
                  <option value="sido_mukti">Sido Mukti</option>
                  <option value="truntum">Truntum</option>
                  <option value="sekar_jagad">Sekar Jagad</option>
                  <option value="ceplok">Ceplok</option>
                  <option value="nitik">Nitik</option>
                </select>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style
                </label>
                <select
                  value={request.style}
                  onChange={(e) => updateRequest(index, 'style', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isGenerating}
                >
                  <option value="traditional">Traditional</option>
                  <option value="contemporary">Contemporary</option>
                  <option value="geometric">Geometric</option>
                  <option value="naturalistic">Naturalistic</option>
                  <option value="abstract">Abstract</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={request.region}
                  onChange={(e) => updateRequest(index, 'region', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isGenerating}
                >
                  <option value="solo">Solo (Surakarta)</option>
                  <option value="yogyakarta">Yogyakarta</option>
                  <option value="cirebon">Cirebon</option>
                  <option value="pekalongan">Pekalongan</option>
                  <option value="indramayu">Indramayu</option>
                  <option value="madura">Madura</option>
                  <option value="bali">Bali</option>
                </select>
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complexity
                </label>
                <select
                  value={request.complexity}
                  onChange={(e) => updateRequest(index, 'complexity', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isGenerating}
                >
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="intricate">Intricate</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={addRequest}
          disabled={!canAddMore || isGenerating}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            canAddMore && !isGenerating
              ? 'text-heritage-600 bg-blue-50 hover:bg-blue-100 border border-blue-200'
              : 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed'
          }`}
        >
          + Add Pattern ({requests.length}/{maxBatchSize})
        </button>

        <button
          onClick={handleBatchGenerate}
          disabled={!hasValidRequests || disabled || isGenerating}
          className={`px-6 py-2 text-sm font-medium rounded-md ${
            hasValidRequests && !disabled && !isGenerating
              ? 'text-white bg-heritage-600 hover:bg-heritage-700'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
              </svg>
              Generating...
            </div>
          ) : (
            `Generate ${requests.filter(r => r.prompt.trim()).length} Pattern${requests.filter(r => r.prompt.trim()).length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  )
}
