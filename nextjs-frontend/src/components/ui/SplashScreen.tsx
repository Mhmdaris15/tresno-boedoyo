'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export default function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    // Hide splash screen after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onComplete, duration])

  if (!isVisible) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 opacity-0"
        style={{ background: 'linear-gradient(135deg, var(--color-batik-earth) 0%, var(--color-batik-sunrise) 100%)' }}
      />
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ background: 'linear-gradient(135deg, var(--color-batik-earth) 0%, var(--color-batik-sunrise) 100%)' }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, var(--color-batik-vanilla) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, var(--color-batik-gold) 1px, transparent 1px),
            radial-gradient(circle at 40% 60%, var(--color-batik-vanilla) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 40px 40px, 80px 80px'
        }}
      />
      
      {/* Main Content */}
      <div className="text-center z-10 px-8">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl"
            style={{ 
              background: 'var(--color-batik-vanilla)',
              color: 'var(--color-batik-earth)'
            }}
          >
            🏛️
          </div>
        </div>

        {/* App Name */}
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4 tracking-wide"
          style={{ color: 'var(--color-batik-vanilla)' }}
        >
          Tresno Boedoyo
        </h1>

        {/* Tagline */}
        <p 
          className="text-lg md:text-xl mb-8 font-medium opacity-90"
          style={{ color: 'var(--color-batik-vanilla)' }}
        >
          Preserving Indonesia's Cultural Heritage
        </p>

        {/* Indonesian Heritage Motif */}
        <div className="mb-8">
          <div 
            className="w-32 h-1 mx-auto rounded-full"
            style={{ background: 'var(--color-batik-gold)' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'var(--color-batik-vanilla)'
              }}
            />
          </div>
        </div>

        {/* Traditional Pattern Elements */}
        <div className="flex justify-center space-x-4 text-2xl opacity-80">
          <span 
            className="animate-pulse"
            style={{ 
              color: 'var(--color-batik-vanilla)',
              animationDelay: '0ms',
              animationDuration: '2000ms'
            }}
          >
            ◆
          </span>
          <span 
            className="animate-pulse"
            style={{ 
              color: 'var(--color-batik-gold)',
              animationDelay: '500ms',
              animationDuration: '2000ms'
            }}
          >
            ❋
          </span>
          <span 
            className="animate-pulse"
            style={{ 
              color: 'var(--color-batik-vanilla)',
              animationDelay: '1000ms',
              animationDuration: '2000ms'
            }}
          >
            ◆
          </span>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 text-center">
        <p 
          className="text-sm opacity-75"
          style={{ color: 'var(--color-batik-vanilla)' }}
        >
          Connecting Heritage • Building Future
        </p>
      </div>
    </div>
  )
}
