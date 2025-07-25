'use client'

import { ReactNode } from 'react'
import SplashScreen from '@/components/ui/SplashScreen'
import { useSplashScreen } from '@/hooks/useSplashScreen'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { showSplash, splashCompleted, isLoading, completeSplash } = useSplashScreen(true)

  // Show loading or splash screen
  if (isLoading || showSplash) {
    return showSplash ? (
      <SplashScreen onComplete={completeSplash} duration={3000} />
    ) : null
  }

  // Show main app content
  return (
    <div className="fade-in">
      {children}
    </div>
  )
}
