'use client'

import { useEffect, useState } from 'react'

interface Stats {
  volunteers: number
  sites: number
  projects: number
  achievements: number
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    volunteers: 0,
    sites: 0,
    projects: 0,
    achievements: 0
  })

  const finalStats = {
    volunteers: 1247,
    sites: 342,
    projects: 89,
    achievements: 2156
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setStats({
        volunteers: Math.floor(finalStats.volunteers * progress),
        sites: Math.floor(finalStats.sites * progress),
        projects: Math.floor(finalStats.projects * progress),
        achievements: Math.floor(finalStats.achievements * progress)
      })

      if (step >= steps) {
        clearInterval(timer)
        setStats(finalStats)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const statItems = [
    {
      value: stats.volunteers,
      label: 'Active Volunteers',
      description: 'Passionate individuals contributing to heritage preservation'
    },
    {
      value: stats.sites,
      label: 'Heritage Sites',
      description: 'Indonesian cultural sites being preserved and documented'
    },
    {
      value: stats.projects,
      label: 'Active Projects',
      description: 'Ongoing preservation and documentation initiatives'
    },
    {
      value: stats.achievements,
      label: 'Achievements Earned',
      description: 'Recognition tokens awarded for valuable contributions'
    }
  ]

  return (
    <section className="py-20 heritage-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            See how our community is making a difference in preserving Indonesia's cultural heritage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {item.label}
                </div>
                <div className="text-sm text-gray-600">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
