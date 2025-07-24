'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Achievement {
  id: string
  title: string
  description: string
  category: string
  pointsAwarded: number
  dateEarned: string
  badgeIcon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
}

export default function AchievementsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // TODO: Fetch real achievements from API
    // For now, using mock data
    setAchievements([
      {
        id: '1',
        title: 'Heritage Guardian',
        description: 'Completed your first heritage preservation project',
        category: 'MILESTONE',
        pointsAwarded: 100,
        dateEarned: '2025-07-15',
        badgeIcon: '🛡️',
        rarity: 'COMMON'
      },
      {
        id: '2',
        title: 'Documentation Master',
        description: 'Successfully documented 50+ heritage artifacts',
        category: 'DOCUMENTATION',
        pointsAwarded: 250,
        dateEarned: '2025-07-20',
        badgeIcon: '📸',
        rarity: 'RARE'
      },
      {
        id: '3',
        title: 'Cultural Ambassador',
        description: 'Educated 100+ students about Indonesian heritage',
        category: 'EDUCATION',
        pointsAwarded: 500,
        dateEarned: '2025-07-22',
        badgeIcon: '🎓',
        rarity: 'EPIC'
      },
      {
        id: '4',
        title: 'Temple Restoration Expert',
        description: 'Contributed to major temple restoration project',
        category: 'RESTORATION',
        pointsAwarded: 1000,
        dateEarned: '2025-07-23',
        badgeIcon: '🏛️',
        rarity: 'LEGENDARY'
      }
    ])
  }, [])

  const filteredAchievements = achievements.filter(achievement => {
    return filter === 'ALL' || achievement.category === filter
  })

  const getTotalPoints = () => {
    return achievements.reduce((total, achievement) => total + achievement.pointsAwarded, 0)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'RARE': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'EPIC': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'LEGENDARY': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MILESTONE': return '🎯'
      case 'DOCUMENTATION': return '📚'
      case 'EDUCATION': return '🎓'
      case 'RESTORATION': return '🔧'
      case 'RESEARCH': return '🔍'
      default: return '⭐'
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
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-blue-600">Tresno Boedoyo</h1>
              </Link>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-medium text-gray-900">Achievements</h2>
            </div>
            <Link 
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Achievements</h2>
          <p className="text-gray-600">
            Track your progress and celebrate your contributions to heritage preservation
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalPoints().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rank</p>
                <p className="text-2xl font-bold text-gray-900">Heritage Guardian</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by category:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="ALL">All Categories</option>
              <option value="MILESTONE">Milestones</option>
              <option value="DOCUMENTATION">Documentation</option>
              <option value="EDUCATION">Education</option>
              <option value="RESTORATION">Restoration</option>
              <option value="RESEARCH">Research</option>
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div key={achievement.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${getRarityColor(achievement.rarity)}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{achievement.badgeIcon}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{getCategoryIcon(achievement.category)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {achievement.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-medium">{achievement.pointsAwarded} points</span>
                  </div>
                  <span>
                    {new Date(achievement.dateEarned).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Rarity indicator */}
              <div className={`h-2 ${achievement.rarity === 'LEGENDARY' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                                     achievement.rarity === 'EPIC' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                                     achievement.rarity === 'RARE' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                     'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏆</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-500 mb-6">
              Start participating in heritage preservation projects to earn your first achievement!
            </p>
            <Link 
              href="/opportunities"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Explore Opportunities
            </Link>
          </div>
        )}

        {/* Achievement Progress */}
        {achievements.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Progress to Next Level</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Heritage Guardian</span>
                <span className="text-sm text-gray-500">Current Level</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{getTotalPoints()} / 2000 points</span>
                <span>Next: Heritage Master</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
