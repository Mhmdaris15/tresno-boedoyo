'use client'

import { useState, useEffect } from 'react'
import { BatikService } from '@/services/batikService'
import { GenerationLimit } from '@/types/batik'

interface GenerationLimitDisplayProps {
  onLimitUpdate?: (limit: GenerationLimit) => void
}

export default function GenerationLimitDisplay({ onLimitUpdate }: GenerationLimitDisplayProps) {
  const [limitInfo, setLimitInfo] = useState<GenerationLimit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLimitInfo()
  }, [])

  const fetchLimitInfo = async () => {
    try {
      setLoading(true)
      const info = await BatikService.getGenerationLimit()
      setLimitInfo(info)
      onLimitUpdate?.(info)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch generation limit')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-600 text-sm">
            <span className="font-medium">Error:</span> {error}
          </div>
          <button
            onClick={fetchLimitInfo}
            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!limitInfo) return null

  const { canGenerate, currentCount, limit, nextReset } = limitInfo
  const remaining = limit - currentCount
  const percentage = (currentCount / limit) * 100

  const resetDate = new Date(nextReset)
  const isResetSoon = resetDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 // 7 days

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Generation Limit</h3>
        <button
          onClick={fetchLimitInfo}
          className="text-gray-400 hover:text-gray-600 text-sm"
          title="Refresh limit info"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Used: {currentCount}/{limit}</span>
          <span className={remaining > 0 ? 'text-green-600' : 'text-red-600'}>
            {remaining > 0 ? `${remaining} remaining` : 'Limit reached'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage < 50 ? 'bg-green-500' :
              percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <div className={`p-3 rounded-lg ${
        canGenerate ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className={`flex items-center text-sm ${
          canGenerate ? 'text-green-800' : 'text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            canGenerate ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {canGenerate ? (
            <>
              <span className="font-medium">Ready to generate!</span>
              <span className="ml-1">You have {remaining} generation{remaining !== 1 ? 's' : ''} left this month.</span>
            </>
          ) : (
            <>
              <span className="font-medium">Monthly limit reached.</span>
              <span className="ml-1">Your limit will reset next month.</span>
            </>
          )}
        </div>
      </div>

      {/* Reset Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Next reset:</span>
          <span className={`font-medium ${isResetSoon ? 'text-heritage-600' : 'text-gray-700'}`}>
            {resetDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Pro tip */}
      {remaining <= 2 && remaining > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start text-sm text-blue-800">
            <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-medium">Pro tip:</span> You're running low on generations! 
              Consider using batch generation to create multiple patterns at once.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
